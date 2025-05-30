'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import backgrounds with no SSR
const VideoBackground = dynamic(() => import('@/components/VideoBackground'), { ssr: false });
const StaticBackground = dynamic(() => import('@/components/StaticBackground'), { ssr: false });

export default function BackgroundWrapper() {
  // Check if we're in production (will run on client side only)
  const isProduction = typeof window !== 'undefined' && 
                      window.location.hostname !== 'localhost' && 
                      window.location.hostname !== '127.0.0.1';
  
  return (
    <>
      {/* VideoBackground now handles different sources for prod vs dev */}
      <VideoBackground />
      
      {/* We'll include StaticBackground but hide it initially */}
      <div id="static-bg-fallback" style={{ display: 'none', opacity: 0 }}>
        <StaticBackground />
      </div>
      
      {/* Script to show fallback if video fails to load within 2.5 seconds */}
      <script dangerouslySetInnerHTML={{ __html: `
        setTimeout(() => {
          const video = document.querySelector('video');
          const fallback = document.getElementById('static-bg-fallback');
          
          if (!video || video.readyState < 2 || !video.currentTime) {
            // Video isn't ready or playing, show fallback
            if (fallback) {
              fallback.style.display = 'block';
              setTimeout(() => {
                fallback.style.opacity = '1';
                fallback.style.transition = 'opacity 0.5s ease-in';
              }, 50);
            }
          } else {
            // Video is playing fine
            if (video.style) video.style.opacity = '1';
          }
        }, 2500);
      `}} />
    </>
  );
}
