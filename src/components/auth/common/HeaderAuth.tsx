"use client";

import Link from "next/link";
import Logo from "@/components/common/logo";
import ModeToggle from "@/components/theme/mode-toggle";

export default function HeaderAuth() {
  return (
    <header className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur-sm">
      <div className="mx-auto flex h-20 max-w-5xl items-center justify-between px-6 sm:h-24">
        <Link href="/" aria-label="Home" className="shrink-0">
          <Logo variant="badge" />
        </Link>

        <ModeToggle />
      </div>
    </header>
  );
}
