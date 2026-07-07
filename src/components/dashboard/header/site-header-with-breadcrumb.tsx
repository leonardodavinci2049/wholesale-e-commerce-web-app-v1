import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { HeaderMiniCart } from "@/app/dashboard/_components/header/header-mini-cart";
import { HeaderNavUser } from "@/components/dashboard/header/header-nav-user";
import ModeToggle from "@/components/theme/mode-toggle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

const HEADER_LOGO_SRC = "/images/logo/logo-sidebar.png";

interface SiteHeaderWithBreadcrumbProps {
  title?: string;
  breadcrumbItems?: Array<{
    label: string;
    href?: string;
    isActive?: boolean;
  }>;
  mobileSearchBar?: React.ReactNode;
}

export function SiteHeaderWithBreadcrumb({
  breadcrumbItems = [
    { label: "Dashboard", href: "#" },
    { label: "Analytics", isActive: true },
  ],
  mobileSearchBar,
}: SiteHeaderWithBreadcrumbProps) {
  return (
    <header className="sticky top-0 z-40 flex shrink-0 flex-col border-b bg-background/95 backdrop-blur-md transition-[width,height] ease-linear md:relative md:bg-transparent md:backdrop-blur-none">
      <div className="flex h-(--header-height) w-full items-center gap-1 px-4 group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) lg:gap-2 lg:px-6">
        <SidebarTrigger className="relative z-10 -ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />

        {/* Logo for mobile - left aligned */}
        <Link href="/dashboard" className="flex items-center md:hidden">
          <Image
            src={HEADER_LOGO_SRC}
            alt="Logo da Empresa"
            width={180}
            height={48}
            priority
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Breadcrumb for desktop */}
        <div className="hidden items-center gap-2 md:flex">
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbItems.map((item, index) => (
                <div
                  key={item.href ?? item.label}
                  className="flex items-center"
                >
                  {index > 0 && <BreadcrumbSeparator />}
                  <BreadcrumbItem>
                    {item.isActive ? (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={item.href || "#"}>
                        {item.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </div>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="relative z-10 ml-auto flex items-center gap-2">
          <Suspense
            fallback={
              <div className="bg-muted/30 h-9 w-9 animate-pulse rounded-full" />
            }
          >
            <HeaderMiniCart />
          </Suspense>

          <Suspense>
            <ModeToggle />
          </Suspense>

          <div className="hidden md:block">
            <Suspense
              fallback={
                <div className="bg-muted/30 h-10 w-32 animate-pulse rounded-full" />
              }
            >
              <HeaderNavUser />
            </Suspense>
          </div>
        </div>
      </div>

      {mobileSearchBar && (
        <div className="border-t border-border/60 bg-background/95 px-4 py-2 backdrop-blur-md sm:hidden">
          {mobileSearchBar}
        </div>
      )}
    </header>
  );
}
