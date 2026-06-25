import type { IconType } from "react-icons";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiGreensock,
  SiThreedotjs,
  SiVercel,
  SiNodedotjs,
  SiPostgresql,
  SiPrisma,
  SiFramer,
  SiRedux,
  SiGraphql,
  SiDocker,
  SiFigma,
} from "react-icons/si";
import { FiCode } from "react-icons/fi";

export type SkillCategory = "Frontend" | "Backend" | "Creative" | "Cloud" | "Tools";

export interface SkillNode {
  id: string;
  name: string;
  category: SkillCategory;
  icon: IconType;
  description: string;
  level: number; // 0 to 1
  related: string[]; // IDs of related skills
}

export const skillsData: SkillNode[] = [
  // Frontend
  {
    id: "react",
    name: "React",
    category: "Frontend",
    icon: SiReact,
    description: "Component-driven UI development.",
    level: 0.95,
    related: ["nextjs", "typescript", "framer-motion", "redux", "react-three-fiber"],
  },
  {
    id: "nextjs",
    name: "Next.js",
    category: "Frontend",
    icon: SiNextdotjs,
    description: "React framework for production.",
    level: 0.9,
    related: ["react", "vercel", "typescript"],
  },
  {
    id: "typescript",
    name: "TypeScript",
    category: "Frontend",
    icon: SiTypescript,
    description: "Strongly typed programming.",
    level: 0.85,
    related: ["react", "nextjs", "nodejs"],
  },
  {
    id: "tailwindcss",
    name: "Tailwind CSS",
    category: "Frontend",
    icon: SiTailwindcss,
    description: "Utility-first styling.",
    level: 0.95,
    related: ["react", "nextjs"],
  },
  {
    id: "redux",
    name: "Redux",
    category: "Frontend",
    icon: SiRedux,
    description: "Predictable state container.",
    level: 0.8,
    related: ["react"],
  },
  
  // Creative
  {
    id: "gsap",
    name: "GSAP",
    category: "Creative",
    icon: SiGreensock,
    description: "Professional-grade animation library.",
    level: 0.9,
    related: ["react", "threejs"],
  },
  {
    id: "threejs",
    name: "Three.js",
    category: "Creative",
    icon: SiThreedotjs,
    description: "3D library for WebGL.",
    level: 0.85,
    related: ["react-three-fiber", "webgl"],
  },
  {
    id: "react-three-fiber",
    name: "React Three Fiber",
    category: "Creative",
    icon: SiReact,
    description: "React renderer for Three.js.",
    level: 0.85,
    related: ["react", "threejs", "gsap"],
  },
  {
    id: "framer-motion",
    name: "Framer Motion",
    category: "Creative",
    icon: SiFramer,
    description: "Production-ready animations.",
    level: 0.85,
    related: ["react"],
  },
  {
    id: "webgl",
    name: "WebGL / GLSL",
    category: "Creative",
    icon: FiCode,
    description: "Custom shaders and rendering.",
    level: 0.75,
    related: ["threejs"],
  },

  // Backend
  {
    id: "nodejs",
    name: "Node.js",
    category: "Backend",
    icon: SiNodedotjs,
    description: "JavaScript runtime built on V8.",
    level: 0.8,
    related: ["typescript", "postgresql", "graphql"],
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    category: "Backend",
    icon: SiPostgresql,
    description: "Advanced open source database.",
    level: 0.8,
    related: ["nodejs", "prisma"],
  },
  {
    id: "prisma",
    name: "Prisma",
    category: "Backend",
    icon: SiPrisma,
    description: "Next-generation ORM.",
    level: 0.85,
    related: ["postgresql", "nodejs", "typescript"],
  },
  {
    id: "graphql",
    name: "GraphQL",
    category: "Backend",
    icon: SiGraphql,
    description: "Query language for your API.",
    level: 0.75,
    related: ["nodejs", "react"],
  },

  // Cloud & Tools
  {
    id: "vercel",
    name: "Vercel",
    category: "Cloud",
    icon: SiVercel,
    description: "Platform for frontend frameworks.",
    level: 0.9,
    related: ["nextjs"],
  },
  {
    id: "docker",
    name: "Docker",
    category: "Cloud",
    icon: SiDocker,
    description: "Containerization platform.",
    level: 0.7,
    related: ["nodejs"],
  },
  {
    id: "figma",
    name: "Figma",
    category: "Tools",
    icon: SiFigma,
    description: "Collaborative interface design.",
    level: 0.85,
    related: ["react", "tailwindcss"],
  },
];
