import { ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import { companyInfo } from "@/data/info-company";

const MARKET_YEARS = new Date().getFullYear() - companyInfo.yearFoundation;
const PRODUCTS_K = Math.max(1, Math.round(companyInfo.productsQuantity / 1000));

const STATS = [
  { icon: TrendingUp, value: `+${MARKET_YEARS}`, label: "anos de mercado" },
  { icon: Sparkles, value: `+${PRODUCTS_K}k`, label: "produtos" },
  { icon: ShieldCheck, value: "B2B", label: "atacado exclusivo" },
] as const;

export function RegisterHero() {
  return (
    <section className="relative overflow-hidden border-b border-border/40">
      {/* Gradient mesh background (decorative) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -top-32 -left-24 size-[28rem] rounded-full bg-primary/20 blur-3xl dark:bg-primary/25" />
        <div className="absolute -top-20 right-0 size-80 rounded-full bg-chart-2/15 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 size-72 rounded-full bg-chart-3/10 blur-3xl dark:bg-chart-4/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,var(--primary)/8%,transparent_60%)]" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 pt-5 pb-4 sm:px-6 sm:pt-7 sm:pb-6 lg:px-8 lg:pt-8 lg:pb-7">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-balance text-2xl font-bold leading-[1.1] tracking-tight sm:text-3xl lg:text-4xl">
            Compre no atacado com a{" "}
            <span className="bg-gradient-to-r from-primary via-primary to-chart-4 bg-clip-text text-transparent">
              {companyInfo.name}
            </span>
          </h1>

          {/* Stats row */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs sm:gap-x-6 sm:gap-y-2 sm:text-sm">
            {STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="flex items-center gap-1.5 text-muted-foreground"
                >
                  <Icon className="size-4 text-primary" />
                  <span className="font-bold text-foreground">
                    {stat.value}
                  </span>
                  <span>{stat.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
