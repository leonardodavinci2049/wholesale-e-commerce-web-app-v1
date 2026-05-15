import type { ReactNode } from "react";

import {
  MOBILE_BOTTOM_BAR_ITEM_BASE_CLASS,
  MobileBottomBarItemContent,
} from "./mobile-bottom-bar-shell";

interface MobileBottomBarExternalLinkProps {
  href: string;
  icon: ReactNode;
  label: string;
  badgeCount?: number;
  /** Defaults to opening in a new tab. */
  newTab?: boolean;
}

export function MobileBottomBarExternalLink({
  href,
  icon,
  label,
  badgeCount,
  newTab = true,
}: MobileBottomBarExternalLinkProps) {
  return (
    <li className="flex flex-1">
      <a
        href={href}
        target={newTab ? "_blank" : undefined}
        rel={newTab ? "noopener noreferrer" : undefined}
        aria-label={label}
        className={MOBILE_BOTTOM_BAR_ITEM_BASE_CLASS}
      >
        <MobileBottomBarItemContent
          icon={icon}
          label={label}
          badgeCount={badgeCount}
        />
      </a>
    </li>
  );
}
