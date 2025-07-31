# Base image with Python 3.10
FROM python:3.10-slim

# Set working directory in the container
WORKDIR /app

# Install system dependencies (adjust as needed)
RUN apt-get update && apt-get install -y \
    ffmpeg \
    musescore3 \
    git \
    xvfb \
    qt5-default \
    libqt5gui5 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy dependency list
COPY requirements.txt .

# Install Python dependencies
RUN pip3 install --no-cache-dir -r requirements.txt

# Copy entire backend code into the container
COPY . .

# Expose FastAPI's default port
EXPOSE $PORT

# Start the FastAPI app with uvicorn
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-10000} --timeout-keep-alive 600"]
