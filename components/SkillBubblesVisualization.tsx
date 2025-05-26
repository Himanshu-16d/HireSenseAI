'use client';

import React, { useEffect, useRef } from 'react';
import { Application } from '@splinetool/runtime';

export default function SkillBubblesVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    if (!canvasRef.current) return;

    const app = new Application(canvasRef.current);
    
    // Using a floating bubbles visualization from Spline
    app.load('https://prod.spline.design/oPT5NUMnJMYYfkBP/scene.splinecode')
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
    <div className="relative w-full h-[400px] rounded-xl overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-card/80">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{
          display: loading ? 'none' : 'block'
        }}
      />
    </div>
  );
} 