"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

import { ShaderCanvas } from "@/components/webgl/shader-canvas";
import { profile } from "@/data/profile";

const SESSION_KEY = "portfolio-loading-complete";

export function LoadingScreen() {
  const rootRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const [shouldRender, setShouldRender] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    const logo = logoRef.current;
    const progressNode = progressRef.current;

    if (!root || !logo || !progressNode) {
      return;
    }

    const shouldSkip =
      sessionStorage.getItem(SESSION_KEY) === "true" ||
      (process.env.NODE_ENV === "development" &&
        new URLSearchParams(window.location.search).get("skipLoader") === "1");

    if (shouldSkip) {
      sessionStorage.setItem(SESSION_KEY, "true");
      window.setTimeout(() => setShouldRender(false), 0);
      return;
    }

    document.body.classList.add("is-loading");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const counter = { value: 0 };
    
    // Failsafe: Force hide the loader after 3 seconds in case of WebGL/GSAP stalls
    const failsafeTimer = window.setTimeout(() => {
      sessionStorage.setItem(SESSION_KEY, "true");
      document.body.classList.remove("is-loading");
      setShouldRender(false);
    }, 3000);

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          window.clearTimeout(failsafeTimer);
          sessionStorage.setItem(SESSION_KEY, "true");
          document.body.classList.remove("is-loading");
          setShouldRender(false);
        },
      });

      timeline
        .fromTo(
          logo,
          { autoAlpha: 0, scale: 0.88, filter: "blur(18px)" },
          {
            autoAlpha: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: motionQuery.matches ? 0.01 : 0.75,
          },
        )
        .to(
          counter,
          {
            value: 100,
            duration: motionQuery.matches ? 0.01 : 1.65,
            ease: "power2.inOut",
            onUpdate: () => setProgress(Math.round(counter.value)),
          },
          motionQuery.matches ? 0 : 0.18,
        )
        .to(
          progressNode,
          {
            letterSpacing: "0.16em",
            duration: motionQuery.matches ? 0.01 : 0.45,
          },
          "-=0.28",
        )
        .to(root, {
          autoAlpha: 0,
          scale: 1.015,
          filter: "blur(16px)",
          duration: motionQuery.matches ? 0.01 : 0.72,
          ease: "power4.inOut",
        });
    }, root);

    return () => {
      window.clearTimeout(failsafeTimer);
      document.body.classList.remove("is-loading");
      ctx.revert();
    };
  }, [shouldRender]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[80] grid place-items-center overflow-hidden bg-ink"
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio"
    >
      <ShaderCanvas intensity={0.82} className="absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,5,5,0.16)_44%,rgba(5,5,5,0.82)_100%)]" />
      <div className="absolute inset-0" aria-hidden="true">
        {Array.from({ length: 22 }).map((_, index) => (
          <span
            key={index}
            className="absolute size-1 rounded-full bg-cyan/50 shadow-glow-cyan"
            style={{
              left: `${8 + ((index * 37) % 86)}%`,
              top: `${10 + ((index * 53) % 78)}%`,
              animation: `particle-float ${3.8 + (index % 5) * 0.4}s ease-in-out ${
                index * 0.13
              }s infinite alternate`,
            }}
          />
        ))}
      </div>

      <div
        ref={logoRef}
        className="glass-panel relative z-10 flex size-44 flex-col items-center justify-center rounded-[2rem] text-center"
      >
        <span className="text-5xl font-semibold tracking-[-0.04em] text-white">
          {profile.initials}
        </span>
        <span className="mt-4 h-px w-16 bg-gradient-to-r from-transparent via-cyan to-transparent" />
        <span
          ref={progressRef}
          className="mt-4 text-xs font-medium uppercase tracking-[0.34em] text-white/66"
        >
          {progress.toString().padStart(3, "0")}%
        </span>
      </div>

      <style jsx>{`
        @keyframes particle-float {
          from {
            transform: translate3d(-8px, 8px, 0) scale(0.8);
            opacity: 0.18;
          }
          to {
            transform: translate3d(12px, -18px, 0) scale(1.15);
            opacity: 0.72;
          }
        }
      `}</style>
    </div>
  );
}
