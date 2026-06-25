import { AppShell } from "@/components/layout/app-shell";
import { Navigation } from "@/components/layout/navigation";
import { HeroSection } from "@/components/sections/hero-section";
import { AboutSection } from "@/components/sections/about-section";
import { SkillsSection } from "@/components/sections/skills-section";

export default function HomePage() {
  return (
    <AppShell>
      <Navigation />
      <main>
        <HeroSection />
        <AboutSection />
        <SkillsSection />
      </main>
    </AppShell>
  );
}
