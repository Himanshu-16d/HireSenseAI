#!/bin/bash

# This script creates multiple video formats and sizes for optimal web delivery
# It requires FFmpeg to be installed

echo "Creating optimized video formats from Background.mp4..."

# Check if FFmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "FFmpeg is not installed. Please install it first."
    echo "Windows: Install via https://ffmpeg.org/download.html"
    echo "macOS: brew install ffmpeg"
    echo "Linux: sudo apt install ffmpeg"
    exit 1
fi

# Create directory for optimized videos
mkdir -p public/videos

# 1. Create a WebM version (better for web, smaller file sizes)
echo "Creating WebM version..."
ffmpeg -i public/Background.mp4 \
    -c:v libvpx-vp9 \
    -crf 30 \
    -b:v 0 \
    -vf "scale=-1:720" \
    -deadline good \
    -cpu-used 2 \
    public/videos/background.webm

# 2. Create a lower-quality MP4 version as fallback
echo "Creating optimized MP4 version..."
ffmpeg -i public/Background.mp4 \
    -c:v libx264 \
    -crf 28 \
    -preset medium \
    -vf "scale=-1:720" \
    -movflags faststart \
    -pix_fmt yuv420p \
    public/videos/background.mp4

# 3. Create a poster image from the video
echo "Creating poster image..."
ffmpeg -i public/Background.mp4 \
    -ss 00:00:01 \
    -vframes 1 \
    -vf "scale=-1:720" \
    public/videos/background-poster.jpg

# Print file sizes for comparison
echo "File sizes for comparison:"
echo "Original: $(du -h public/Background.mp4 | cut -f1)"
echo "WebM version: $(du -h public/videos/background.webm | cut -f1)"
echo "Optimized MP4: $(du -h public/videos/background.mp4 | cut -f1)"

echo "Done! The optimized videos are in public/videos/"
echo "You can now update the VideoBackground.tsx component to use these files"
