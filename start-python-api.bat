@echo off
REM Startup script for the Python NVIDIA AI API server (Windows)

echo Starting NVIDIA AI Python API Server for HireSenseAI
echo ==================================================

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH. Please install Python 3.7+ to continue.
    pause
    exit /b 1
)

REM Check if we're in the right directory
if not exist "scripts\api-server.py" (
    echo Error: Please run this script from the HireSenseAI root directory
    pause
    exit /b 1
)

REM Create virtual environment if it doesn't exist
if not exist "scripts\venv" (
    echo Creating Python virtual environment...
    python -m venv scripts\venv
)

REM Activate virtual environment
echo Activating virtual environment...
call scripts\venv\Scripts\activate.bat

REM Install dependencies
echo Installing Python dependencies...
pip install -r scripts\requirements.txt

REM Set environment variables
set FLASK_ENV=development
set PYTHON_API_PORT=5001

REM Check if NVIDIA API key is set
if "%NVIDIA_API_KEY%"=="" (
    echo Warning: NVIDIA_API_KEY environment variable is not set.
    echo Please set your API key by running:
    echo   set NVIDIA_API_KEY=your_api_key_here
    echo Or create a .env file in the scripts directory with your API key.
    echo Get your API key from: https://developer.nvidia.com/
    echo.
    echo The server will not work without a valid API key.
    echo Press any key to continue anyway or Ctrl+C to exit...
    pause >nul
)

echo.
echo Starting the API server...
echo The server will be available at: http://localhost:5001
echo Health check: http://localhost:5001/health
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the server
cd scripts
python api-server.py

pause
