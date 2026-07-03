import { ClipboardList, MessageSquareQuote, Rocket } from "lucide-react";

const STEPS = [
  {
    icon: ClipboardList,
    step: "1",
    title: "Preencha seus dados",
    description:
      "Envie os dados da empresa e os contatos comerciais no formulário de pré-cadastro.",
  },
  {
    icon: MessageSquareQuote,
    step: "2",
    title: "Análise do perfil comercial",
    description:
      "Nossa equipe avalia seu perfil de compra para liberar o acesso ao catálogo e às condições.",
  },
  {
    icon: Rocket,
    step: "3",
    title: "Aprovação e contato",
    description:
      "Após a aprovação, retornamos pelo e-mail ou WhatsApp com as orientações de acesso.",
  },
] as const;

export function RegisterSteps() {
  return (
    <section className="bg-muted/40 py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center sm:mb-12">
          <h2 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
            Como funciona o cadastro
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {STEPS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative flex flex-col items-start gap-3 rounded-2xl border bg-card p-6 shadow-sm"
              >
                <span className="inline-flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Icon className="size-5" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Etapa {item.step}
                </span>
                <h3 className="text-base font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
