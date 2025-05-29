'use client';

import { Suspense, useCallback } from 'react';
import dynamic from 'next/dynamic';

const Spline = dynamic(() => import('@splinetool/react-spline').then(m => {
  const Component = m.default;
  return function SplineWrapper(props: any) {
    return <Component {...props} />;
  };
}), { ssr: false });

const SplineComponent = () => {
  const onLoad = useCallback(() => {
    console.log('Spline scene loaded');
  }, []);
  return (
    <div className="fixed inset-0 -z-10 h-full w-full">
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 to-background/95" />
      <Suspense fallback={<div>Loading 3D Scene...</div>}>
        <Spline
          scene="https://prod.spline.design/u6OCClH5NCdUP2MG/scene.splinecode"
          style={{
            width: '1440px',
            height: '1080px'
          }}
          onLoad={onLoad}
        />
      </Suspense>
    </div>
  );
};

export default SplineComponent;
