"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { ShaderMaterial } from "three";

const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;

  uniform float uTime;
  uniform vec2 uPointer;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;

    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(p);
      p *= 2.05;
      amplitude *= 0.5;
    }

    return value;
  }

  void main() {
    vec2 uv = vUv;
    vec2 pointer = uPointer * 0.5 + 0.5;
    float flow = fbm(uv * 3.0 + vec2(uTime * 0.04, -uTime * 0.03));
    float pointerGlow = 1.0 - smoothstep(0.0, 0.6, distance(uv, pointer));

    vec3 black = vec3(0.02, 0.02, 0.022);
    vec3 cyan = vec3(0.33, 0.96, 1.0);
    vec3 blue = vec3(0.48, 0.65, 1.0);
    vec3 purple = vec3(0.55, 0.36, 0.96);

    vec3 color = black;
    color += cyan * smoothstep(0.58, 0.98, flow) * 0.18;
    color += blue * smoothstep(0.4, 0.86, fbm(uv * 2.1 - uTime * 0.025)) * 0.12;
    color += purple * smoothstep(0.55, 1.0, fbm(uv * 2.6 + uTime * 0.03)) * 0.14;
    color += cyan * pointerGlow * 0.12;

    gl_FragColor = vec4(color, 1.0);
  }
`;

export function ShaderPlane() {
  const materialRef = useRef<ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: [0, 0] },
    }),
    [],
  );

  useFrame(({ clock, pointer }) => {
    if (!materialRef.current) {
      return;
    }

    materialRef.current.uniforms.uTime.value = clock.elapsedTime;
    materialRef.current.uniforms.uPointer.value = [pointer.x, pointer.y];
  });

  return (
    <mesh scale={[12, 7, 1]}>
      <planeGeometry args={[1, 1, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
}
