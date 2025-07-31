# AutoSheetify Backend Deployment Guide

## For Render Deployment

### Option 1: Using render.yaml (Recommended)
1. Push your code to GitHub
2. Connect your repository to Render
3. Render will automatically detect the `render.yaml` file and create both services

### Option 2: Manual Setup
1. Create a **Web Service** in Render
2. Configure the following settings:

**Basic Settings:**
- **Name:** `autosheetify-backend`
- **Environment:** `Python`
- **Branch:** `tony_update_2` (or your preferred branch)
- **Root Directory:** `backend`

**Build & Deploy:**
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`

**Environment Variables:**
Set these in the Render Dashboard:
- `PYTHON_VERSION` = `3.10.12`
- `SUPABASE_URL` = `your_supabase_project_url`
- `SUPABASE_KEY` = `your_supabase_anon_key`

### Python Version
The backend is configured to use Python 3.10.12, specified in:
- `backend/.python-version`
- `backend/runtime.txt`
- `render.yaml`

### Dependencies
All required packages are listed in `backend/requirements.txt`, including:
- `basic-pitch==0.4.0` (for audio transcription)
- `fastapi==0.116.1` (web framework)
- `uvicorn==0.35.0` (ASGI server)
- `supabase==2.16.0` (database client)
- And all other necessary dependencies

### Key Features
- **Audio to MIDI conversion** using basic-pitch
- **MIDI to PDF conversion** using MuseScore
- **Supabase integration** for user authentication and data storage
- **CORS enabled** for frontend communication
- **File upload handling** with proper validation

### API Endpoints
- `POST /transcribe` - Convert audio/video to MIDI and PDF
- Health check and other endpoints as defined in `main.py`

### Notes
- The basic-pitch model will be downloaded automatically on first use
- MuseScore is required for PDF generation (included in Dockerfile)
- File uploads are stored temporarily in the `uploads` directory
