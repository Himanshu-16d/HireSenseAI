# Video Optimization Instructions

Since the Background.mp4 file isn't loading properly in the Vercel deployment, please follow these steps to optimize it:

1. Install FFmpeg if you don't have it already:
   - Windows: Download from https://ffmpeg.org/download.html or use `winget install ffmpeg`
   - Mac: `brew install ffmpeg`
   - Linux: `sudo apt install ffmpeg` or equivalent

2. Run the optimization script:
   ```bash
   node scripts/compress-video.js
   ```

3. This will create an optimized video file called `Background-optimized.mp4` in your public folder

4. Update the VideoBackground.tsx file to use the optimized video:
   ```tsx
   <source src="/Background-optimized.mp4" type="video/mp4" />
   ```

5. The optimized video should be significantly smaller and load faster in Vercel

If you don't want to run the script, you can also manually optimize the video using:

```bash
ffmpeg -i public/Background.mp4 -vf scale=-1:720 -c:v libx264 -crf 28 -preset medium -maxrate 1.5M -bufsize 2M -movflags faststart -pix_fmt yuv420p public/Background-optimized.mp4
```
