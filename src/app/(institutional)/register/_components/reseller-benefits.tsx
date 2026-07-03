import { Headset, PackageCheck, Store, Tags } from "lucide-react";
import { cn } from "@/lib/utils";

const BENEFITS = [
  {
    icon: Tags,
    title: "Catálogo para revendedores",
    description:
      "Eletrônicos, informática, acessórios, peças para celular, películas, displays e periféricos.",
    accent: "bg-primary/10 text-primary",
  },
  {
    icon: PackageCheck,
    title: "Condições comerciais B2B",
    description:
      "Negocie compras para reposição e volume com atendimento consultivo.",
    accent: "bg-chart-2/10 text-chart-2 dark:text-chart-2",
  },
  {
    icon: Headset,
    title: "Atendimento especializado",
    description:
      "Suporte comercial para encontrar produtos adequados ao seu mix de vendas.",
    accent: "bg-chart-3/15 text-chart-3",
  },
  {
    icon: Store,
    title: "Loja física em Ribeirão Preto",
    description:
      "Fale com a equipe ou visite a MWS Distribuidora pessoalmente.",
    accent: "bg-chart-5/10 text-chart-5",
  },
] as const;

export function ResellerBenefits() {
  return (
    <div>
      <h2 className="text-lg font-bold tracking-tight sm:text-xl">
        Vantagens para quem revende
      </h2>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-2">
        {BENEFITS.map((benefit) => {
          const Icon = benefit.icon;
          return (
            <div
              key={benefit.title}
              className="flex flex-col gap-2 rounded-2xl border border-border/60 bg-card/60 p-3.5 shadow-sm backdrop-blur-sm transition-colors hover:border-primary/40 hover:bg-card"
            >
              <span
                className={cn(
                  "inline-flex size-9 items-center justify-center rounded-xl",
                  benefit.accent,
                )}
              >
                <Icon className="size-[18px]" />
              </span>
              <h3 className="text-sm font-semibold leading-tight">
                {benefit.title}
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {benefit.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
