import os
import subprocess
from basic_pitch.inference import predict_and_save # Import predict_and_save
import pretty_midi # For MIDI processing if needed later
import logging

# Configure logging for better visibility
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# --- IMPORTANT: Basic-Pitch Model Path ---
# This path is essential because basic-pitch in your FastAPI environment
# does not automatically find or download its model.
# For production, we'll use the default model or environment-based path
BP_MODEL_PATH = os.environ.get('BASIC_PITCH_MODEL_PATH', None)
if not BP_MODEL_PATH:
    # Try to use the default basic-pitch model (it will download if needed)
    from basic_pitch import ICASSP_2022_MODEL_PATH
    BP_MODEL_PATH = ICASSP_2022_MODEL_PATH
# --- END MODEL PATH ---

def convert_audio_to_midi(audio_path: str, output_dir: str) -> str:
    """
    Converts an audio file to a MIDI file using basic-pitch.
    Uses an explicitly provided model path.
    """
    try:
        logger.info(f"Attempting to convert audio: {audio_path} to MIDI using model from: {BP_MODEL_PATH}")
        
        # Ensure output directory exists
        os.makedirs(output_dir, exist_ok=True)

        # Generate a unique MIDI filename
        midi_filename = os.path.basename(audio_path).rsplit('.', 1)[0] + "_basic_pitch.mid"
        midi_path = os.path.join(output_dir, midi_filename)

        # Call predict_and_save, explicitly passing the model path
        predict_and_save(
            audio_path_list=[audio_path],
            output_directory=output_dir,
            sonify_midi=False,
            model_or_model_path=BP_MODEL_PATH, # <--- Using the explicit path here!
            save_midi=True,
            save_model_outputs=False,
            save_notes=False
        )
        
        # basic-pitch saves the MIDI with a specific naming convention:
        # original_filename_basic_pitch.mid
        # We need to make sure the midi_path matches what basic-pitch actually saved.
        # The predict_and_save function returns a tuple of lists. The first element is the MIDI paths.
        # However, the primary use case of this function is to get the path for conversion to PDF,
        # so let's verify if the file exists at the expected path.
        if not os.path.exists(midi_path):
            logger.warning(f"MIDI file not found at expected path: {midi_path}. Checking {output_dir} for similar files.")
            found_files = [f for f in os.listdir(output_dir) if f.startswith(os.path.basename(audio_path).rsplit('.', 1)[0]) and f.endswith("_basic_pitch.mid")]
            if found_files:
                midi_path = os.path.join(output_dir, found_files[0])
                logger.info(f"Found MIDI file at: {midi_path}")
            else:
                raise RuntimeError(f"Basic-Pitch did not generate a MIDI file at the expected location for {audio_path}.")

        logger.info(f"Successfully converted {audio_path} to MIDI: {midi_path}")
        return midi_path
    except Exception as e:
        logger.error(f"Error converting audio to MIDI for {audio_path}: {e}", exc_info=True)
        raise RuntimeError(f"Failed to convert audio to MIDI: {str(e)}")


def convert_midi_to_pdf(midi_path: str, output_dir: str) -> str:
    """
    Converts a MIDI file to a PDF sheet music file using MuseScore (via subprocess).
    Requires MuseScore to be installed and in the system's PATH.
    """
    try:
        logger.info(f"Attempting to convert MIDI: {midi_path} to PDF.")
        
        # Ensure output directory exists
        os.makedirs(output_dir, exist_ok=True)

        pdf_filename = os.path.basename(midi_path).rsplit('.', 1)[0] + ".pdf"
        pdf_path = os.path.join(output_dir, pdf_filename)

        # Check if MuseScore is available (skip version check in headless environment)
        musescore_commands = ["musescore3", "musescore", "mscore"]
        musescore_command = None
        
        for cmd in musescore_commands:
            try:
                # Check if command exists without running version (which requires display)
                import shutil
                if shutil.which(cmd):
                    musescore_command = cmd
                    logger.info(f"Found MuseScore command: {cmd}")
                    break
            except Exception as e:
                logger.debug(f"Command {cmd} not available: {e}")
                continue
        
        if musescore_command is None:
            logger.warning("MuseScore not found. PDF generation will be skipped.")
            logger.info("Only MIDI file will be available for download.")
            return None  # Return None to indicate PDF generation was skipped

        # Command to convert MIDI to PDF using MuseScore in headless mode
        # Use environment variable to force headless mode and set platform
        env = os.environ.copy()
        env["QT_QPA_PLATFORM"] = "offscreen"  # Force headless Qt platform
        env["DISPLAY"] = ":99"  # Dummy display
        
        command = [
            musescore_command,
            "--no-gui",          # Disable GUI
            "-o", pdf_path,      # Output file
            midi_path            # Input file
        ]

        logger.info(f"Executing MuseScore command: {' '.join(command)}")
        # Execute the command with modified environment
        result = subprocess.run(command, capture_output=True, text=True, check=True, env=env)
        
        logger.info(f"MuseScore stdout: {result.stdout}")
        if result.stderr:
            logger.warning(f"MuseScore stderr: {result.stderr}")

        if not os.path.exists(pdf_path):
            raise RuntimeError(f"MuseScore failed to generate PDF at {pdf_path}.")

        logger.info(f"Successfully converted {midi_path} to PDF: {pdf_path}")
        return pdf_path
    except subprocess.CalledProcessError as e:
        logger.error(f"MuseScore conversion failed with error code {e.returncode}: {e.stderr}", exc_info=True)
        raise RuntimeError(f"MuseScore conversion failed: {e.stderr}")
    except Exception as e:
        logger.error(f"Error converting MIDI to PDF for {midi_path}: {e}", exc_info=True)
        raise RuntimeError(f"Failed to convert MIDI to PDF: {str(e)}")