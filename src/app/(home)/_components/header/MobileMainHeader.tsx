import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import ModeToggle from "@/components/theme/mode-toggle";
import { publicEnvs } from "@/core/config";

export async function MobileMainHeader() {
  return (
    <Suspense>
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50 md:hidden">
        <div className="container mx-auto px-4 py-4">
          {/* Mobile menu + Logo + Theme */}
          <div className="relative flex items-center justify-center w-full">
            {/* Hamburger - esquerda */}

            {/* Logo centralizada */}
            <Link
              href="/"
              className="inline-flex items-center"
              aria-label={`${publicEnvs.NEXT_PUBLIC_COMPANY_NAME} - Página inicial`}
            >
              <div className="relative w-48 h-10 xs:w-56 xs:h-12">
                <Image
                  src="/images/logo/logo-header-mobile.png"
                  alt={`${publicEnvs.NEXT_PUBLIC_COMPANY_NAME} - ${publicEnvs.NEXT_PUBLIC_COMPANY_META_KEYWORDS}`}
                  fill
                  sizes="224px"
                  className="object-contain drop-shadow-sm"
                  priority
                  quality={100}
                />
              </div>
            </Link>

            {/* Toggle de tema e pesquisa - direita */}
            <div className="absolute right-0 flex items-center gap-1">
              <ModeToggle />
            </div>
          </div>
        </div>

        {/* Search Input - aparece abaixo quando aberto */}
      </header>
    </Suspense>
  );
}
