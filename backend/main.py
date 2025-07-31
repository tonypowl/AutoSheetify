from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Depends, Header, status, Request
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from supabase import create_client, Client
import os
import shutil
import uuid # Import uuid for unique filenames
import re   # Import re for YouTube URL parsing
from dotenv import load_dotenv

# Load environment variables from the specified file
load_dotenv("supabase_backend.env")

# Ensure process_audio is accessible as part of the 'backend' package
from process_audio import convert_audio_to_midi, convert_midi_to_pdf

app = FastAPI()

# Allow requests from your frontend (adjust if needed)
origins = [
    "http://localhost:8080",   # your current Vite dev server
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://autosheetify-frontend.onrender.com",  # Production frontend URL
    "https://*.onrender.com",  # Allow all Render domains for flexibility
]

# In production, you might want to be more restrictive with origins
if os.environ.get("RENDER"):
    origins.extend([
        "https://autosheetify-frontend.onrender.com",  # Production frontend URL
        # Add your custom domain here if you have one
    ])

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

url: str = os.environ.get("SUPABASE_URL") # Use .get() for safer access
key: str = os.environ.get("SUPABASE_KEY")

if not url or not key:
    raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in supabase_backend.env file")

supabase: Client = create_client(url, key)

# Directory to store uploaded and generated files
UPLOADS_DIR = "uploads"
if not os.path.exists(UPLOADS_DIR):
    os.makedirs(UPLOADS_DIR)


# Dependency to verify Supabase token
async def verify_token(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing or invalid"
        )
    token = authorization.split(" ")[1]

    try:
        # The get_user() method is synchronous.
        # It returns a UserResponse object which has 'user' and potentially 'error' attributes.
        user_response = supabase.auth.get_user(token)
        
        # If user_response.user is None, it means the token is invalid or expired.
        user = user_response.user
        if user is None:
            # Attempt to get a more specific error message if available,
            # but fall back to a generic one if 'error' attribute truly doesn't exist
            # or isn't structured as expected.
            error_message = "Invalid or expired token, user not found."
            if hasattr(user_response, 'error') and user_response.error:
                if isinstance(user_response.error, dict):
                    error_message = user_response.error.get('message', error_message)
                # If it's not a dict, but exists, try converting to string
                else: 
                    error_message = str(user_response.error)
            
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=error_message
            )
        
        # User is a User object (Pydantic model-like), not a dict.
        # It needs to be returned as such for subsequent functions.
        return user 

    except Exception as e:
        # Catch any other exceptions during the process (e.g., network issues, malformed token before Supabase check).
        print(f"Token verification error: {type(e).__name__}: {e}") # Log the specific error type and message
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not validate credentials: {str(e)}"
        )


@app.post("/transcribe")
async def transcribe_audio(
    request: Request,
    file: Optional[UploadFile] = File(None),
    youtube_url: Optional[str] = Form(None),
    instrument: Optional[str] = Form(None),
    current_user: object = Depends(verify_token) # Change type hint to 'object' or 'Any' as it's not a dict
):
    # --- CRUCIAL FIX HERE: Access email and id as attributes, not using .get() ---
    user_email = getattr(current_user, 'email', 'Unknown Email') # Safe access for email
    user_id = getattr(current_user, 'id', 'Unknown ID')         # Safe access for id
    print(f"Transcription request by user: {user_email} (ID: {user_id})")
    # --- END CRUCIAL FIX ---

    if not file and not youtube_url:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No file or YouTube URL provided")

    input_path = None
    original_filename_base = ""

    if file:
        original_filename_base = os.path.splitext(file.filename)[0]
        # Use uuid to ensure unique filenames for uploaded files
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        input_path = os.path.join(UPLOADS_DIR, unique_filename)
        
        try:
            with open(input_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            print(f"File uploaded successfully to: {input_path}")
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to save uploaded file: {e}")

    elif youtube_url:
        print(f"Processing YouTube URL: {youtube_url}")
        try:
            from yt_dlp import YoutubeDL
        except ImportError:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="yt-dlp not installed. Please install it using 'pip install yt-dlp'"
            )

        # Extract video ID for unique naming and cleaner output
        match = re.search(r'(?:v=|youtu\.be\/|embed\/|watch\?v=|\/vi\/)([\w-]{11})', youtube_url)
        if not match:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid YouTube URL format")
        video_id = match.group(1)
        original_filename_base = f"youtube_video_{video_id}"

        # Use a temporary output template that ensures a unique file name and MP3 format
        temp_output_path = os.path.join(UPLOADS_DIR, f"{uuid.uuid4()}_{original_filename_base}.%(ext)s")

        ydl_opts = {
            'format': 'bestaudio/best',
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }],
            'outtmpl': temp_output_path,
            'noplaylist': True,
            'quiet': True,           # Suppress console output from yt-dlp
            'no_warnings': True,     # Suppress warnings from yt-dlp
            'logger': None,          # Ensure no custom logger interferes
            'retries': 3,            # Add retries for robustness
        }
        
        try:
            with YoutubeDL(ydl_opts) as ydl:
                info_dict = ydl.extract_info(youtube_url, download=True)
                # yt-dlp might give a .webm or .m4a then convert, so we need the final path
                # info_dict.get('requested_downloads') provides list of actual paths downloaded
                downloaded_files = ydl.downloaded_info_dicts
                
                if not downloaded_files:
                    raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="No files downloaded from YouTube.")

                # Find the path to the extracted audio (e.g., .mp3 or .wav)
                actual_download_path = None
                for entry in downloaded_files:
                    # Look for the 'filepath' or 'requested_downloads' entry that ends with the preferred codec
                    if 'filepath' in entry and (entry['filepath'].endswith('.mp3') or entry['filepath'].endswith('.wav')):
                        actual_download_path = entry['filepath']
                        break
                    # Sometimes, it might be in the 'info_dict' itself after processing
                    if info_dict.get('_format_note') == 'parsed_manifest' and info_dict.get('requested_downloads'):
                        for dl in info_dict['requested_downloads']:
                            if dl['filepath'].endswith('.mp3') or dl['filepath'].endswith('.wav'):
                                actual_download_path = dl['filepath']
                                break
                    if actual_download_path:
                        break

                if not actual_download_path or not os.path.exists(actual_download_path):
                    raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to locate downloaded YouTube audio file after conversion.")

                input_path = actual_download_path
                # Use title from info_dict as original_filename_base for better frontend display
                original_filename_base = info_dict.get('title', original_filename_base)
            
            print(f"YouTube audio downloaded to: {input_path}")
        except Exception as e:
            # Clean up partial downloads if an error occurs
            if os.path.exists(temp_output_path.replace(".%(ext)s", "")):
                # This needs to be smarter, as yt-dlp might create multiple files.
                # For simplicity, if temp_output_path exists, remove it or its base.
                pass # Complex cleanup for yt-dlp is usually best handled outside of the main flow
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to download or process YouTube audio: {str(e)}")

    # Now, use `input_path` for transcription
    if not input_path:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal error: Input path not set.")

    # Ensure MuseScore and basic-pitch dependencies are available
    # These warnings are from the initial server startup, but worth noting if issues persist.
    # For actual execution, ensure they are correctly installed and configured.

    try:
        # 🔥 Run real pipeline
        print(f"Starting transcription for {input_path} (instrument: {instrument})...")
        midi_path = convert_audio_to_midi(input_path, UPLOADS_DIR)
        print(f"MIDI generated: {midi_path}")
        pdf_path = convert_midi_to_pdf(midi_path, UPLOADS_DIR)
        print(f"PDF generated: {pdf_path}")

        # Construct URLs for the frontend - use environment-based URL
        # Get the base URL from environment or construct from request
        base_url = os.getenv("BACKEND_URL")
        
        # If no environment variable, construct from request
        if not base_url:
            scheme = "https" if request.url.scheme == "https" or "onrender.com" in str(request.url.hostname) else "http"
            port = f":{request.url.port}" if request.url.port and request.url.port not in [80, 443] else ""
            base_url = f"{scheme}://{request.url.hostname}{port}"
        
        sheet_url = f"{base_url}/static/{os.path.basename(pdf_path)}" if pdf_path else None
        midi_url = f"{base_url}/static/{os.path.basename(midi_path)}"

        return {
            "status": "success",
            "sheet_url": sheet_url,
            "midi_url": midi_url,
            "original_filename": original_filename_base # Pass original base name for frontend
        }

    except Exception as e:
        print(f"Transcription pipeline failed: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Transcription pipeline failed: {str(e)}")
    finally:
        # Temporarily disable cleanup to allow frontend to fetch files.
        # In a production app, manage these files in persistent storage (e.g., Supabase Storage, S3)
        # or with a separate cleanup process (e.g., a scheduled task).
        if input_path and os.path.exists(input_path):
            # os.remove(input_path) # Commented out
            pass
        # Clean up MIDI and PDF files as well
        if 'midi_path' in locals() and os.path.exists(midi_path):
            # os.remove(midi_path) # Commented out
            pass
        if 'pdf_path' in locals() and os.path.exists(pdf_path):
            # os.remove(pdf_path) # Commented out
            pass


# -----------------------------
# /history endpoint (stub)
# -----------------------------
@app.get("/history")
async def get_transcription_history(current_user: object = Depends(verify_token)): # Change type hint to 'object' or 'Any'
    # --- CRUCIAL FIX HERE: Access email and id as attributes, not using .get() ---
    user_email = getattr(current_user, 'email', 'Unknown Email')
    user_id = getattr(current_user, 'id', 'Unknown ID')
    print(f"Fetching history for user: {user_email} (ID: {user_id})")
    # --- END CRUCIAL FIX ---
    return {
        "history": [
            {
                "file": "song1.mp3",
                "sheet_url": "https://your-storage.com/sheets/song1.pdf", # Placeholder URL
                "timestamp": "2025-07-16T12:00:00"
            },
            {
                "file": "song2.wav",
                "sheet_url": "https://your-storage.com/sheets/song2.pdf", # Placeholder URL
                "timestamp": "2025-07-15T09:45:00"
            }
        ]
    }

# -----------------------------
# Serve uploaded files (for results)
# -----------------------------
from fastapi.staticfiles import StaticFiles
app.mount("/static", StaticFiles(directory=UPLOADS_DIR), name="static")