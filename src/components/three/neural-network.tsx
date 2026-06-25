"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import { skillsData } from "@/data/skills";
import { SkillNodeMesh } from "./skill-node";

type NeuralNetworkProps = {
  onSkillClick: (id: string) => void;
  activeSkillId: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  controlsRef: React.RefObject<any>;
};

export function NeuralNetwork({ onSkillClick, activeSkillId, controlsRef }: NeuralNetworkProps) {
  // Generate deterministic positions for each skill to form a constellation
  const nodes = useMemo(() => {
    const positions = new Map<string, THREE.Vector3>();
    const radius = 6;
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    
    skillsData.forEach((skill, i) => {
      // Fibonacci sphere distribution for even spacing
      const theta = 2 * Math.PI * i / goldenRatio;
      const phi = Math.acos(1 - 2 * (i + 0.5) / skillsData.length);
      
      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);
      
      // Jitter slightly based on category to group them loosely
      const categoryOffset = Array.from(skill.category).reduce((acc, char) => acc + char.charCodeAt(0), 0) % 3;
      
      positions.set(skill.id, new THREE.Vector3(x, y + categoryOffset - 1, z));
    });
    
    return positions;
  }, []);

  // Generate edges between related skills
  const edges = useMemo(() => {
    const lines: { start: THREE.Vector3; end: THREE.Vector3; isActive: boolean }[] = [];
    
    skillsData.forEach(skill => {
      const startPos = nodes.get(skill.id);
      if (!startPos) return;
      
      skill.related.forEach(relatedId => {
        const endPos = nodes.get(relatedId);
        if (endPos) {
          // Avoid duplicate edges (A->B and B->A)
          if (skill.id.localeCompare(relatedId) < 0) {
            const isActive = activeSkillId === skill.id || activeSkillId === relatedId;
            lines.push({ start: startPos, end: endPos, isActive });
          }
        }
      });
    });
    return lines;
  }, [nodes, activeSkillId]);

  const linesRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (linesRef.current) {
      // Pulse the opacity of lines slightly
      const opacity = 0.2 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      linesRef.current.children.forEach(child => {
        if (child.type === "Line2" || child.type === "LineSegments") {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const material = (child as any).material;
          if (material && 'opacity' in material) {
            const isLineActive = child.userData.isActive;
            material.opacity = isLineActive ? 0.8 : opacity;
            material.color.setHex(isLineActive ? 0x00f0ff : 0x555555);
          }
        }
      });
    }
  });

  return (
    <group>
      {/* Draw Edges */}
      <group ref={linesRef}>
        {edges.map((edge, i) => (
          <Line
            key={i}
            points={[edge.start, edge.end]}
            color={edge.isActive ? "#00f0ff" : "#555555"}
            lineWidth={edge.isActive ? 2 : 1}
            transparent
            opacity={edge.isActive ? 0.8 : 0.2}
            userData={{ isActive: edge.isActive }}
          />
        ))}
      </group>

      {/* Draw Nodes */}
      {skillsData.map(skill => {
        const position = nodes.get(skill.id)!;
        const isActive = activeSkillId === skill.id;
        const isRelated = activeSkillId ? skillsData.find(s => s.id === activeSkillId)?.related.includes(skill.id) : false;
        
        return (
          <SkillNodeMesh
            key={skill.id}
            skill={skill}
            position={position}
            isActive={isActive}
            isRelated={isRelated}
            onClick={() => {
              onSkillClick(skill.id);
              if (controlsRef.current) {
                controlsRef.current.setLookAt(
                  position.x * 1.5, position.y * 1.5, position.z * 1.5,
                  position.x, position.y, position.z,
                  true
                );
              }
            }}
          />
        );
      })}
    </group>
  );
}
