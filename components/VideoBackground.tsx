'use client';

/**
 * @deprecated - This component is no longer used. Use ImageBackground instead.
 * DO NOT USE THIS COMPONENT - It has been replaced with a static image background 
 * due to issues with video playback in Vercel deployments.
 */
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export default function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // Check if we're in production only after component is mounted
  const [isProduction, setIsProduction] = useState(false);
  
  // Wait until after hydration to determine environment
  useEffect(() => {
    setIsMounted(true);
    setIsProduction(window.location.hostname !== 'localhost' && 
                   window.location.hostname !== '127.0.0.1');
  }, []);
  
  // Only run video logic after component is mounted to avoid hydration issues
  useEffect(() => {
    // Skip if component isn't mounted yet
    if (!isMounted) return;
    
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

      // If in production, add a timeout to handle potentially slow CDN loading
      const playTimeout = setTimeout(() => {
        // Play the video with error handling
        video.play().catch(error => {
          console.error("Video playback failed:", error);
          setVideoError(true);
        });
      }, isProduction ? 1000 : 0);  // Short delay in production

      // Clean up
      return () => {
        clearTimeout(playTimeout);
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('error', handleError);
      };
    }
  }, [isProduction, isMounted]);

  // Don't render anything on server side or during initial hydration
  if (!isMounted) {
    return <div className="fixed inset-0 -z-10 w-full h-full bg-black"></div>;
  }

  return (
    <div className="fixed inset-0 -z-10 w-full h-full pointer-events-none overflow-hidden bg-gradient-to-b from-black to-slate-900">
      {!videoError && (
        <>
          {/* Use videos from a reliable CDN for production instead of local files */}
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload={isProduction ? "metadata" : "auto"}
            className={`w-full h-full object-cover ${isVideoLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
          >
            {isProduction ? (
              // In production, use an online video that is optimized for web delivery
              <source 
                src="https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-a-city-at-night-11748-large.mp4" 
                type="video/mp4" 
              />
            ) : (
              // In development, use local video
              <source src="/Background.mp4" type="video/mp4" />
            )}
          </video>
        </>
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