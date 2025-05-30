@echo off
echo Creating optimized video formats from Background.mp4...

REM Check if FFmpeg is installed
where ffmpeg >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo FFmpeg is not installed. Please install it first.
    echo You can download it from https://ffmpeg.org/download.html
    echo Or use: winget install ffmpeg
    exit /b 1
)

REM Create directory for optimized videos
mkdir public\videos 2>nul

REM 1. Create a WebM version (better for web, smaller file sizes)
echo Creating WebM version...
ffmpeg -i public\Background.mp4 ^
    -c:v libvpx-vp9 ^
    -crf 30 ^
    -b:v 0 ^
    -vf "scale=-1:720" ^
    -deadline good ^
    -cpu-used 2 ^
    public\videos\background.webm

REM 2. Create a lower-quality MP4 version as fallback
echo Creating optimized MP4 version...
ffmpeg -i public\Background.mp4 ^
    -c:v libx264 ^
    -crf 28 ^
    -preset medium ^
    -vf "scale=-1:720" ^
    -movflags faststart ^
    -pix_fmt yuv420p ^
    public\videos\background.mp4

REM 3. Create a poster image from the video
echo Creating poster image...
ffmpeg -i public\Background.mp4 ^
    -ss 00:00:01 ^
    -vframes 1 ^
    -vf "scale=-1:720" ^
    public\videos\background-poster.jpg

echo Done! The optimized videos are in public\videos\
echo You can now update the VideoBackground.tsx component to use these files
