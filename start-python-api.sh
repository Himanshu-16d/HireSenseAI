#!/bin/bash
# Startup script for the Python NVIDIA AI API server

echo "Starting NVIDIA AI Python API Server for HireSenseAI"
echo "=================================================="

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is not installed. Please install Python 3.7+ to continue."
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "scripts/api-server.py" ]; then
    echo "Error: Please run this script from the HireSenseAI root directory"
    exit 1
fi

# Create virtual environment if it doesn't exist
if [ ! -d "scripts/venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv scripts/venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source scripts/venv/bin/activate || source scripts/venv/Scripts/activate

# Install dependencies
echo "Installing Python dependencies..."
pip install -r scripts/requirements.txt

# Set environment variables
export FLASK_ENV=development
export PYTHON_API_PORT=5001

# Check if NVIDIA API key is set
if [ -z "$NVIDIA_API_KEY" ]; then
    echo "Warning: NVIDIA_API_KEY environment variable is not set."
    echo "Please set your API key by running:"
    echo "  export NVIDIA_API_KEY=your_api_key_here"
    echo "Or create a .env file in the scripts directory with your API key."
    echo "Get your API key from: https://developer.nvidia.com/"
    echo ""
    echo "The server will not work without a valid API key."
    echo "Press Ctrl+C to exit or Enter to continue anyway..."
    read -r
fi

echo ""
echo "Starting the API server..."
echo "The server will be available at: http://localhost:5001"
echo "Health check: http://localhost:5001/health"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the server
cd scripts
python api-server.py
