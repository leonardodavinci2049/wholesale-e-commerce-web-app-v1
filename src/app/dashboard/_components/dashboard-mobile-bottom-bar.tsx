import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  CalendarDays,
  ClipboardList,
  Home,
  LayoutGrid,
  Search,
  Settings,
  Store,
  Target,
  Users,
} from "lucide-react";
import Link from "next/link";

import {
  MobileBottomBar,
  MobileBottomBarLink,
  MobileBottomBarSheet,
} from "@/components/common/mobile-bottom-bar";

import { DashboardSearchContent } from "./dashboard-search-content";

interface MoreItem {
  label: string;
  href: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

const moreItems: MoreItem[] = [
  {
    label: "Clientes",
    href: "/dashboard/customer/customer-list",
    icon: Users,
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
  },
  {
    label: "CRM",
    href: "/dashboard/crm/crm-panel",
    icon: Target,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
  },
  {
    label: "Relatórios",
    href: "/dashboard/report/panel",
    icon: BarChart3,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    label: "Agenda",
    href: "/dashboard/agenda/agenda-panel",
    icon: CalendarDays,
    color: "text-sky-500",
    bgColor: "bg-sky-500/10",
  },
  {
    label: "Configurações",
    href: "/dashboard/settings",
    icon: Settings,
    color: "text-slate-500",
    bgColor: "bg-slate-500/10",
  },
];

export function DashboardMobileBottomBar() {
  return (
    <MobileBottomBar aria-label="Menu de navegação principal">
      <MobileBottomBarLink
        href="/dashboard"
        icon={<Home className="h-5 w-5" />}
        label="Home"
        exact
      />

      <MobileBottomBarLink
        href="/dashboard/sales-dashboard"
        icon={<Store className="h-5 w-5" />}
        label="Vendas"
      />

      <MobileBottomBarSheet
        icon={<Search className="h-5 w-5" />}
        label="Buscar"
        sheetTitle="Buscar produtos"
        side="bottom"
        contentClassName="h-auto max-h-[70vh] w-full max-w-lg mx-auto rounded-t-xl"
      >
        <DashboardSearchContent />
      </MobileBottomBarSheet>

      <MobileBottomBarLink
        href="/dashboard/order/order-list"
        icon={<ClipboardList className="h-5 w-5" />}
        label="Pedidos"
      />

      <MobileBottomBarSheet
        icon={<LayoutGrid className="h-5 w-5" />}
        label="Mais"
        sheetTitle="Mais opções"
        side="bottom"
        contentClassName="h-auto max-h-[70vh] w-full max-w-lg mx-auto rounded-t-xl"
      >
        <div className="grid grid-cols-3 gap-3 py-2">
          {moreItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                className="flex flex-col items-center gap-2 rounded-xl p-3 transition-colors hover:bg-muted/50 active:bg-muted"
              >
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.bgColor} ${item.color}`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-xs font-medium text-foreground">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </MobileBottomBarSheet>
    </MobileBottomBar>
  );
}
