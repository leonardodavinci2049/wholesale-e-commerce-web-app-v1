import { ArrowRight, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { WHATSAPP_PRECADASTRO_URL } from "../_lib/whatsapp";
import { TrackedCta } from "./tracked-cta";

export function RegisterHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 pt-10 pb-12 sm:px-6 sm:pt-16 sm:pb-16 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Badge className="mb-4 border border-primary/20 bg-primary/10 text-xs text-primary sm:text-sm">
            PRÉ-CADASTRO B2B
          </Badge>

          <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            Compre no atacado com a MWS Distribuidora
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg lg:text-xl">
            Faça seu pré-cadastro para acessar catálogo exclusivo, condições
            comerciais para revenda e atendimento especializado para sua loja.
          </p>

          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
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
              payload={{ location: "hero" }}
              className="w-full cursor-pointer sm:w-auto"
            >
              <MessageCircle className="mr-2 size-4" />
              Falar com vendas no WhatsApp
            </TrackedCta>
          </div>
        </div>
      </div>
    </section>
  );
}
