@echo off
REM Quick start script for running from the scripts directory (Windows)

echo Quick Start: NVIDIA AI Python API Server
echo ==========================================

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH.
    echo Please install Python 3.7+ to continue.
    pause
    exit /b 1
)

echo Installing required packages...
python -m pip install requests flask flask-cors --user

REM Set environment variables
set FLASK_ENV=development
set PYTHON_API_PORT=5001

echo.
echo Starting the API server directly...
echo The server will be available at: http://localhost:5001
echo Press Ctrl+C to stop the server
echo.

REM Start the server directly
python api-server.py

pause
