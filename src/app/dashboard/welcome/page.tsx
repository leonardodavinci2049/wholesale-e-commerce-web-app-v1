import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Bolt,
  CalendarDays,
  ClipboardList,
  LayoutGrid,
  PackageSearch,
  ShieldCheck,
  ShoppingCart,
  TriangleAlert,
} from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { companyInfo } from "@/data/info-company";

import { getAuthContext } from "@/server/auth-context";
import { DashboardMobileBottomBar } from "../_components/dashboard-mobile-bottom-bar";
import { SiteHeaderWithBreadcrumb } from "../_components/header/site-header-with-breadcrumb";

const modules = [
  {
    title: "Orçamentos e Pedidos",
    description: "Gerencie pedidos, orçamentos e status de entrega.",
    href: "/dashboard/sales-dashboard",
    icon: BadgeCheck,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "group-hover:border-blue-500/50",
  },
  {
    title: "Meu Carrinho",
    description: "Adicione novos produtos ao carrinho.",
    href: "/dashboard",
    icon: ShoppingCart,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "group-hover:border-amber-500/50",
  },
  {
    title: "Produtos em Destaque",
    description: "Confira os produtos em destaque.",
    href: "/dashboard/product/products-on-sale",
    icon: PackageSearch,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "group-hover:border-emerald-500/50",
  },
  {
    title: "Lançamentos",
    description: "Confira os lançamentos.",
    href: "/dashboard/product/products-new-releases",
    icon: Bolt,
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
    borderColor: "group-hover:border-indigo-500/50",
  },
  {
    title: "Os mais Vendidos",
    description: "Confira os mais vendidos.",
    href: "/dashboard/product/products-best-selling",
    icon: BarChart3,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    borderColor: "group-hover:border-purple-500/50",
  },
  {
    title: "MInhas Compras",
    description: "Confira suas compras.",
    href: "/dashboard/order/order-list",
    icon: ClipboardList,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
    borderColor: "group-hover:border-rose-500/50",
  },
  {
    title: "Relatórios",
    description: "Acesse os relatórios.",
    href: "/dashboard/report/panel",
    icon: BarChart3,
    color: "text-sky-500",
    bgColor: "bg-sky-500/10",
    borderColor: "group-hover:border-sky-500/50",
  },
  {
    title: "Meu Cadastro",
    description: "Confira seus dados cadastrais.",
    href: "/dashboard/profile",
    icon: ShieldCheck,
    color: "text-sky-500",
    bgColor: "bg-sky-500/10",
    borderColor: "group-hover:border-sky-500/50",
  },
  {
    title: "Agenda",
    description: "Organize seus compromissos, visitas e retornos.",
    href: "/dashboard/agenda/agenda-panel",
    icon: CalendarDays,
    color: "text-slate-500",
    bgColor: "bg-slate-500/10",
    borderColor: "group-hover:border-slate-500/50",
  },
];

function getInitials(name?: string | null) {
  if (!name) return "US";

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return initials || "US";
}

export default async function WelcomePage() {
  const { session, authWarning } = await getAuthContext();

  const { user } = session;
  const firstName = user?.name?.split(" ")[0] || "Vendedor";
  const userInitials = getInitials(user?.name);
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(148,163,184,0.1),transparent_20%)]" />

      <SiteHeaderWithBreadcrumb
        title="Início"
        breadcrumbItems={[{ label: "Início", isActive: true }]}
      />

      <main className="mx-auto flex w-full max-w-350 flex-1 flex-col gap-3 p-3 md:p-4 lg:p-5">
        {authWarning ? (
          <Alert className="border-amber-500/40 bg-amber-500/10 text-amber-950 dark:text-amber-100">
            <TriangleAlert className="text-amber-600 dark:text-amber-300" />
            <AlertTitle>{authWarning.title}</AlertTitle>
            <AlertDescription className="text-amber-900/80 dark:text-amber-100/80">
              {authWarning.description}
            </AlertDescription>
          </Alert>
        ) : null}

        <Card className="overflow-hidden border-border/60 bg-linear-to-br from-card via-card to-muted/30 shadow-sm animate-in fade-in slide-in-from-bottom-3 duration-500">
          <CardContent className="relative px-4 py-2 sm:px-6 sm:py-3">
            <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-40 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_65%)] lg:block" />

            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3 sm:gap-4">
                <Avatar className="size-12 border border-border/60 shadow-sm sm:size-14">
                  <AvatarImage
                    src={user.image ?? ""}
                    alt={user.name ?? firstName}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold sm:text-xl">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-2">
                  <div className="space-y-1">
                    <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                      Olá, {firstName}!
                    </h1>
                    <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
                      Bem-vindo à <strong>{companyInfo.name}</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <section className="grid grid-cols-1 gap-4 pb-4 xl:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-border/60 bg-card/70 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <CardHeader className="space-y-0.5 px-4 py-2">
              <CardTitle className="flex items-center gap-2 text-base tracking-tight">
                <LayoutGrid className="size-5 text-foreground/80" />
                Acesso rápido
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {modules.map((mod, index) => (
                <Link
                  key={mod.title}
                  href={mod.href}
                  prefetch={false}
                  className="group block rounded-2xl outline-none transition-colors hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <div
                    className={`flex items-start gap-3 px-3 py-3 ${
                      index < modules.length - 1
                        ? "border-b border-border/50"
                        : ""
                    }`}
                  >
                    <div
                      className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl ${mod.bgColor} ${mod.color}`}
                    >
                      <mod.icon className="size-4.5 stroke-[1.75]" />
                    </div>

                    <div className="min-w-0 grow">
                      <p className="text-sm font-medium text-foreground">
                        {mod.title}
                      </p>
                      <p className="line-clamp-1 text-xs text-muted-foreground sm:text-sm">
                        {mod.description}
                      </p>
                    </div>

                    <ArrowRight className="mt-1 size-4 shrink-0 text-foreground/40 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </section>
      </main>

      <DashboardMobileBottomBar />
    </div>
  );
}
