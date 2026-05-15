import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const MOBILE_BOTTOM_BAR_ITEM_BASE_CLASS =
  "relative flex min-h-12 w-full flex-col items-center justify-center gap-0.5 rounded-lg px-2 py-1.5 text-[11px] font-medium text-muted-foreground transition-colors duration-150 outline-none touch-manipulation select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background active:bg-accent/60 hover:text-foreground";

export const MOBILE_BOTTOM_BAR_ITEM_ACTIVE_CLASS =
  "text-primary data-[active=true]:text-primary";

interface MobileBottomBarItemContentProps {
  icon: ReactNode;
  label: string;
  badgeCount?: number;
  isActive?: boolean;
}

/**
 * Visual content for a bottom bar item (icon + label + optional badge).
 * Shared between Link, Button and Anchor variants.
 */
export function MobileBottomBarItemContent({
  icon,
  label,
  badgeCount,
  isActive,
}: MobileBottomBarItemContentProps) {
  return (
    <>
      <span
        className={cn(
          "relative flex h-6 w-6 items-center justify-center transition-transform duration-150",
          isActive && "scale-110",
        )}
      >
        {icon}
        {badgeCount && badgeCount > 0 ? (
          <Badge
            variant="destructive"
            className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold leading-none"
            aria-hidden="true"
          >
            {badgeCount > 99 ? "99+" : badgeCount}
          </Badge>
        ) : null}
      </span>
      <span className="leading-tight">{label}</span>
      {isActive ? (
        <span
          aria-hidden="true"
          className="absolute inset-x-3 top-0 h-0.5 rounded-b-full bg-primary"
        />
      ) : null}
    </>
  );
}
