import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

type SectionShellProps = HTMLAttributes<HTMLElement> & {
  eyebrow?: string;
  title?: string;
  description?: string;
  children: ReactNode;
};

export function SectionShell({
  eyebrow,
  title,
  description,
  children,
  className,
  ...props
}: SectionShellProps) {
  return (
    <section className={cn("py-24 md:py-32", className)} {...props}>
      <div className="container-page">
        {(eyebrow || title || description) && (
          <header className="mb-12 max-w-3xl md:mb-16">
            {eyebrow ? (
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.34em] text-cyan/90">
                {eyebrow}
              </p>
            ) : null}
            {title ? (
              <h2 className="text-balance text-4xl font-semibold leading-tight text-white md:text-6xl">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="mt-5 text-lg leading-8 text-white/62">{description}</p>
            ) : null}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
