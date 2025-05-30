// This script uses FFmpeg to create a smaller, optimized version of the background video
// To run this script, you'll need FFmpeg installed on your system
// Run with: node compress-video.js

import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get current file path (ES module equivalent of __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure paths
const inputFile = path.join(__dirname, '..', 'public', 'Background.mp4');
const outputFile = path.join(__dirname, '..', 'public', 'Background-optimized.mp4');

console.log('Starting video compression...');
console.log(`Input file: ${inputFile}`);
console.log(`Output file: ${outputFile}`);

// Check if input file exists
if (!fs.existsSync(inputFile)) {
  console.error(`Error: Input file ${inputFile} does not exist.`);
  process.exit(1);
}

// FFmpeg command to optimize the video for web
// This reduces the bitrate, scales the video to 720p, and optimizes for web streaming
const ffmpeg = spawn('ffmpeg', [
  '-i', inputFile,                   // Input file
  '-vf', 'scale=-1:720',             // Scale to 720p height, preserve aspect ratio
  '-c:v', 'libx264',                 // Use H.264 codec
  '-crf', '28',                      // Constant Rate Factor - higher value = more compression (18-28 is good for web)
  '-preset', 'medium',               // Encoding speed preset (slower = better compression)
  '-maxrate', '1.5M',                // Maximum bitrate
  '-bufsize', '2M',                  // Buffer size
  '-movflags', 'faststart',          // Web optimization - metadata at beginning of file for faster starts
  '-pix_fmt', 'yuv420p',             // Pixel format for better compatibility
  '-c:a', 'aac',                     // Audio codec (if there's audio)
  '-b:a', '128k',                    // Audio bitrate
  outputFile                         // Output file
]);

// Handle process events
ffmpeg.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ffmpeg.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ffmpeg.on('close', (code) => {
  if (code === 0) {
    console.log('Video compression completed successfully!');
    
    // Get file sizes for comparison
    const originalSize = fs.statSync(inputFile).size / (1024 * 1024);
    const newSize = fs.statSync(outputFile).size / (1024 * 1024);
    const savings = ((originalSize - newSize) / originalSize) * 100;
    
    console.log(`Original size: ${originalSize.toFixed(2)} MB`);
    console.log(`Optimized size: ${newSize.toFixed(2)} MB`);
    console.log(`Saved: ${savings.toFixed(2)}% of original size`);
    console.log('\nTo use this optimized video, update the VideoBackground.tsx component:');
    console.log('Change: <source src="/Background.mp4" type="video/mp4" />');
    console.log('To: <source src="/Background-optimized.mp4" type="video/mp4" />');
  } else {
    console.error(`FFmpeg process exited with code ${code}`);
  }
});
