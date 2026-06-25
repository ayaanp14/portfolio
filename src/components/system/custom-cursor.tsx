"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const label = labelRef.current;

    if (!cursor || !label) {
      return;
    }

    const finePointer = window.matchMedia("(pointer: fine)");

    if (!finePointer.matches) {
      cursor.style.display = "none";
      return;
    }

    const xTo = gsap.quickTo(cursor, "x", { duration: 0.34, ease: "power3.out" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.34, ease: "power3.out" });
    const scaleTo = gsap.quickTo(cursor, "scale", { duration: 0.28, ease: "power3.out" });

    const onPointerMove = (event: PointerEvent) => {
      xTo(event.clientX);
      yTo(event.clientY);
    };

    const onPointerOver = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      const cursorTarget = target?.closest<HTMLElement>("[data-cursor]");

      if (!cursorTarget) {
        return;
      }

      const labelText = cursorTarget.dataset.cursorLabel ?? "";
      label.textContent = labelText;
      cursor.dataset.state = cursorTarget.dataset.cursor ?? "active";
      scaleTo(labelText ? 1.85 : 1.45);
    };

    const onPointerOut = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;

      if (!target?.closest("[data-cursor]")) {
        return;
      }

      label.textContent = "";
      cursor.dataset.state = "idle";
      scaleTo(1);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerover", onPointerOver, { passive: true });
    window.addEventListener("pointerout", onPointerOut, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerover", onPointerOver);
      window.removeEventListener("pointerout", onPointerOut);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed left-0 top-0 z-[90] hidden size-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-white/12 text-[6px] font-semibold uppercase tracking-[0.18em] text-white opacity-90 mix-blend-difference backdrop-blur-md will-change-transform data-[state=magnetic]:border-cyan/80 data-[state=magnetic]:bg-cyan/18 md:flex"
      data-state="idle"
      aria-hidden="true"
    >
      <span ref={labelRef} className="scale-[0.58] whitespace-nowrap opacity-80" />
    </div>
  );
}
