"use client";

import {
  AudioWaveform,
  BookOpen,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map as MapIcon,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";
import type * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavUser } from "./nav-user";
import { SidebarLogo } from "./sidebar-logo";

// This is sample data.
const data = {
  user: {
    name: "Comsuporte",
    email: "mauro@comsuporte.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "WinERP",
      logo: GalleryVerticalEnd,
      plan: "Distribuidora",
    },
    {
      name: "Mundial Megastore",
      logo: AudioWaveform,
      plan: "Enterprise",
    },
    {
      name: "Atacadão Eletrônico",
      logo: Command,
      plan: "Revenda",
    },
  ],
  navMain: [
    {
      title: "Inciar Orçamento",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Novo Orçamento v2",
          url: "/dashboard/order/new-budget-v2",
        },

        {
          title: "Novo Orçamento",
          url: "/dashboard/order/new-budget",
        },

        {
          title: "Meus Pedidos",
          url: "/dashboard/order/order-list",
        },
      ],
    },
    {
      title: "Tabela de Produtos",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Lista de Produtos",
          url: "/dashboard/product/product-list",
        },
        {
          title: "Mais Vendidos",
          url: "/dashboard/product/products-best-selling",
        },
      ],
    },

    {
      title: "Relatórios",
      url: "#",
      icon: Settings2,
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
      icon: Frame,
    },
    {
      name: "CRM",
      url: "/dashboard/crm",
      icon: PieChart,
    },
    {
      name: "Configurações",
      url: "/dashboard/settings/",
      icon: MapIcon,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
