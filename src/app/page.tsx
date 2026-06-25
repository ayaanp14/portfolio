import { AppShell } from "@/components/layout/app-shell";
import { Navigation } from "@/components/layout/navigation";
import { HeroSection } from "@/components/sections/hero-section";

export default function HomePage() {
  return (
    <AppShell>
      <Navigation />
      <main>
        <HeroSection />
      </main>
    </AppShell>
  );
}
