'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import background with no SSR to avoid hydration issues
const ImageBackground = dynamic(() => import('@/components/image-background'), { 
  ssr: false,
  loading: () => <div className="fixed inset-0 -z-10 w-full h-full bg-black"></div>
});

export default function BackgroundWrapper() {
  return (
    <Suspense fallback={<div className="fixed inset-0 -z-10 w-full h-full bg-black"></div>}>
      <ImageBackground />
    </Suspense>
  );
}
