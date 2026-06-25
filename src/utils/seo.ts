import { profile } from "@/data/profile";

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: "Creative Frontend Engineer",
    knowsAbout: [
      "React",
      "Next.js",
      "TypeScript",
      "WebGL",
      "Three.js",
      "GSAP",
      "UI Engineering",
    ],
  };
}
