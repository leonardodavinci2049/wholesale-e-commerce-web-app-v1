"use client";

import Image from "next/image";
import Link from "next/link";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const SIDEBAR_LOGO_SRC = "/images/logo/logo-sidebar.png";

export function SidebarLogo() {
  const { setOpenMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" className="h-auto! px-1! py-1!" asChild>
          <Link
            href="/dashboard"
            onClick={() => setOpenMobile(false)}
            className="flex-col! items-start! w-full!"
          >
            <Image
              src={SIDEBAR_LOGO_SRC}
              alt="Logo da Empresa"
              width={300}
              height={80}
              priority
              className="h-auto w-[88%] max-w-[88%] object-contain object-left"
            />
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
