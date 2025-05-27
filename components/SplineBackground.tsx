'use client';

import React, { useState, Suspense, useEffect, useCallback } from 'react';
import Spline from '@splinetool/react-spline';
import { useIsMobile } from '@/hooks/use-mobile';
import { SplineErrorBoundary } from './spline-error-boundary';

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

interface SplineContainerProps {
  onLoad: () => void;
  onError: (error: unknown) => void;
}

const SplineContainer: React.FC<SplineContainerProps> = ({ onLoad, onError }) => {
  useEffect(() => {
    // Add logging for debugging
    const handleError = (error: ErrorEvent) => {
      console.error('Spline error:', error);
      onError(error.error);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, [onError]);

  return (
    <Spline 
      scene="https://prod.spline.design/6Wq1Q9sz-dYPfujx/scene.splinecode"
      onLoad={onLoad}
      onError={(e: unknown) => {
        console.error('Spline onError:', e);
        onError(e);
      }}
      style={{
        width: '100%',
        height: '100%',
        display: 'block'
      }}
    />
  );
};

export default function SplineBackground() {
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleSplineLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleSplineError = useCallback((error: unknown) => {
    console.error('Spline component error:', error);
    setHasError(true);
    setIsLoading(false);
  }, []);

  // Return early if mobile or has error
  if (isMobile || hasError) {
    return <FallbackBackground />;
  }

  return (
    <>
      {isLoading && <FallbackBackground />}
      <div 
        className={`fixed inset-0 w-full h-full ${
          isLoading ? 'opacity-0' : 'opacity-80'
        } transition-opacity duration-1000`}
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          overflow: 'hidden',
          pointerEvents: 'none'
        }}
      >
        <SplineErrorBoundary fallback={<FallbackBackground />}>
          <Suspense fallback={<FallbackBackground />}>
            <div className="w-full h-full">
              <SplineContainer 
                onLoad={handleSplineLoad}
                onError={handleSplineError}
              />
            </div>
          </Suspense>
        </SplineErrorBoundary>
      </div>
    </>
  );
}