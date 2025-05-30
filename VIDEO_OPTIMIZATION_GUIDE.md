# Video Background Optimization Guide

Follow these steps to optimize the background video for Vercel deployment:

## Step 1: Install FFmpeg

FFmpeg is needed to optimize and convert video files.

### Windows:
```
winget install ffmpeg
```
or download from https://ffmpeg.org/download.html

### macOS:
```
brew install ffmpeg
```

### Linux:
```
sudo apt install ffmpeg
```

## Step 2: Run the Optimization Script

### Windows:
```
cd c:\Users\hackw\Desktop\HireSenseAI
.\scripts\optimize-video.bat
```

### macOS/Linux:
```
cd ~/Desktop/HireSenseAI
chmod +x ./scripts/optimize-video.sh
./scripts/optimize-video.sh
```

## Step 3: Update the VideoBackground Component

After generating the optimized videos, update the VideoBackground.tsx file:

1. Open `components/VideoBackground.tsx`
2. Change `const hasOptimizedVideos = false;` to `const hasOptimizedVideos = true;`
3. Save the file

## Step 4: Test Locally

Run your application locally to make sure the optimized video works:
```
pnpm run dev
```

## Step 5: Commit and Deploy

```
git add public/videos components/VideoBackground.tsx
git commit -m "Add optimized video formats for better loading performance"
git push origin main
```

Vercel should automatically redeploy with your changes.

## Troubleshooting

If you still have issues with the video in Vercel:
1. Try using only the optimized MP4 file
2. Further reduce the resolution to 480p instead of 720p
3. Consider using a GIF or static image as a last resort
