"use client";

import {
  AudioWaveform,
  CalendarDays,
  ChartColumn,
  CircleUserRound,
  ClipboardList,
  Command,
  GalleryVerticalEnd,
  House,
  PackageSearch,
  PieChart,
  Settings,
  ShoppingBag,
  Users,
} from "lucide-react";
import type * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { publicEnvs } from "@/core/config";
import { useSession } from "@/lib/auth/auth-client";
import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavUser } from "./nav-user";
import { SidebarLogo } from "./sidebar-logo";

// This is sample data.
const data = {
  teams: [
    {
      name: publicEnvs.NEXT_PUBLIC_APP_NAME,
      logo: GalleryVerticalEnd,
      plan: "Distribuidora",
    },
    {
      name: "Empresa Filial 01",
      logo: AudioWaveform,
      plan: "Enterprise",
    },
    {
      name: "Empresa Filial 02",
      logo: Command,
      plan: "Revenda",
    },
  ],
  navMain: [
    {
      title: "Pedido",
      url: "#",
      icon: ClipboardList,
      isActive: true,
      items: [
        {
          title: "Orçamento/Pedido",
          url: "/dashboard/sales-dashboard",
        },

        {
          title: "Novo Orçamento",
          url: "/dashboard/order/new-budget",
        },
      ],
    },
    {
      title: "Minhas Compras",
      url: "#",
      icon: ShoppingBag,
      items: [
        {
          title: "Lista de Pedidos",
          url: "/dashboard/order/order-list",
        },

        {
          title: "Lista de Orçamentos",
          url: "/dashboard/order/budget-list",
        },
        {
          title: "Produtos Comprados",
          url: "/dashboard/order/purchased-products",
        },
        {
          title: "Garantia",
          url: "/dashboard/order/warranty",
        },
      ],
    },

    {
      title: "Catálogo de Produtos",
      url: "#",
      icon: PackageSearch,
      items: [
        {
          title: "Em Promoção",
          url: "/dashboard/product/products-on-sale",
        },
        {
          title: "Lançamentos",
          url: "/dashboard/product/products-new-releases",
        },

        {
          title: "Mais Vendidos",
          url: "/dashboard/product/products-best-selling",
        },
        {
          title: "Tabela",
          url: "/dashboard/product/products-tabela",
        },
      ],
    },

    {
      title: "Minha Conta",
      url: "#",
      icon: CircleUserRound,
      items: [
        {
          title: "Profile",
          url: "/dashboard/profile",
        },
      ],
    },

    {
      title: "Relatórios",
      url: "#",
      icon: ChartColumn,
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
      icon: CalendarDays,
    },
    {
      name: "CRM",
      url: "/dashboard/crm",
      icon: PieChart,
    },
    {
      name: "Welcome",
      url: "/dashboard/welcome",
      icon: House,
    },

    {
      name: "Configurações",
      url: "/dashboard/settings/",
      icon: Settings,
    },
    {
      name: "Usuários",
      url: "/dashboard/users/",
      icon: Users,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();
  const isAdmin = session?.user.role === "admin";
  const projects = isAdmin
    ? data.projects
    : data.projects.filter((item) => item.name !== "Usuários");

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
        <NavProjects projects={projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
