import { ArrowRight, MessageCircle } from "lucide-react";
import { WHATSAPP_PRECADASTRO_URL } from "../_lib/whatsapp";
import { TrackedCta } from "./tracked-cta";

export function RegisterFinalCta() {
  return (
    <section className="relative overflow-hidden">
      {/* Gradient background with decorative blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
        <div className="absolute -top-20 -right-10 size-72 rounded-full bg-chart-3/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-10 size-80 rounded-full bg-chart-4/20 blur-3xl" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-10 text-center sm:px-6 sm:py-12 lg:px-8">
        <h2 className="text-balance text-2xl font-bold tracking-tight text-primary-foreground sm:text-3xl lg:text-4xl">
          Pronto para comprar no atacado?
        </h2>
        <p className="mx-auto mt-2.5 max-w-2xl text-pretty text-base text-primary-foreground/90 sm:text-lg">
          Faça agora seu pré-cadastro. É rápido e não exige senha nesta etapa.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <TrackedCta
            event="register_primary_cta_click"
            href="#formulario"
            size="lg"
            className="w-full cursor-pointer bg-primary-foreground text-primary shadow-lg hover:bg-primary-foreground/90 sm:w-auto"
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
            payload={{ location: "final-cta" }}
            className="w-full cursor-pointer border-primary-foreground/40 bg-primary-foreground/5 text-primary-foreground backdrop-blur-sm hover:bg-primary-foreground/15 sm:w-auto"
          >
            <MessageCircle className="mr-2 size-4" />
            Falar com vendas no WhatsApp
          </TrackedCta>
        </div>
      </div>
    </section>
  );
}
