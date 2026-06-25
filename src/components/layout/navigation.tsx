"use client";

import { useEffect, useRef, useState } from "react";
import { FiArrowUpRight, FiMenu, FiX } from "react-icons/fi";
import gsap from "gsap";

import { Magnetic } from "@/components/motion/magnetic";
import { navigationItems } from "@/config/navigation";
import { profile } from "@/data/profile";
import { cn } from "@/lib/cn";

export function Navigation() {
  const navRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const nav = navRef.current;

    if (!nav) {
      return;
    }

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const skipsLoader =
      sessionStorage.getItem("portfolio-loading-complete") === "true" ||
      (process.env.NODE_ENV === "development" &&
        new URLSearchParams(window.location.search).get("skipLoader") === "1");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        nav,
        { autoAlpha: 0, y: -24, filter: "blur(12px)" },
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: motionQuery.matches ? 0.01 : 0.9,
          ease: "power3.out",
          delay: motionQuery.matches || skipsLoader ? 0 : 2.35,
        },
      );
    }, nav);

    let lastScrollY = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      if (ticking || isMenuOpen) {
        return;
      }

      ticking = true;
      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const shouldHide = currentScrollY > lastScrollY && currentScrollY > 80;

        gsap.to(nav, {
          y: shouldHide ? -96 : 0,
          autoAlpha: shouldHide ? 0 : 1,
          duration: motionQuery.matches ? 0.01 : 0.42,
          ease: "power3.out",
        });

        lastScrollY = Math.max(currentScrollY, 0);
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      ctx.revert();
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-section]"));

    if (sections.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry?.target.id) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0.15, 0.4, 0.7] },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const overlay = overlayRef.current;

    if (!overlay) {
      return;
    }

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
      gsap.fromTo(
        overlay,
        { autoAlpha: 0, clipPath: "inset(0 0 100% 0 round 0px)" },
        {
          autoAlpha: 1,
          clipPath: "inset(0 0 0% 0 round 0px)",
          duration: motionQuery.matches ? 0.01 : 0.72,
          ease: "power4.out",
        },
      );
      gsap.fromTo(
        overlay.querySelectorAll("[data-mobile-link]"),
        { y: 32, autoAlpha: 0, filter: "blur(10px)" },
        {
          y: 0,
          autoAlpha: 1,
          filter: "blur(0px)",
          duration: motionQuery.matches ? 0.01 : 0.62,
          stagger: 0.055,
          delay: motionQuery.matches ? 0 : 0.12,
          ease: "power3.out",
        },
      );
      return;
    }

    document.body.style.overflow = "";
    gsap.to(overlay, {
      autoAlpha: 0,
      duration: motionQuery.matches ? 0.01 : 0.28,
      ease: "power2.out",
    });
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMenuOpen]);

  return (
    <>
      <header
        ref={navRef}
        className="fixed left-0 right-0 top-4 z-40 mx-auto flex w-full justify-center px-4"
      >
        <nav
          className="glass-panel flex h-16 w-full max-w-[1080px] items-center justify-between rounded-full px-3 shadow-[0_24px_90px_rgba(0,0,0,0.36)] md:px-4"
          aria-label="Primary navigation"
        >
          <a
            href="#home"
            className="group flex items-center gap-3 rounded-full py-2 pl-2 pr-4 outline-none transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
            data-cursor="magnetic"
            data-cursor-label="Home"
          >
            <span className="grid size-9 place-items-center rounded-full border border-white/15 bg-white/[0.08] text-sm font-semibold text-white shadow-glow-cyan">
              {profile.initials}
            </span>
            <span className="hidden text-sm font-medium text-white/82 sm:block">{profile.name}</span>
          </a>

          <div className="hidden items-center gap-1 lg:flex">
            {navigationItems.map((item) => {
              const sectionId = item.href.replace("#", "");
              const isActive = activeSection === sectionId;

              return (
                <Magnetic key={item.href} strength={0.13}>
                  <a
                    href={item.href}
                    className={cn(
                      "group relative block rounded-full px-4 py-2 text-sm font-medium outline-none transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan",
                      isActive ? "text-white" : "text-white/58 hover:text-white",
                    )}
                    aria-current={isActive ? "page" : undefined}
                    data-cursor="magnetic"
                    data-cursor-label={item.label}
                  >
                    {item.label}
                    <span
                      className={cn(
                        "absolute inset-x-4 bottom-1 h-px origin-left rounded-full bg-gradient-to-r from-cyan via-blue to-purple transition-transform duration-300",
                        isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                      )}
                    />
                  </a>
                </Magnetic>
              );
            })}
          </div>

          <Magnetic className="hidden lg:block" strength={0.12}>
            <a
              href="#contact"
              className="group inline-flex h-11 items-center gap-2 rounded-full border border-white/15 bg-white text-sm font-semibold text-ink shadow-[0_16px_48px_rgba(255,255,255,0.12)] outline-none transition duration-300 hover:bg-cyan focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
              data-cursor="magnetic"
              data-cursor-label="Contact"
            >
              <span className="pl-5">Let&apos;s talk</span>
              <span className="mr-1 grid size-9 place-items-center rounded-full bg-ink text-white transition-transform duration-300 group-hover:rotate-45">
                <FiArrowUpRight aria-hidden="true" />
              </span>
            </a>
          </Magnetic>

          <button
            type="button"
            className="grid size-11 place-items-center rounded-full border border-white/15 bg-white/[0.08] text-white outline-none transition hover:border-cyan/40 hover:bg-cyan/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan lg:hidden"
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsMenuOpen((current) => !current)}
            data-cursor="magnetic"
            data-cursor-label={isMenuOpen ? "Close" : "Menu"}
          >
            {isMenuOpen ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
          </button>
        </nav>
      </header>

      <div
        ref={overlayRef}
        id="mobile-navigation"
        className="fixed inset-0 z-30 bg-ink/92 px-6 pt-28 opacity-0 backdrop-blur-3xl lg:hidden"
        aria-hidden={!isMenuOpen}
      >
        <div className="mx-auto flex max-w-md flex-col gap-3">
          {navigationItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              data-mobile-link
              className="flex items-center justify-between border-b border-white/10 py-5 text-3xl font-semibold text-white outline-none transition hover:text-cyan focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
              <FiArrowUpRight className="text-lg text-white/48" aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
