import {
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { companyInfo } from "@/data/info-company";
import { WHATSAPP_PRECADASTRO_URL } from "../_lib/whatsapp";
import { TrackedCta } from "./tracked-cta";

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

      <div className="container mx-auto max-w-7xl px-4 pt-8 pb-7 sm:px-6 sm:pt-12 sm:pb-9 lg:px-8 lg:pt-14 lg:pb-10">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary shadow-sm backdrop-blur-sm sm:text-sm">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            PRÉ-CADASTRO B2B
          </div>

          <h1 className="mt-4 text-balance text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl">
            Compre no atacado com a{" "}
            <span className="bg-gradient-to-r from-primary via-primary to-chart-4 bg-clip-text text-transparent">
              {companyInfo.name}
            </span>
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
            Acesse catálogo exclusivo, condições comerciais para revenda e
            atendimento especializado para sua loja.
          </p>

          {/* Stats row */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
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

          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <TrackedCta
              event="register_primary_cta_click"
              href="#formulario"
              size="lg"
              className="w-full cursor-pointer shadow-md sm:w-auto"
            >
              Fazer pré-cadastro
              <ArrowRight className="ml-2 size-4" />
            </TrackedCta>
            <TrackedCta
              event="register_whatsapp_click"
              href={WHATSAPP_PRECADASTRO_URL}
              external
              variant="outline"
              size="lg"
              payload={{ location: "hero" }}
              className="w-full cursor-pointer bg-background/60 backdrop-blur-sm sm:w-auto"
            >
              <MessageCircle className="mr-2 size-4" />
              Falar com vendas
            </TrackedCta>
          </div>
        </div>
      </div>
    </section>
  );
}
