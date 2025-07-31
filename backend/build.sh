#!/bin/bash
set -e

echo "Installing MuseScore..."
apt-get update
apt-get install -y musescore3

echo "Installing Python dependencies..."
pip install -r requirements.txt

echo "Build completed successfully!"
