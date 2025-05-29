'use client';

import React from 'react';

interface VideoBackgroundProps {
  videoSrc?: string;
}

export default function VideoBackground({ videoSrc = "/Background.mp4" }: VideoBackgroundProps) {
  const [isLoading, setIsLoading] = React.useState(true);
  
  React.useEffect(() => {
    // Force the component to rerender when in production to handle Vercel's asset paths
    setIsLoading(false);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #000000 0%, #050816 100%)', // Fallback color
      }}
    >
      <video
        key={isLoading ? 'loading' : 'loaded'}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
        onError={(e) => {
          console.error('Video loading error:', e);
        }}
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
        }}
      />
    </div>
  );
}