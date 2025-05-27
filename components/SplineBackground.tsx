'use client';

import React, { useState } from 'react';
import Spline from '@splinetool/react-spline';
import { useIsMobile } from '@/hooks/use-mobile';

const FallbackBackground = () => (
  <>
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -2,
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        opacity: 0.9,
        pointerEvents: 'none',
      }}
    />
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        width: '100vw',
        height: '100vh',
        background: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 50%)',
        animation: 'pulse 8s infinite',
        pointerEvents: 'none',
      }}
    />
    <div 
      className="fixed inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
    />
  </>
);

export default function SplineBackground() {
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleSplineLoad = () => {
    setIsLoading(false);
  };

  const handleSplineError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  if (isMobile || hasError) {
    return <FallbackBackground />;
  }

  return (
    <>
      {isLoading && <FallbackBackground />}
      <div className={`spline-container ${isLoading ? 'opacity-0' : 'opacity-80'} transition-opacity duration-1000`}>
        <Spline 
          scene="https://prod.spline.design/gd4V6RLXsN5J1Qe5/scene.splinecode"
          onLoad={handleSplineLoad}
          onError={handleSplineError}
        />
      </div>
    </>
  );
}