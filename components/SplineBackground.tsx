'use client';

/**
 * @deprecated - This component is no longer used. Use ImageBackground instead.
 * DO NOT USE THIS COMPONENT - It has been replaced with a static image background 
 * for better performance and compatibility with Vercel deployments.
 */
import React, { useRef, useEffect, useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import * as THREE from 'three';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, MeshPhysicalMaterial } from '@react-three/drei';

interface SplineBackgroundProps {
  sceneUrl?: string;
}

function Earth() {
  const earthRef = useRef<THREE.Mesh>(null);
  const [colorMap, normalMap, specularMap] = useLoader(THREE.TextureLoader, [
    '/earth/color.jpg',
    '/earth/normal.jpg',
    '/earth/specular.jpg'
  ]);
  
  // Configure the textures
  [colorMap, normalMap, specularMap].forEach(texture => {
    if (texture) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.colorSpace = THREE.SRGBColorSpace;
    }
  });

  useFrame(({ clock }) => {
    if (earthRef.current) {
      earthRef.current.rotation.y = clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <mesh ref={earthRef}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshPhysicalMaterial
        map={colorMap}
        normalMap={normalMap}
        metalnessMap={specularMap}
        metalness={0.4}
        roughness={0.7}
        envMapIntensity={0.8}
        clearcoat={0.2}
        clearcoatRoughness={0.2}
      />
    </mesh>
  );
}

export default function SplineBackground({ sceneUrl = "" }: SplineBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #000000 0%, #050816 100%)',
        overflow: 'hidden',
      }}
    >
      <Canvas
        camera={{
          position: [0, 0, 6],
          fov: 45,
          near: 0.1,
          far: 1000
        }}
      >
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.3}
          autoRotate
          autoRotateSpeed={0.5}
          minPolarAngle={Math.PI / 2.5}
          maxPolarAngle={Math.PI / 1.5}
        />
        <ambientLight intensity={0.2} />
        <directionalLight position={[5, 3, 5]} intensity={1.5} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <hemisphereLight intensity={0.5} groundColor="#000000" />
        <Suspense fallback={null}>
          <Earth />
        </Suspense>
      </Canvas>
    </div>
  );
}