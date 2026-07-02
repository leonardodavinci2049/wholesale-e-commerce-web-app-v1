import { ArrowRight, MessageCircle } from "lucide-react";
import { WHATSAPP_PRECADASTRO_URL } from "../_lib/whatsapp";
import { TrackedCta } from "./tracked-cta";

export function RegisterFinalCta() {
  return (
    <section className="bg-linear-to-r from-primary to-primary/80 py-12 text-primary-foreground sm:py-16">
      <div className="container mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="mb-3 text-2xl font-bold sm:mb-4 sm:text-3xl lg:text-4xl">
          Pronto para comprar no atacado?
        </h2>
        <p className="mx-auto mb-6 max-w-2xl text-base opacity-90 sm:mb-8 sm:text-lg lg:text-xl">
          Faça agora seu pré-cadastro. É rápido e não exige senha nesta etapa.
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <TrackedCta
            event="register_primary_cta_click"
            href="#formulario"
            size="lg"
            className="w-full cursor-pointer sm:w-auto"
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
            className="w-full cursor-pointer border-primary-foreground bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary sm:w-auto"
          >
            <MessageCircle className="mr-2 size-4" />
            Falar com vendas no WhatsApp
          </TrackedCta>
        </div>
      </div>
    </section>
  );
}
