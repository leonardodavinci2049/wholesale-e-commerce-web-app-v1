"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import {
  MOBILE_BOTTOM_BAR_ITEM_ACTIVE_CLASS,
  MOBILE_BOTTOM_BAR_ITEM_BASE_CLASS,
  MobileBottomBarItemContent,
} from "./mobile-bottom-bar-shell";

interface MobileBottomBarLinkProps {
  href: string;
  icon: ReactNode;
  label: string;
  /**
   * If true, the item is active only when the pathname matches `href` exactly.
   * Defaults to false (also matches sub-routes).
   */
  exact?: boolean;
  badgeCount?: number;
}

export function MobileBottomBarLink({
  href,
  icon,
  label,
  exact = false,
  badgeCount,
}: MobileBottomBarLinkProps) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <li className="flex flex-1">
      <Link
        href={href}
        prefetch={false}
        aria-current={isActive ? "page" : undefined}
        data-active={isActive}
        className={cn(
          MOBILE_BOTTOM_BAR_ITEM_BASE_CLASS,
          isActive && MOBILE_BOTTOM_BAR_ITEM_ACTIVE_CLASS,
        )}
      >
        <MobileBottomBarItemContent
          icon={icon}
          label={label}
          badgeCount={badgeCount}
          isActive={isActive}
        />
      </Link>
    </li>
  );
}
