import Image from "next/image";
import Link from "next/link";
import { companyInfo } from "@/core/config-tenant/info-company";
import { OperationButtons } from "./OperationButtons";

/**
 * Server Component - renders static header structure
 * UserActions is imported as Client Island for user-specific content
 */
export function MainHeader() {
  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-40 hidden md:block">
      <div className="container mx-auto px-4 py-4 flex flex-row items-center gap-4 justify-between">
        {/* Logo */}
        <div className="shrink-0 flex items-center justify-start">
          <Link
            href="/"
            className="inline-flex items-center"
            aria-label={`${companyInfo.name} - Página inicial`}
          >
            <div className="relative h-8 w-40 sm:h-10 sm:w-48 lg:h-12 lg:w-56">
              <Image
                src="/images/logo/logo-horizontal-header.png"
                alt={`${companyInfo.name} - Informática, Eletrônicos e Perfumes Importados`}
                fill
                sizes="(min-width: 1024px) 224px, (min-width: 640px) 192px, 160px"
                className="scale-[1.5] object-contain origin-left"
                priority
              />
            </div>
          </Link>
        </div>

        {/* OperationButtons - Client Island */}

        <div className="hidden md:flex">
          <OperationButtons />
        </div>
      </div>
    </header>
  );
}
