'use client';

import React, { useEffect, useRef } from 'react';
import { Application } from '@splinetool/runtime';

// Loading placeholder
function SplineLoader() {
  return (
    <div className="fixed inset-0 z-[-1] bg-gradient-to-b from-black via-purple-950/30 to-black">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-blue-600/10 blur-3xl"></div>
      <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-pink-600/10 blur-3xl"></div>
    </div>
  );
}

export default function SplineBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    if (!canvasRef.current) return;

    const app = new Application(canvasRef.current);
    
    app.load('https://prod.spline.design/aV5s92tKcR2kaz8I/scene.splinecode')
      .then(() => {
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading Spline scene:', error);
      });

    return () => {
      // Cleanup
      app.dispose();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
      {loading && <SplineLoader />}
      <canvas
        ref={canvasRef}
        style={{ 
          width: '100vw', 
          height: '100vh',
          display: loading ? 'none' : 'block'
        }}
      />
    </div>
  );
} 