"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Observer } from "gsap/Observer";
import { SplitTextReveal } from "@/components/text/split-text-reveal";
import { GlassPanel } from "@/components/ui/glass-panel";
import { aboutData } from "@/data/about";
import { cn } from "@/lib/cn";

export function AboutSection() {
  const containerRef = useRef<HTMLElement>(null);
  const narrativeRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, Observer);
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) return;

    const ctx = gsap.context(() => {
      // 1. Narrative Scroll Storytelling
      const narrativeTexts = gsap.utils.toArray<HTMLElement>("[data-narrative-text]");
      
      // Pin the narrative section and animate texts in/out sequentially
      const tlNarrative = gsap.timeline({
        scrollTrigger: {
          trigger: narrativeRef.current,
          start: "top top",
          end: "+=300%", // 3 screens of scrolling
          pin: true,
          scrub: 1,
        }
      });

      narrativeTexts.forEach((text, i) => {
        if (i > 0) {
          tlNarrative.fromTo(text, 
            { autoAlpha: 0, y: 50, filter: "blur(10px)", scale: 0.9 },
            { autoAlpha: 1, y: 0, filter: "blur(0px)", scale: 1, duration: 1 }
          );
        }
        if (i < narrativeTexts.length - 1) {
          tlNarrative.to(text, { autoAlpha: 0, y: -50, filter: "blur(10px)", scale: 1.1, duration: 1 });
        }
      });

      // 2. Horizontal Nodal Timeline
      const timelineNodes = gsap.utils.toArray<HTMLElement>("[data-timeline-node]");
      const timelineLine = document.querySelector("[data-timeline-line]");
      
      gsap.fromTo(timelineLine, 
        { scaleX: 0 },
        { 
          scaleX: 1, 
          ease: "none",
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 80%",
            end: "bottom 50%",
            scrub: true,
          }
        }
      );

      timelineNodes.forEach((node) => {
        gsap.fromTo(node,
          { autoAlpha: 0, scale: 0 },
          {
            autoAlpha: 1,
            scale: 1,
            ease: "back.out(1.5)",
            scrollTrigger: {
              trigger: node,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

      // 3. Stats Counting
      const statValues = gsap.utils.toArray<HTMLElement>("[data-stat-value]");
      statValues.forEach((stat) => {
        const targetValue = parseInt(stat.dataset.statValue || "0", 10);
        const counter = { value: 0 };
        gsap.to(counter, {
          value: targetValue,
          duration: 2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: stat,
            start: "top 85%",
            toggleActions: "play none none none"
          },
          onUpdate: () => {
            stat.textContent = Math.floor(counter.value).toString() + (stat.dataset.statSuffix || "");
          }
        });
      });

      // Floating animations for stats tiles
      const statsTiles = gsap.utils.toArray<HTMLElement>("[data-stat-tile]");
      statsTiles.forEach((tile) => {
        gsap.to(tile, {
          y: "random(-10, 10)",
          rotate: "random(-2, 2)",
          duration: "random(3, 5)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} id="about" className="relative w-full z-10 pt-24 pb-32">
      {/* Narrative Storytelling Block */}
      <div ref={narrativeRef} className="h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="relative w-full max-w-5xl px-6 text-center">
          {aboutData.narrative.map((text, index) => (
            <h2 
              key={index} 
              data-narrative-text 
              className={cn(
                "absolute inset-0 flex items-center justify-center text-4xl md:text-6xl lg:text-7xl font-semibold tracking-[-0.04em] text-white",
                index === 0 ? "relative" : ""
              )}
              style={index > 0 ? { opacity: 0, visibility: 'hidden' } : {}}
            >
              <SplitTextReveal text={text} />
            </h2>
          ))}
        </div>
      </div>

      {/* Developer Stats */}
      <div ref={statsRef} className="container-page mt-32 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {aboutData.stats.map((stat) => (
            <GlassPanel 
              key={stat.label} 
              data-stat-tile
              interactive
              className="flex flex-col items-center justify-center p-8 text-center bg-white/[0.02] border border-white/5 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan/20 to-purple/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="absolute -inset-1 bg-white/5 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
              
              <span 
                data-stat-value={stat.value} 
                data-stat-suffix={stat.suffix}
                className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight group-hover:text-cyan transition-colors duration-300 relative z-10"
              >
                0{stat.suffix}
              </span>
              <span className="text-xs uppercase tracking-[0.2em] text-white/50 font-medium relative z-10">
                {stat.label}
              </span>
            </GlassPanel>
          ))}
        </div>
      </div>

      {/* Horizontal Nodal Timeline */}
      <div ref={timelineRef} className="container-page mt-48 max-w-6xl mx-auto px-6 mb-32 relative">
        <h3 className="text-sm font-medium uppercase tracking-[0.34em] text-cyan/90 mb-16 text-center">My Journey</h3>
        
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute top-4 left-0 w-full h-[2px] bg-white/10 overflow-hidden hidden md:block">
            <div data-timeline-line className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-cyan via-blue to-purple origin-left" />
          </div>

          <div className="flex flex-col md:flex-row justify-between relative z-10 gap-8 md:gap-0">
            {aboutData.timeline.map((item) => (
              <div key={item.year} data-timeline-node className="flex flex-col items-start md:items-center relative group w-full md:w-48">
                {/* Node dot */}
                <div className="hidden md:flex w-8 h-8 rounded-full bg-ink border-2 border-cyan items-center justify-center mb-6 relative z-10 transition-transform duration-300 group-hover:scale-150 group-hover:bg-cyan/20 shadow-glow-cyan">
                  <div className="w-2 h-2 rounded-full bg-cyan group-hover:bg-white transition-colors" />
                </div>
                
                {/* Mobile vertical line fallback */}
                <div className="absolute left-4 top-8 bottom-[-2rem] w-[2px] bg-white/10 md:hidden" />
                <div className="md:hidden absolute left-4 top-2 w-2 h-2 rounded-full bg-cyan -translate-x-[3px]" />

                <div className="pl-10 md:pl-0 text-left md:text-center transition-all duration-300 group-hover:-translate-y-2">
                  <span className="block text-xs font-bold text-cyan mb-2 uppercase tracking-widest">{item.year}</span>
                  <h4 className="text-lg font-semibold text-white mb-2">{item.title}</h4>
                  <p className="text-sm text-white/60 leading-relaxed group-hover:text-white/80 transition-colors">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
