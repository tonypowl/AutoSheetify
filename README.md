# Autosheetify

Autosheetify is a web application that converts audio files into MIDI and generates a basic sheet music overview.  
It uses [Basic Pitch](https://github.com/spotify/basic-pitch) for audio-to-MIDI transcription and [MuseScore](https://musescore.org/) for sheet music rendering.

The application consists of:
- **Frontend**: Built with HTML/CSS/JavaScript (or React if specified) and served via Render.
- **Backend**: Python API (Flask/FastAPI) running the transcription and sheet music generation logic.
- **Docker**: Used to containerize the app and install dependencies for both frontend and backend.

---

## Demo

https://github.com/user-attachments/assets/f09c5a8d-52a4-433e-83a9-15ccddb86471

---

## Features
- Audio to MIDI conversion using Basic Pitch
- Sheet music generation using MuseScore
- Fully containerized deployment via Docker
- Hosted frontend and backend on Render
- Privacy-friendly: All processing can be done in a self-contained environment

---

## Tech Stack
- Python 3.10+
- Basic Pitch (audio → MIDI)
- MuseScore (MIDI → sheet music PDF)
- Flask or FastAPI (backend API)
- HTML/CSS/JavaScript or React (frontend)
- Docker (containerization)
- Render (deployment hosting)

---

## Installation (Local)

# Clone the repo
git clone https://github.com/<YOUR_USERNAME>/<YOUR_REPO>.git

# Build Docker image
docker build -t autosheetify .





