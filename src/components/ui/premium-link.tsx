"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { useRef, useState } from "react";
import gsap from "gsap";

import { cn } from "@/lib/cn";

type PremiumLinkVariant = "primary" | "secondary";

type PremiumLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  icon?: ReactNode;
  variant?: PremiumLinkVariant;
};

const variantStyles: Record<PremiumLinkVariant, string> = {
  primary:
    "border-white/22 bg-white text-ink shadow-[0_20px_70px_rgba(255,255,255,0.16)] hover:bg-cyan",
  secondary:
    "border-white/16 bg-white/[0.075] text-white backdrop-blur-xl shadow-[0_20px_70px_rgba(84,244,255,0.08)] hover:border-cyan/45 hover:bg-cyan/10 hover:text-cyan",
};

export function PremiumLink({
  children,
  icon,
  className,
  variant = "primary",
  onPointerMove,
  onPointerLeave,
  onPointerDown,
  ...props
}: PremiumLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [rippleKey, setRippleKey] = useState(0);

  return (
    <a
      ref={ref}
      className={cn(
        "group relative inline-flex h-14 min-w-40 items-center justify-center overflow-hidden rounded-full border px-6 text-sm font-semibold outline-none transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan",
        "before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_var(--x,50%)_var(--y,50%),rgba(255,255,255,0.42),transparent_34%)] before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100",
        variantStyles[variant],
        className,
      )}
      onPointerMove={(event) => {
        const bounds = ref.current?.getBoundingClientRect();

        if (bounds && ref.current) {
          const x = event.clientX - bounds.left;
          const y = event.clientY - bounds.top;
          ref.current.style.setProperty("--x", `${x}px`);
          ref.current.style.setProperty("--y", `${y}px`);
          gsap.to(ref.current, {
            x: (x - bounds.width / 2) * 0.16,
            y: (y - bounds.height / 2) * 0.16,
            duration: 0.45,
            ease: "power3.out",
          });
        }

        onPointerMove?.(event);
      }}
      onPointerLeave={(event) => {
        if (ref.current) {
          gsap.to(ref.current, { x: 0, y: 0, duration: 0.55, ease: "elastic.out(1, 0.45)" });
        }

        onPointerLeave?.(event);
      }}
      onPointerDown={(event) => {
        setRippleKey((current) => current + 1);
        onPointerDown?.(event);
      }}
      data-cursor="magnetic"
      data-cursor-label={typeof children === "string" ? children : "Open"}
      {...props}
    >
      <span key={rippleKey} className="pointer-events-none absolute inset-0 animate-[link-ripple_720ms_ease-out]" />
      <span className="relative z-10 flex items-center gap-3">
        {children}
        {icon ? (
          <span className="grid size-5 place-items-center transition-transform duration-300 group-hover:translate-x-0.5">
            {icon}
          </span>
        ) : null}
      </span>
      <style jsx>{`
        span[aria-hidden="true"] {
          display: none;
        }

        @keyframes link-ripple {
          from {
            box-shadow: inset 0 0 0 0 rgba(84, 244, 255, 0.32);
          }
          to {
            box-shadow: inset 0 0 0 80px rgba(84, 244, 255, 0);
          }
        }
      `}</style>
    </a>
  );
}
