import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

type GlassPanelProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  interactive?: boolean;
};

export function GlassPanel({
  children,
  className,
  interactive = false,
  ...props
}: GlassPanelProps) {
  return (
    <div
      className={cn(
        "glass-panel rounded-[1.5rem]",
        interactive &&
          "transition duration-300 ease-out hover:-translate-y-1 hover:border-cyan/30 hover:shadow-glow-cyan",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
