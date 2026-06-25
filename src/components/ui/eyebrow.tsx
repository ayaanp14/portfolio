import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

type EyebrowProps = HTMLAttributes<HTMLParagraphElement>;

export function Eyebrow({ className, ...props }: EyebrowProps) {
  return (
    <p
      className={cn(
        "text-xs font-medium uppercase tracking-[0.34em] text-cyan/90",
        className,
      )}
      {...props}
    />
  );
}
