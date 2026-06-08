import { CheckCircle, Package } from "lucide-react";

const BENEFITS_DATA = [
  {
    title: "Preços para Atacado e Varejo",
    description: "Margens competitivas para maximizar seus lucros",
  },
  {
    title: "Catálogo Exclusivo",
    description: "Acesso a produtos exclusivos para revendedores cadastrados",
  },
  {
    title: "Suporte Especializado",
    description: "Equipe dedicada para apoiar seu crescimento",
  },
  {
    title: "Condições Especiais",
    description: "Prazos de pagamento flexíveis e descontos por volume",
  },
] as const;

export function BenefitsSection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="container mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">
              Vantagens Exclusivas para Revendedores
            </h2>
            <div className="space-y-4">
              {BENEFITS_DATA.map((benefit) => (
                <div key={benefit.title} className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-sm sm:text-base">
                      {benefit.title}
                    </h4>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative order-1 lg:order-2">
            <div className="aspect-square bg-linear-to-br from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <Package className="h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 text-green-600 mx-auto mb-3 sm:mb-4" />
                <p className="text-base sm:text-lg font-semibold">
                  Área Restrita
                </p>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Catálogo Exclusivo
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
