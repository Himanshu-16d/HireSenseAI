'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

interface ImageBackgroundProps {
  backgroundType?: 'home' | 'other';
}

export default function ImageBackground({ backgroundType }: ImageBackgroundProps) {
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  
  // Determine which background to use based on the path or the prop
  const isHomePage = pathname === '/';
  const useHomeBackground = backgroundType === 'home' || (backgroundType === undefined && isHomePage);
  const backgroundImage = useHomeBackground ? '/Background.png' : '/Background(2).png';
  
  useEffect(() => {
    setIsMounted(true);
    
    // Preload the background image
    const preloadImage = new window.Image();
    preloadImage.src = backgroundImage;
  }, [backgroundImage]);
  
  // Don't render anything until after hydration to prevent flickering
  if (!isMounted) {
    return <div className="fixed inset-0 -z-10 w-full h-full bg-black"></div>;
  }
  
  return (
    <div className="fixed inset-0 -z-10 w-full h-full pointer-events-none overflow-hidden">
      <div className="absolute inset-0">
        <Image 
          src={backgroundImage} 
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
