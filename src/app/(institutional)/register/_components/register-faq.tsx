import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const REGISTER_FAQ_DATA: { question: string; answer: string }[] = [
  {
    question: "Preciso criar senha agora?",
    answer:
      "Não. O formulário é de pré-cadastro. A liberação de acesso acontece depois da análise comercial da nossa equipe.",
  },
  {
    question: "Pessoa física pode se cadastrar?",
    answer:
      "A prioridade é o atendimento B2B (pessoa jurídica). Você pode iniciar o pré-cadastro como pessoa física informando o CPF, e nossa equipe vai avaliar o atendimento.",
  },
  {
    question: "Quanto tempo leva a análise?",
    answer:
      "Nossa equipe comercial retorna pelos contatos informados (e-mail ou WhatsApp). O prazo pode variar conforme o volume de solicitações.",
  },
  {
    question: "Já sou cliente. O que faço?",
    answer:
      "Acesse o login ou fale com vendas pelo WhatsApp para recuperar as orientações de acesso à sua conta.",
  },
  {
    question: "Meus dados serão usados para quê?",
    answer:
      "Apenas para análise do pré-cadastro e para contato comercial relacionado ao atendimento de atacado da MWS Distribuidora.",
  },
];

export function RegisterFaq() {
  return (
    <section className="border-t border-border/40 py-8 sm:py-10 lg:py-12">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 text-center sm:mb-7">
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
            Perguntas frequentes
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
            Tire suas dúvidas antes de enviar o pré-cadastro.
          </p>
        </div>

        <Accordion
          type="single"
          collapsible
          className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm"
        >
          {REGISTER_FAQ_DATA.map((item, index) => (
            <AccordionItem
              key={item.question}
              value={`faq-${index + 1}`}
              className="border-b-border/60 last:border-b-0"
            >
              <AccordionTrigger className="px-4 hover:no-underline sm:px-5">
                <span className="text-left font-semibold">{item.question}</span>
              </AccordionTrigger>
              <AccordionContent className="px-4 text-muted-foreground sm:px-5">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
