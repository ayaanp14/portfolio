"use client";

import { useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Float, Html } from "@react-three/drei";
import { type SkillNode } from "@/data/skills";

type SkillNodeMeshProps = {
  skill: SkillNode;
  position: THREE.Vector3;
  isActive: boolean;
  isRelated: boolean | undefined;
  onClick: () => void;
};

export function SkillNodeMesh({ skill, position, isActive, isRelated, onClick }: SkillNodeMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Animate scale and glow based on state
  useFrame((state, delta) => {
    if (!meshRef.current || !glowRef.current) return;
    
    const targetScale = isActive ? 1.5 : (hovered ? 1.2 : (isRelated ? 1.1 : 1.0));
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 5);
    glowRef.current.scale.copy(meshRef.current.scale).multiplyScalar(1.2);
    
    // Rotate the orb slowly
    meshRef.current.rotation.y += delta * 0.2;
    meshRef.current.rotation.x += delta * 0.1;

    // Pulse the material properties
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const material = meshRef.current.material as any;
    if (material && material.transmission !== undefined) {
      const targetTransmission = isActive || hovered ? 0.95 : 0.8;
      material.transmission = THREE.MathUtils.lerp(material.transmission, targetTransmission, delta * 2);
    }

    // Glow opacity
    const glowMat = glowRef.current.material as THREE.MeshBasicMaterial;
    const targetOpacity = isActive ? 0.8 : (hovered ? 0.5 : (isRelated ? 0.3 : 0.05));
    glowMat.opacity = THREE.MathUtils.lerp(glowMat.opacity, targetOpacity, delta * 4);
  });

  const baseColor = isActive || hovered ? "#00f0ff" : (isRelated ? "#9d4edd" : "#ffffff");

  return (
    <Float
      position={position}
      speed={isActive ? 1 : 2}
      rotationIntensity={isActive ? 0.1 : 0.5}
      floatIntensity={isActive ? 0.2 : 1.5}
    >
      <group
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = "pointer"; }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = "auto"; }}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
      >
        {/* The Glass Orb */}
        <mesh ref={meshRef} castShadow receiveShadow>
          <icosahedronGeometry args={[0.8, 4]} />
          <meshPhysicalMaterial
            transparent
            transmission={0.9}
            opacity={1}
            roughness={0.2}
            ior={1.5}
            thickness={0.5}
            color="#ffffff"
            attenuationDistance={0.5}
            attenuationColor={new THREE.Color(baseColor)}
          />
        </mesh>

        {/* Soft Glow */}
        <mesh ref={glowRef}>
          <icosahedronGeometry args={[0.85, 4]} />
          <meshBasicMaterial color={baseColor} transparent opacity={0.1} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>

        {/* Embedded Icon */}
        <Html transform center sprite pointerEvents="none" zIndexRange={[100, 0]}>
          <div className={`transition-all duration-300 ${isActive || hovered ? 'opacity-100 scale-110 drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]' : 'opacity-60'} text-white`}>
            <skill.icon size={isActive ? 32 : 24} />
          </div>
        </Html>
      </group>
    </Float>
  );
}
