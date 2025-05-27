'use client';

import React from 'react';

const AnimatedGradient = () => (
  <div className="fixed inset-0 -z-10 h-full w-full">
    {/* Main background gradient */}
    <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background" />
    
    {/* Animated blobs */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -inset-[100px] opacity-50">
        <div 
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 blur-3xl animate-pulse"
          style={{ animationDuration: '8s' }}
        />
        <div 
          className="absolute top-2/3 right-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-blue-500/30 to-teal-500/30 blur-3xl animate-pulse"
          style={{ animationDuration: '10s', animationDelay: '1s' }}
        />
        <div 
          className="absolute top-1/3 right-1/3 w-[400px] h-[400px] rounded-full bg-gradient-to-r from-indigo-500/30 to-violet-500/30 blur-3xl animate-pulse"
          style={{ animationDuration: '12s', animationDelay: '2s' }}
        />
      </div>
    </div>

    {/* Grid pattern overlay */}
    <div className="absolute inset-0">
      <div 
        className="h-full w-full"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px'
        }}
      />
    </div>

    {/* Radial gradient overlay */}
    <div 
      className="absolute inset-0"
      style={{
        background: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(0,0,0,0.3) 100%)'
      }}
    />
  </div>
);

export default function Background() {
  return <AnimatedGradient />;
}