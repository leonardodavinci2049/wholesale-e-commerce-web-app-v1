"use client";

import {
  AudioWave01Icon,
  ComputerTerminalIcon,
  LayoutBottomIcon,
  MapsIcon,
  PieChartIcon,
  RoboticIcon,
  Settings05Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useSession } from "@/lib/auth/auth-client";
import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavUser } from "./nav-user";
import { SidebarLogo } from "./sidebar-logo";

// This is sample data.
const data = {
  teams: [
    {
      name: "WinERP",
      logo: <HugeiconsIcon icon={AudioWave01Icon} strokeWidth={2} />,
      plan: "Distribuidora",
    },
  ],
  navMain: [
    {
      title: "Plataformas",
      url: "#",
      icon: <HugeiconsIcon icon={ComputerTerminalIcon} strokeWidth={2} />,
      isActive: true,
      items: [
        {
          title: "Cupons da Myh",
          url: "/dashboard/platforms/myh-coupons",
        },

        {
          title: "Elly Indica",
          url: "/dashboard/platforms/elly-indicates",
        },
      ],
    },
    {
      title: "Bots Telegram",
      url: "#",
      icon: <HugeiconsIcon icon={RoboticIcon} strokeWidth={2} />,
      items: [
        {
          title: "Bot Links Bianca",
          url: "/dashboard/telegram-bots/links-bianca-bot",
        },
        {
          title: "Bot Links Mih",
          url: "/dashboard/telegram-bots/links-mih-bot",
        },
        {
          title: "Bot Support Mih",
          url: "/dashboard/telegram-bots/mih-bot-support",
        },
      ],
    },

    {
      title: "Relatórios",
      url: "#",
      icon: <HugeiconsIcon icon={Settings05Icon} strokeWidth={2} />,
      items: [
        {
          title: "Painel geral",
          url: "/dashboard/report/panel",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Agenda",
      url: "/dashboard/agenda/agenda-panel",
      icon: <HugeiconsIcon icon={LayoutBottomIcon} strokeWidth={2} />,
    },
    {
      name: "CRM",
      url: "/dashboard/crm",
      icon: <HugeiconsIcon icon={PieChartIcon} strokeWidth={2} />,
    },
    {
      name: "Configurações",
      url: "/dashboard/settings/",
      icon: <HugeiconsIcon icon={MapsIcon} strokeWidth={2} />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();

  const user = {
    name: session?.user.name ?? "",
    email: session?.user.email ?? "",
    avatar: session?.user.image ?? "",
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarLogo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
