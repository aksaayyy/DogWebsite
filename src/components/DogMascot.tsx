"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// Individual components for the dog's anatomy
function RetrieverDog() {
  const dogRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Mesh>(null);
  const bodyRef = useRef<THREE.Mesh>(null);

  const [jumpTime, setJumpTime] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Trigger jump animation
  const triggerJump = () => {
    if (jumpTime === 0) {
      setJumpTime(1);
    }
  };

  useFrame((state, delta) => {
    // 1. Procedural breathing scale effect on body
    if (bodyRef.current) {
      bodyRef.current.scale.y = 1 + Math.sin(state.clock.getElapsedTime() * 2.5) * 0.025;
      bodyRef.current.scale.x = 1 + Math.sin(state.clock.getElapsedTime() * 2.5) * 0.015;
    }

    // 2. Tail wagging (Faster when hovered or jumping)
    if (tailRef.current) {
      const speedMultiplier = jumpTime > 0 ? 30 : isHovered ? 18 : 6;
      tailRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * speedMultiplier) * 0.35;
      // Slight base wag angle
      tailRef.current.rotation.y = Math.cos(state.clock.getElapsedTime() * speedMultiplier) * 0.15;
    }

    // 3. Head follows mouse cursor
    if (headRef.current) {
      // state.pointer (formerly state.mouse) is in normalized device coordinates: -1 to +1
      const targetX = state.pointer.x * 0.45;
      const targetY = state.pointer.y * 0.3;
      
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetX, 0.1);
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, -targetY, 0.1);
    }

    // 4. Jump physics simulation
    if (jumpTime > 0) {
      // Decrease jump timer over time
      const nextJumpTime = jumpTime - delta * 2.5;
      setJumpTime(Math.max(0, nextJumpTime));

      // Sine wave mapping for height
      const jumpY = Math.sin(jumpTime * Math.PI) * 0.7;
      if (dogRef.current) {
        dogRef.current.position.y = -0.2 + jumpY;
        
        // Pitch rotation during jump
        dogRef.current.rotation.x = Math.sin(jumpTime * Math.PI) * -0.2;
      }
    } else {
      if (dogRef.current) {
        dogRef.current.position.y = THREE.MathUtils.lerp(dogRef.current.position.y, -0.2, 0.1);
        dogRef.current.rotation.x = THREE.MathUtils.lerp(dogRef.current.rotation.x, 0, 0.1);
      }
    }
  });

  // Materials
  const furColor = "#eab308"; // Golden
  const bellyColor = "#fef08a"; // Light yellow cream
  const noseColor = "#0f172a"; // Slate/black
  const eyeColor = "#1e293b";
  const collarColor = "#dc2626"; // Red
  const tagColor = "#fbbf24"; // Gold metal tag

  return (
    <group 
      ref={dogRef} 
      position={[0, -0.2, 0]}
      onClick={triggerJump}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
    >
      {/* 1. Body */}
      <mesh ref={bodyRef} position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.7, 0.65, 1.1]} />
        <meshStandardMaterial color={furColor} roughness={0.6} />
      </mesh>
      
      {/* Belly patch */}
      <mesh position={[0, -0.02, 0.56]} castShadow>
        <boxGeometry args={[0.5, 0.45, 0.02]} />
        <meshStandardMaterial color={bellyColor} roughness={0.6} />
      </mesh>

      {/* 2. Head Group (contains ears, snout, eyes) */}
      <group ref={headRef} position={[0, 0.65, 0.45]}>
        {/* Main Head Structure */}
        <mesh castShadow>
          <boxGeometry args={[0.55, 0.5, 0.5]} />
          <meshStandardMaterial color={furColor} roughness={0.6} />
        </mesh>

        {/* Snout */}
        <mesh position={[0, -0.08, 0.35]} castShadow>
          <boxGeometry args={[0.26, 0.22, 0.32]} />
          <meshStandardMaterial color={bellyColor} roughness={0.6} />
        </mesh>

        {/* Nose */}
        <mesh position={[0, 0.02, 0.52]}>
          <boxGeometry args={[0.12, 0.08, 0.08]} />
          <meshStandardMaterial color={noseColor} roughness={0.1} />
        </mesh>

        {/* Left Eye */}
        <mesh position={[-0.14, 0.12, 0.26]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color={eyeColor} roughness={0.1} />
        </mesh>

        {/* Right Eye */}
        <mesh position={[0.14, 0.12, 0.26]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color={eyeColor} roughness={0.1} />
        </mesh>

        {/* Left Ear */}
        <mesh position={[-0.31, 0.02, 0.02]} castShadow>
          <boxGeometry args={[0.1, 0.42, 0.18]} />
          <meshStandardMaterial color={furColor} roughness={0.6} />
        </mesh>

        {/* Right Ear */}
        <mesh position={[0.31, 0.02, 0.02]} castShadow>
          <boxGeometry args={[0.1, 0.42, 0.18]} />
          <meshStandardMaterial color={furColor} roughness={0.6} />
        </mesh>
      </group>

      {/* 3. Collar */}
      <mesh position={[0, 0.35, 0.38]} rotation={[0.4, 0, 0]} castShadow>
        <boxGeometry args={[0.58, 0.08, 0.58]} />
        <meshStandardMaterial color={collarColor} roughness={0.5} />
      </mesh>
      
      {/* Golden Collar Tag */}
      <mesh position={[0, 0.22, 0.6]} rotation={[0.2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.02, 16]} />
        <meshStandardMaterial color={tagColor} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* 4. Legs */}
      {/* Front Left Leg */}
      <mesh position={[-0.22, -0.52, 0.35]} castShadow>
        <boxGeometry args={[0.16, 0.5, 0.16]} />
        <meshStandardMaterial color={furColor} roughness={0.6} />
      </mesh>
      
      {/* Front Right Leg */}
      <mesh position={[0.22, -0.52, 0.35]} castShadow>
        <boxGeometry args={[0.16, 0.5, 0.16]} />
        <meshStandardMaterial color={furColor} roughness={0.6} />
      </mesh>
      
      {/* Back Left Leg */}
      <mesh position={[-0.22, -0.52, -0.35]} castShadow>
        <boxGeometry args={[0.16, 0.5, 0.16]} />
        <meshStandardMaterial color={furColor} roughness={0.6} />
      </mesh>
      
      {/* Back Right Leg */}
      <mesh position={[0.22, -0.52, -0.35]} castShadow>
        <boxGeometry args={[0.16, 0.5, 0.16]} />
        <meshStandardMaterial color={furColor} roughness={0.6} />
      </mesh>

      {/* Paws (White socks detail) */}
      <mesh position={[-0.22, -0.74, 0.37]}>
        <boxGeometry args={[0.18, 0.08, 0.2]} />
        <meshStandardMaterial color={bellyColor} roughness={0.6} />
      </mesh>
      <mesh position={[0.22, -0.74, 0.37]}>
        <boxGeometry args={[0.18, 0.08, 0.2]} />
        <meshStandardMaterial color={bellyColor} roughness={0.6} />
      </mesh>
      <mesh position={[-0.22, -0.74, -0.33]}>
        <boxGeometry args={[0.18, 0.08, 0.2]} />
        <meshStandardMaterial color={bellyColor} roughness={0.6} />
      </mesh>
      <mesh position={[0.22, -0.74, -0.33]}>
        <boxGeometry args={[0.18, 0.08, 0.2]} />
        <meshStandardMaterial color={bellyColor} roughness={0.6} />
      </mesh>

      {/* 5. Tail */}
      <group position={[0, 0.22, -0.52]}>
        {/* Tail base mesh */}
        <mesh ref={tailRef} position={[0, 0.14, -0.18]} rotation={[0.6, 0, 0]} castShadow>
          <boxGeometry args={[0.08, 0.08, 0.44]} />
          <meshStandardMaterial color={furColor} roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
}

// Parent Client Wrapper containing the Canvas
export default function DogMascot() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full bg-orange-50/20 rounded-2xl flex flex-col items-center justify-center text-slate-400 gap-3 border border-orange-100/40">
        <span className="text-3xl animate-pulse">🐕</span>
        <span className="text-xs font-semibold">Loading Milo in 3D...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full cursor-grab active:cursor-grabbing relative select-none">
      <Canvas
        shadows
        camera={{ position: [2.5, 1.8, 3.2], fov: 42 }}
        gl={{ antialias: true }}
      >
        {/* Soft Ambient Light */}
        <ambientLight intensity={0.7} />
        
        {/* Soft Directional Light for studio lighting look */}
        <directionalLight
          castShadow
          position={[5, 8, 4]}
          intensity={1.2}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={15}
          shadow-camera-left={-2}
          shadow-camera-right={2}
          shadow-camera-top={2}
          shadow-camera-bottom={-2}
        />
        
        {/* Point light to add sparkle on the eyes and metallic collar tag */}
        <pointLight position={[1, 2, 2]} intensity={0.6} />

        {/* 3D Mascot Model */}
        <RetrieverDog />

        {/* Shadow Plane floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.96, 0]} receiveShadow>
          <planeGeometry args={[10, 10]} />
          <shadowMaterial opacity={0.12} />
        </mesh>

        {/* Orbit Controls (constrained to maintain clean integration) */}
        <OrbitControls
          enableZoom={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.8}
          minAzimuthAngle={-Math.PI / 3}
          maxAzimuthAngle={Math.PI / 3}
        />
      </Canvas>
      
      {/* Help tooltip */}
      <div className="absolute top-3 left-3 bg-white/70 backdrop-blur-sm border border-slate-100/80 rounded-full px-3 py-1 text-[10px] text-slate-500 font-medium pointer-events-none shadow-sm">
        🖱️ Drag to Rotate • Click to Jump
      </div>
    </div>
  );
}
