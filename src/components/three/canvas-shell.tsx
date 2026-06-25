"use client";

import type { ReactNode } from "react";
import { Canvas } from "@react-three/fiber";

type CanvasShellProps = {
  children: ReactNode;
  className?: string;
};

export function CanvasShell({ children, className }: CanvasShellProps) {
  return (
    <Canvas
      className={className}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 7], fov: 38 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      {children}
    </Canvas>
  );
}
