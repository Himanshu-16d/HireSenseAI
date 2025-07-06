#!/bin/bash
# Quick start script for running from the scripts directory

echo "Quick Start: NVIDIA AI Python API Server"
echo "=========================================="

# Check if Python is installed
if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
    echo "Error: Python is not installed. Please install Python 3.7+ to continue."
    exit 1
fi

# Use python3 if available, otherwise python
PYTHON_CMD="python3"
if ! command -v python3 &> /dev/null; then
    PYTHON_CMD="python"
fi

echo "Using Python command: $PYTHON_CMD"

# Install dependencies if they don't exist
echo "Installing required packages..."
$PYTHON_CMD -m pip install requests flask flask-cors --user

# Set environment variables
export FLASK_ENV=development
export PYTHON_API_PORT=5001

echo ""
echo "Starting the API server directly..."
echo "The server will be available at: http://localhost:5001"
echo "Press Ctrl+C to stop the server"
echo ""

# Start the server directly
$PYTHON_CMD api-server.py
