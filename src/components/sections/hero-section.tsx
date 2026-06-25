"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { FiArrowDown, FiArrowUpRight, FiMail } from "react-icons/fi";
import gsap from "gsap";

import { SplitTextReveal } from "@/components/text/split-text-reveal";
import { PremiumLink } from "@/components/ui/premium-link";
import { ShaderCanvas } from "@/components/webgl/shader-canvas";
import { profile } from "@/data/profile";

const HeroScene = dynamic(
  () => import("@/components/three/hero-scene").then((module) => module.HeroScene),
  {
    ssr: false,
    loading: () => (
      <div className="grid aspect-square w-full place-items-center rounded-full border border-white/10 bg-white/[0.03] text-xs uppercase tracking-[0.28em] text-white/34">
        WebGL
      </div>
    ),
  },
);

export function HeroSection() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const skipsLoader =
      sessionStorage.getItem("portfolio-loading-complete") === "true" ||
      (process.env.NODE_ENV === "development" &&
        new URLSearchParams(window.location.search).get("skipLoader") === "1");
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: {
          duration: motionQuery.matches ? 0.01 : 0.95,
          ease: "power4.out",
        },
        delay: motionQuery.matches || skipsLoader ? 0 : 2.22,
      });

      timeline
        .fromTo(
          "[data-hero-kicker]",
          { autoAlpha: 0, y: 20, filter: "blur(12px)" },
          { autoAlpha: 1, y: 0, filter: "blur(0px)" },
        )
        .fromTo(
          "[data-split-char]",
          { autoAlpha: 0, yPercent: 108, rotateX: -76, filter: "blur(14px)" },
          {
            autoAlpha: 1,
            yPercent: 0,
            rotateX: 0,
            filter: "blur(0px)",
            stagger: 0.018,
            duration: motionQuery.matches ? 0.01 : 1.08,
          },
          "-=0.48",
        )
        .fromTo(
          "[data-hero-copy], [data-hero-stack], [data-hero-cta]",
          { autoAlpha: 0, y: 24, filter: "blur(10px)" },
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            stagger: 0.09,
            duration: motionQuery.matches ? 0.01 : 0.82,
          },
          "-=0.62",
        )
        .fromTo(
          "[data-hero-visual]",
          { autoAlpha: 0, scale: 0.92, y: 28, filter: "blur(16px)" },
          {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            filter: "blur(0px)",
            duration: motionQuery.matches ? 0.01 : 1.1,
          },
          "-=0.72",
        )
        .fromTo(
          "[data-scroll-indicator]",
          { autoAlpha: 0, y: -8 },
          { autoAlpha: 1, y: 0, duration: motionQuery.matches ? 0.01 : 0.5 },
          "-=0.28",
        );

      if (!motionQuery.matches) {
        gsap.to("[data-floating-chip]", {
          y: "random(-10, 10)",
          x: "random(-8, 8)",
          rotate: "random(-3, 3)",
          duration: "random(3.2, 5.2)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          stagger: 0.18,
        });

        gsap.to("[data-scroll-dot]", {
          y: 22,
          opacity: 0.2,
          duration: 1.35,
          repeat: -1,
          ease: "power2.inOut",
        });
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="home"
      data-section
      className="relative isolate min-h-screen overflow-hidden px-4 pb-10 pt-28 md:px-8 md:pt-32"
      aria-labelledby="hero-title"
    >
      <div className="absolute inset-0 -z-10 bg-ink" aria-hidden="true">
        <ShaderCanvas className="absolute inset-0 opacity-90" intensity={1.06} />
      </div>

      <div className="container-page grid min-h-[calc(100vh-9rem)] items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="relative z-10 max-w-4xl">
          <p
            data-hero-kicker
            className="mb-5 text-sm font-medium uppercase tracking-[0.34em] text-cyan/90"
          >
            Hello, I&apos;m
          </p>
          <h1
            id="hero-title"
            className="text-balance text-[clamp(4rem,13vw,10.5rem)] font-semibold leading-[0.78] tracking-[-0.055em] text-white"
          >
            <SplitTextReveal text={profile.name} />
          </h1>
          <div
            data-hero-copy
            className="mt-7 flex flex-col gap-5 md:mt-8 md:max-w-2xl"
          >
            <div className="flex flex-wrap items-center gap-3 text-xl font-medium text-white md:text-3xl">
              <span>Creative Frontend Engineer</span>
              <span className="h-px w-10 bg-gradient-to-r from-cyan to-transparent" />
              <RotatingTitle roles={profile.roles} />
            </div>
            <p className="max-w-xl text-base leading-7 text-white/64 md:text-lg md:leading-8">
              {profile.tagline}
            </p>
          </div>

          <div
            data-hero-stack
            className="mt-8 flex flex-wrap gap-2 text-xs font-medium uppercase tracking-[0.18em] text-white/58"
            aria-label="Primary technologies"
          >
            {["React", "Three.js", "WebGL", "GSAP", "TypeScript"].map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/12 bg-white/[0.055] px-4 py-2 backdrop-blur-xl"
              >
                {item}
              </span>
            ))}
          </div>

          <div data-hero-cta className="mt-9 flex flex-col gap-3 sm:flex-row">
            <PremiumLink href="#projects" icon={<FiArrowUpRight aria-hidden="true" />}>
              View Projects
            </PremiumLink>
            <PremiumLink
              href="#contact"
              variant="secondary"
              icon={<FiMail aria-hidden="true" />}
            >
              Contact Me
            </PremiumLink>
          </div>
        </div>

        <div
          data-hero-visual
          className="relative mx-auto aspect-square w-full max-w-[560px]"
          aria-hidden="true"
        >
          <div className="absolute inset-[8%] rounded-full border border-white/10 bg-white/[0.035] shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_40px_120px_rgba(84,244,255,0.08)] backdrop-blur-2xl" />
          <HeroScene />
          <FloatingChip className="left-2 top-[18%]" label="60 FPS" />
          <FloatingChip className="right-0 top-[28%]" label="WebGL" />
          <FloatingChip className="bottom-[18%] left-[10%]" label="GSAP" />
          <FloatingChip className="bottom-[12%] right-[10%]" label="R3F" />
        </div>
      </div>

      <a
        href="#projects"
        data-scroll-indicator
        data-cursor="magnetic"
        data-cursor-label="Scroll"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-xs font-medium uppercase tracking-[0.28em] text-white/46 outline-none transition hover:text-cyan focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan md:flex"
      >
        <span>Scroll</span>
        <span className="relative h-12 w-7 rounded-full border border-white/18">
          <span
            data-scroll-dot
            className="absolute left-1/2 top-2 size-1.5 -translate-x-1/2 rounded-full bg-cyan"
          />
        </span>
        <FiArrowDown aria-hidden="true" />
      </a>
    </section>
  );
}

function RotatingTitle({ roles }: { roles: readonly string[] }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;

    if (!node || roles.length === 0) {
      return;
    }

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let index = 0;

    if (motionQuery.matches) {
      node.textContent = roles[0];
      return;
    }

    const interval = window.setInterval(() => {
      const nextRole = roles[(index + 1) % roles.length];
      gsap
        .timeline()
        .to(node, {
          y: -14,
          autoAlpha: 0,
          filter: "blur(8px)",
          duration: 0.34,
          ease: "power2.in",
          onComplete: () => {
            node.textContent = nextRole;
            index = (index + 1) % roles.length;
          },
        })
        .fromTo(
          node,
          { y: 14, autoAlpha: 0, filter: "blur(8px)" },
          { y: 0, autoAlpha: 1, filter: "blur(0px)", duration: 0.48, ease: "power3.out" },
        );
    }, 2600);

    return () => window.clearInterval(interval);
  }, [roles]);

  return (
    <span
      ref={ref}
      className="inline-block min-w-[14ch] bg-gradient-to-r from-cyan via-blue to-lilac bg-clip-text text-transparent will-change-transform"
    >
      {roles[0]}
    </span>
  );
}

function FloatingChip({ label, className }: { label: string; className?: string }) {
  return (
    <span
      data-floating-chip
      className={`glass-panel absolute rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/76 ${className ?? ""}`}
    >
      {label}
    </span>
  );
}
