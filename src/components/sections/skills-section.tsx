"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import { FiX } from "react-icons/fi";
import { skillsData } from "@/data/skills";
import { GlassPanel } from "@/components/ui/glass-panel";

// Lazy-load the heavy 3D components
const SkillsScene = dynamic(
  () => import("@/components/three/skills-scene").then((mod) => mod.SkillsScene),
  { 
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-cyan text-sm uppercase tracking-widest animate-pulse">Initializing Neural Network...</div>
      </div>
    )
  }
);

export function SkillsSection() {
  const [activeSkillId, setActiveSkillId] = useState<string | null>(null);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { rootMargin: "200px" } // Load slightly before it comes into view
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const activeSkill = activeSkillId ? skillsData.find(s => s.id === activeSkillId) : null;

  return (
    <section ref={sectionRef} id="skills" data-section className="relative w-full h-[120vh] z-10 pt-24 mb-32 isolate">
      <div className="absolute inset-x-0 top-12 text-center pointer-events-none z-20">
        <h2 className="text-4xl md:text-5xl font-semibold tracking-[-0.04em] text-white">Neural Constellation</h2>
        <p className="mt-4 text-white/50 uppercase tracking-[0.2em] text-xs">Explore my technology stack</p>
      </div>

      <div className="sticky top-0 w-full h-screen">
        {/* The 3D Canvas */}
        <div className="absolute inset-0 z-0">
          {isInView && (
            <SkillsScene 
              onSkillClick={(id) => setActiveSkillId(id)} 
              activeSkillId={activeSkillId} 
            />
          )}
        </div>

        {/* 2D Overlay UI for Skill Details */}
        <div 
          className={`absolute right-4 md:right-12 top-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-sm z-30 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            activeSkill ? "opacity-100 translate-x-0 pointer-events-auto" : "opacity-0 translate-x-12 pointer-events-none"
          }`}
        >
          {activeSkill && (
            <GlassPanel className="p-6 md:p-8 bg-ink/40 backdrop-blur-3xl border border-white/10 shadow-[0_32px_64px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] relative overflow-hidden group">
              <button 
                onClick={() => setActiveSkillId(null)}
                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors outline-none"
                aria-label="Close skill details"
              >
                <FiX className="w-5 h-5" />
              </button>
              
              <div className="absolute -inset-24 bg-gradient-to-br from-cyan/20 to-purple/20 blur-3xl opacity-30 pointer-events-none -z-10" />

              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-cyan border border-white/10 shadow-glow-cyan">
                  <activeSkill.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-white">{activeSkill.name}</h3>
                  <span className="text-xs uppercase tracking-widest text-cyan/80">{activeSkill.category}</span>
                </div>
              </div>

              <p className="text-white/70 text-sm leading-relaxed mb-6">
                {activeSkill.description}
              </p>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-white/50 uppercase tracking-widest">Proficiency</span>
                    <span className="text-cyan">{Math.round(activeSkill.level * 100)}%</span>
                  </div>
                  <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan to-blue transition-all duration-1000 ease-out"
                      style={{ width: `${activeSkill.level * 100}%` }}
                    />
                  </div>
                </div>

                {activeSkill.related.length > 0 && (
                  <div className="pt-4 border-t border-white/10">
                    <span className="block text-xs uppercase tracking-widest text-white/50 mb-3">Connected Nodes</span>
                    <div className="flex flex-wrap gap-2">
                      {activeSkill.related.map(relId => {
                        const relSkill = skillsData.find(s => s.id === relId);
                        if (!relSkill) return null;
                        return (
                          <button
                            key={relId}
                            onClick={() => setActiveSkillId(relId)}
                            className="text-[10px] font-medium uppercase tracking-wider text-white/70 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full hover:bg-cyan/20 hover:text-cyan hover:border-cyan/50 transition-all outline-none"
                          >
                            {relSkill.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </GlassPanel>
          )}
        </div>
      </div>
    </section>
  );
}
