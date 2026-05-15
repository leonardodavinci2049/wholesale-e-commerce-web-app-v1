"use client";

import { type ReactNode, useState } from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

import {
  MOBILE_BOTTOM_BAR_ITEM_BASE_CLASS,
  MobileBottomBarItemContent,
} from "./mobile-bottom-bar-shell";

interface MobileBottomBarSheetProps {
  icon: ReactNode;
  label: string;
  /** Title shown inside the sheet header. Defaults to `label`. */
  sheetTitle?: string;
  /** Side from which the sheet opens. */
  side?: "right" | "left" | "bottom" | "top";
  badgeCount?: number;
  /** Sheet content. */
  children: ReactNode;
  /** Extra classes for the sheet content panel. */
  contentClassName?: string;
  /** Optional empty state shown when children is null/undefined. */
  emptyState?: ReactNode;
}

export function MobileBottomBarSheet({
  icon,
  label,
  sheetTitle,
  side = "right",
  badgeCount,
  children,
  contentClassName,
  emptyState,
}: MobileBottomBarSheetProps) {
  const [open, setOpen] = useState(false);
  const hasContent = children !== null && children !== undefined;

  return (
    <li className="flex flex-1">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={label}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={MOBILE_BOTTOM_BAR_ITEM_BASE_CLASS}
      >
        <MobileBottomBarItemContent
          icon={icon}
          label={label}
          badgeCount={badgeCount}
          isActive={open}
        />
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side={side}
          className={cn(
            "flex w-[92vw] max-w-md flex-col gap-0 p-0",
            contentClassName,
          )}
        >
          <SheetHeader className="border-b border-border/60 p-4">
            <SheetTitle className="text-base">{sheetTitle ?? label}</SheetTitle>
            <SheetDescription className="sr-only">
              {sheetTitle ?? label}
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto p-4">
            {hasContent
              ? children
              : (emptyState ?? (
                  <p className="text-sm text-muted-foreground">
                    Em breve você verá opções aqui.
                  </p>
                ))}
          </div>
        </SheetContent>
      </Sheet>
    </li>
  );
}
