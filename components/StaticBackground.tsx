'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export default function StaticBackground() {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Don't render anything until after hydration
  if (!isMounted) {
    return <div className="fixed inset-0 -z-10 w-full h-full bg-black"></div>;
  }
  
  return (
    <div className="fixed inset-0 -z-10 w-full h-full pointer-events-none overflow-hidden bg-gradient-to-b from-black to-slate-900">
      {/* Static background with parallax effect using the webp images */}
      {['/1.webp', '/2.webp', '/3.webp'].map((src, index) => (
        <div 
          key={src}
          className="absolute inset-0" 
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
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
}
