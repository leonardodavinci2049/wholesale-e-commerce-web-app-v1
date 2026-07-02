import { Headset, PackageCheck, Store, Tags } from "lucide-react";

const BENEFITS = [
  {
    icon: Tags,
    title: "Catálogo para revendedores",
    description:
      "Acesse linhas de eletrônicos, informática, acessórios, peças para celular, películas, displays e periféricos.",
  },
  {
    icon: PackageCheck,
    title: "Condições comerciais B2B",
    description:
      "Negocie compras para reposição e volume com atendimento consultivo da nossa equipe.",
  },
  {
    icon: Headset,
    title: "Atendimento especializado",
    description:
      "Conte com suporte comercial para encontrar produtos adequados ao seu mix de vendas.",
  },
  {
    icon: Store,
    title: "Operação com loja física",
    description:
      "Fale com a equipe ou visite a MWS Distribuidora em Ribeirão Preto/SP.",
  },
] as const;

export function ResellerBenefits() {
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center sm:mb-12">
          <h2 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
            Vantagens para quem revende
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Cadastre-se para acessar condições de atacado e suporte comercial
            dedicado ao seu negócio.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                className="flex flex-col items-start gap-3 rounded-2xl border bg-card p-6 shadow-sm"
              >
                <span className="inline-flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                <h3 className="text-base font-semibold">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
