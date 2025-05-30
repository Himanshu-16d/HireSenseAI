'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export default function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  
  // In production, use a lower res video with preload and data-src pattern
  const isProduction = typeof window !== 'undefined' && window.location.hostname !== 'localhost';
  const hasOptimizedVideos = false; // Set this to true after running the optimization scripts
  
  useEffect(() => {
    const video = videoRef.current;
    
    if (video) {
      // Handle video loaded
      const handleLoadedData = () => {
        setIsVideoLoaded(true);
        console.log("Video loaded successfully");
      };

      // Handle video error
      const handleError = (e: any) => {
        console.error("Video loading error:", e);
        setVideoError(true);
      };

      // Add event listeners
      video.addEventListener('loadeddata', handleLoadedData);
      video.addEventListener('error', handleError);

      // In production, use progressive loading technique
      if (isProduction && video.dataset.src) {
        // Small timeout to ensure other page elements load first
        setTimeout(() => {
          video.src = video.dataset.src;
          video.load();
        }, 1000);
      } else {
        // Play the video with error handling
        video.play().catch(error => {
          console.error("Video playback failed:", error);
          setVideoError(true);
        });
      }

      // Clean up
      return () => {
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('error', handleError);
      };
    }
  }, [isProduction]);

  return (
    <div className="fixed inset-0 -z-10 w-full h-full pointer-events-none overflow-hidden bg-gradient-to-b from-black to-slate-900">
      {!videoError && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          poster={hasOptimizedVideos ? "/videos/background-poster.jpg" : undefined}
          preload={isProduction ? "none" : "auto"}
          className={`w-full h-full object-cover ${isVideoLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
        >
          {hasOptimizedVideos ? (
            <>
              {/* Optimized video sources - WebM first for better performance */}
              <source src="/videos/background.webm" type="video/webm" />
              <source src="/videos/background.mp4" type="video/mp4" />
            </>
          ) : (
            // Original video source
            <source src="/Background.mp4" type="video/mp4" />
          )}
        </video>
      )}
      {videoError && (
        <div className="w-full h-full">
          {/* Fallback to static image if available */}
          {['/1.webp', '/2.webp', '/3.webp'].map((src, index) => (
            <div 
              key={src}
              className="absolute inset-0 opacity-30" 
              style={{ 
                zIndex: -10 + index,
                transform: `translateZ(${-10 * (index + 1)}px)`,
                opacity: 0.4 - (index * 0.1)
              }}
            >
              <Image 
                src={src} 
                alt="Background" 
                fill 
                style={{ objectFit: 'cover' }} 
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      )}
      <div className="absolute inset-0 bg-black/20" />
    </div>
  );
}