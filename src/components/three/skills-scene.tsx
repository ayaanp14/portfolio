"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { 
  Environment, 
  ContactShadows, 
  Preload, 
  CameraControls 
} from "@react-three/drei";
import * as THREE from "three";
import { NeuralNetwork } from "./neural-network";

type SkillsSceneProps = {
  onSkillClick: (id: string) => void;
  activeSkillId: string | null;
};

function SceneContent({ onSkillClick, activeSkillId }: SkillsSceneProps) {
  const controlsRef = useRef<CameraControls>(null);
  
  // Gently rotate the whole neural network if no skill is active
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!activeSkillId && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <>
      <CameraControls 
        ref={controlsRef}
        makeDefault
        minDistance={5}
        maxDistance={20}
        dampingFactor={0.05}
      />

      <Environment preset="city" />
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color="#00f0ff" />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#9d4edd" />

      <group ref={groupRef}>
        <NeuralNetwork onSkillClick={onSkillClick} activeSkillId={activeSkillId} controlsRef={controlsRef} />
      </group>

      <ContactShadows 
        position={[0, -4, 0]} 
        opacity={0.4} 
        scale={40} 
        blur={2} 
        far={10} 
        color="#000000"
      />
    </>
  );
}

export function SkillsScene({ onSkillClick, activeSkillId }: SkillsSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 12], fov: 45 }}
      dpr={typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1}
      gl={{ 
        powerPreference: "high-performance",
        antialias: false,
        stencil: false,
        depth: true
      }}
    >
      <SceneContent onSkillClick={onSkillClick} activeSkillId={activeSkillId} />
      <Preload all />
    </Canvas>
  );
}
