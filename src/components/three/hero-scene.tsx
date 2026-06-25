"use client";

import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Group, Mesh } from "three";
import { AdditiveBlending, Color, MathUtils } from "three";

function HeroObject() {
  const groupRef = useRef<Group>(null);
  const coreRef = useRef<Mesh>(null);
  const particles = useMemo(
    () =>
      Array.from({ length: 38 }, (_, index) => ({
        radius: 1.45 + (index % 7) * 0.08,
        angle: index * 0.84,
        speed: 0.22 + (index % 5) * 0.018,
        y: Math.sin(index * 1.7) * 0.86,
        size: 0.018 + (index % 4) * 0.008,
      })),
    [],
  );

  useFrame(({ clock, pointer }) => {
    const elapsed = clock.elapsedTime;

    if (groupRef.current) {
      groupRef.current.rotation.y = MathUtils.lerp(groupRef.current.rotation.y, pointer.x * 0.28, 0.045);
      groupRef.current.rotation.x = MathUtils.lerp(groupRef.current.rotation.x, -pointer.y * 0.18, 0.045);
    }

    if (coreRef.current) {
      coreRef.current.rotation.y = elapsed * 0.18;
      coreRef.current.rotation.z = Math.sin(elapsed * 0.32) * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.25} rotationIntensity={0.28} floatIntensity={0.46}>
        <mesh ref={coreRef}>
          <icosahedronGeometry args={[1.42, 12]} />
          <MeshDistortMaterial
            color={new Color("#bdefff")}
            roughness={0.14}
            metalness={0.32}
            clearcoat={1}
            clearcoatRoughness={0.1}
            distort={0.18}
            speed={1.3}
            transparent
            opacity={0.48}
          />
        </mesh>
        <mesh scale={1.16}>
          <icosahedronGeometry args={[1.42, 2]} />
          <meshBasicMaterial wireframe color="#54f4ff" transparent opacity={0.16} />
        </mesh>
      </Float>

      {particles.map((particle, index) => {
        const x = Math.cos(particle.angle) * particle.radius;
        const z = Math.sin(particle.angle) * particle.radius;

        return (
          <mesh key={index} position={[x, particle.y, z]} scale={particle.size}>
            <sphereGeometry args={[1, 12, 12]} />
            <meshBasicMaterial color="#54f4ff" transparent opacity={0.62} blending={AdditiveBlending} />
          </mesh>
        );
      })}
      <Sparkles count={54} scale={4.2} size={1.4} speed={0.22} opacity={0.32} color="#bdefff" />
    </group>
  );
}

export function HeroScene() {
  return (
    <Canvas
      className="absolute inset-0 h-full w-full"
      dpr={[1, 1.65]}
      camera={{ position: [0, 0, 5.2], fov: 38 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      performance={{ min: 0.6 }}
    >
      <ambientLight intensity={0.46} />
      <pointLight position={[3, 2, 4]} intensity={18} color="#54f4ff" />
      <pointLight position={[-4, -2, 3]} intensity={8} color="#8b5cf6" />
      <spotLight position={[0, 4, 5]} angle={0.45} penumbra={0.8} intensity={22} color="#ffffff" />
      <HeroObject />
    </Canvas>
  );
}
