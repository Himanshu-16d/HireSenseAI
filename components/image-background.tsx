'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export default function ImageBackground() {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    
    // Preload the background image
    const preloadImage = new window.Image();
    preloadImage.src = '/Background.png';
  }, []);
  
  // Don't render anything until after hydration to prevent flickering
  if (!isMounted) {
    return <div className="fixed inset-0 -z-10 w-full h-full bg-black"></div>;
  }
  
  return (
    <div className="fixed inset-0 -z-10 w-full h-full pointer-events-none overflow-hidden">
      <div className="absolute inset-0">
        <Image 
          src="/Background.png" 
          alt="Background" 
          fill 
          priority
          quality={90}
          sizes="100vw"
          fetchPriority="high"
          decoding="async"
          style={{ 
            objectFit: 'cover',
            objectPosition: 'center'
          }} 
        />
      </div>
      <div className="absolute inset-0 bg-black/30" />
    </div>
  );
}
