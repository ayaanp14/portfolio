"use client";

import type { ReactNode } from "react";

import { CustomCursor } from "@/components/system/custom-cursor";
import { LoadingScreen } from "@/components/system/loading-screen";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <>
      <CustomCursor />
      
      <div className="relative z-0">
        {children}
      </div>
      
      <LoadingScreen />
    </>
  );
}
