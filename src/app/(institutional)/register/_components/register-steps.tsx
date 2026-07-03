import { ClipboardList, MessageSquareQuote, Rocket } from "lucide-react";

const STEPS = [
  {
    icon: ClipboardList,
    step: "1",
    title: "Preencha seus dados",
    description:
      "Envie os dados da empresa e os contatos comerciais no formulário.",
  },
  {
    icon: MessageSquareQuote,
    step: "2",
    title: "Análise do perfil",
    description:
      "Nossa equipe avalia seu perfil de compra para liberar o acesso.",
  },
  {
    icon: Rocket,
    step: "3",
    title: "Aprovação e contato",
    description:
      "Após a aprovação, retornamos pelo e-mail ou WhatsApp com o acesso.",
  },
] as const;

export function RegisterSteps() {
  return (
    <div>
      <h2 className="text-lg font-bold tracking-tight sm:text-xl">
        Como funciona o cadastro
      </h2>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">
        {STEPS.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.step}
              className="group flex items-start gap-3 rounded-2xl border border-border/60 bg-card/60 p-3.5 shadow-sm backdrop-blur-sm transition-colors hover:border-primary/40 hover:bg-card"
            >
              <span className="relative inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-sm">
                <Icon className="size-[18px]" />
                <span className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full border-2 border-background bg-chart-3 text-[11px] font-bold text-foreground shadow-sm">
                  {item.step}
                </span>
              </span>
              <div className="flex min-w-0 flex-col gap-0.5">
                <h3 className="text-sm font-semibold leading-tight">
                  {item.title}
                </h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
