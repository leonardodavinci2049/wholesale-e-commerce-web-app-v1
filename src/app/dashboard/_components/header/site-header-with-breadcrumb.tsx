import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

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
import { auth } from "@/lib/auth/auth";

import { NavUser } from "../app-sidebar/nav-user";
import { HeaderMiniCart } from "./header-mini-cart";

const HEADER_LOGO_SRC = "/images/logo/logo-sidebar.png";

interface SiteHeaderWithBreadcrumbProps {
  title?: string;
  breadcrumbItems?: Array<{
    label: string;
    href?: string;
    isActive?: boolean;
  }>;
}

export async function SiteHeaderWithBreadcrumb({
  breadcrumbItems = [
    { label: "Dashboard", href: "#" },
    { label: "Analytics", isActive: true },
  ],
}: SiteHeaderWithBreadcrumbProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = {
    name: session?.user.name ?? "",
    email: session?.user.email ?? "",
    avatar: session?.user.image ?? "",
  };

  return (
    <header className="relative flex h-(--header-height) w-full shrink-0 items-center gap-2 border-b border-border/60 bg-background/50 backdrop-blur-xl transition-[width,height] ease-linear supports-[backdrop-filter]:bg-background/35 group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="relative z-10 -ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />

        {/* Logo for mobile - centered */}
        <Link
          href="/dashboard"
          className="absolute inset-0 flex items-center justify-center md:hidden"
        >
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
                  key={item.href || item.label}
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
              <NavUser user={user} />
            </Suspense>
          </div>
        </div>
      </div>
    </header>
  );
}
