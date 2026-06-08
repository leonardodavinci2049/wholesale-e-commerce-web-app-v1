import { Globe, Shield, Zap } from "lucide-react";
import { publicEnvs } from "@/core/config/envs.client";

const FEATURES_DATA = [
  {
    icon: Shield,
    title: "Qualidade Garantida",
    description:
      "Todos os produtos são originais e passam por rigoroso controle de qualidade antes da entrega",
    color: "blue",
  },
  {
    icon: Zap,
    title: "Entrega Rápida",
    description:
      "Agilidade no processamento e envio dos pedidos para todo o território nacional",
    color: "green",
  },
  {
    icon: Globe,
    title: "Atendimento Nacional",
    description:
      "Distribuímos para todo o Brasil com suporte especializado em cada região",
    color: "purple",
  },
] as const;

export function WhyChooseUsSection() {
  return (
    <section className="py-16 sm:py-20 bg-muted/50">
      <div className="container mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
            Por que escolher a {publicEnvs.NEXT_PUBLIC_COMPANY_NAME}?
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4 sm:px-0">
            Oferecemos as melhores condições para o seu negócio prosperar
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-8">
          {FEATURES_DATA.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="text-center">
                <div
                  className={`inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-${feature.color}-100 dark:bg-${feature.color}-900/20 mb-4 sm:mb-6`}
                >
                  <Icon
                    className={`h-7 w-7 sm:h-8 sm:w-8 text-${feature.color}-600`}
                  />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
