import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "border-white/20 bg-white text-ink shadow-[0_18px_60px_rgba(255,255,255,0.16)] hover:bg-cyan hover:text-ink",
  secondary:
    "border-white/14 bg-white/[0.08] text-white backdrop-blur-xl hover:border-cyan/40 hover:bg-cyan/10 hover:text-cyan",
  ghost: "border-transparent bg-transparent text-white/72 hover:bg-white/[0.06] hover:text-white",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-10 gap-2 px-4 text-sm",
  md: "h-12 gap-2.5 px-5 text-sm",
  lg: "h-14 gap-3 px-6 text-base",
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  icon,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "group inline-flex items-center justify-center rounded-full border font-medium transition duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan disabled:pointer-events-none disabled:opacity-50",
        "will-change-transform hover:-translate-y-0.5 active:translate-y-0",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {children}
      {icon ? (
        <span className="grid size-5 place-items-center transition-transform duration-300 group-hover:translate-x-0.5">
          {icon}
        </span>
      ) : null}
    </button>
  );
}
