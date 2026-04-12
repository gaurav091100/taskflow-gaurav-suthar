import type { ReactNode } from "react";

export function AppMain({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-[calc(100svh-4rem)] w-full bg-muted/25 px-4 py-6 sm:px-6 lg:mx-auto lg:max-w-7xl lg:px-8 lg:py-10">
      {children}
    </main>
  );
}
