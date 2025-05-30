'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import backgrounds with no SSR
const VideoBackground = dynamic(() => import('@/components/VideoBackground'), { ssr: false });
const StaticBackground = dynamic(() => import('@/components/StaticBackground'), { ssr: false });

export default function BackgroundWrapper() {
  // State to manage which background is visible
  const [showFallback, setShowFallback] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    // Mark component as mounted to avoid hydration mismatch
    setMounted(true);
    
    // Check video loading after a delay
    const timer = setTimeout(() => {
      const video = document.querySelector('video');
      if (!video || video.readyState < 2 || !video.currentTime) {
        // Video isn't ready or playing, show fallback
        setShowFallback(true);
      }
    }, 2500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Avoid rendering anything during server-side rendering or before hydration
  if (!mounted) {
    return null;
  }
  
  return (
    <>
      {/* Always render VideoBackground */}
      <VideoBackground />
      
      {/* Show StaticBackground only when needed */}
      {showFallback && <StaticBackground />}
    </>
  );
}
