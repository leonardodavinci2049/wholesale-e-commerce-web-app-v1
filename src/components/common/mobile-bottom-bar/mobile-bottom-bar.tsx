import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface MobileBottomBarProps {
  children: ReactNode;
  className?: string;
  /**
   * Tailwind breakpoint at which the bar is hidden.
   * Defaults to `xl` to match other mobile-only UI on this app.
   */
  hideFromBreakpoint?: "md" | "lg" | "xl";
  "aria-label"?: string;
}

const HIDE_CLASSES = {
  md: "md:hidden",
  lg: "lg:hidden",
  xl: "xl:hidden",
} as const;

/**
 * Server component shell for a fixed bottom navigation bar.
 * Items (Link / Sheet trigger / external link variants) are passed as children.
 */
export function MobileBottomBar({
  children,
  className,
  hideFromBreakpoint = "xl",
  "aria-label": ariaLabel = "Navegação principal",
}: MobileBottomBarProps) {
  return (
    <nav
      aria-label={ariaLabel}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/95 shadow-[0_-4px_16px_-8px_rgba(0,0,0,0.25)] backdrop-blur supports-[backdrop-filter]:bg-background/80",
        HIDE_CLASSES[hideFromBreakpoint],
        className,
      )}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex w-full max-w-screen-md items-stretch justify-around gap-1 px-2 py-1">
        {children}
      </ul>
    </nav>
  );
}
