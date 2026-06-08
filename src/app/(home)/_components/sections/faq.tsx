import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import type { FAQItem } from "@/types/home-type";

const FAQ_DATA: FAQItem[] = [
  {
    question: "Como faço para me cadastrar como revendedor?",
    answer:
      'É muito simples! Clique no botão "Cadastrar-se Agora" e preencha o formulário com seus dados. Nossa equipe analisará seu cadastro e liberará o acesso à área restrita em até 24 horas.',
  },
  {
    question: "Qual o valor mínimo para pedidos?",
    answer:
      "Trabalhamos com pedido mínimo de R$ 500,00 para primeira compra. Para clientes cadastrados há mais de 6 meses, o pedido mínimo é de R$ 300,00.",
  },
  {
    question: "Vocês entregam em todo o Brasil?",
    answer:
      "Sim! Atendemos todo o território nacional. Trabalhamos com as principais transportadoras e oferecemos frete grátis para pedidos acima de R$ 1.500,00 nas capitais.",
  },
  {
    question: "Quais são as formas de pagamento?",
    answer:
      "Aceitamos PIX (com desconto), cartão de crédito, boleto bancário e para clientes com histórico, oferecemos prazo de 30/60 dias para pagamento.",
  },
  {
    question: "Os produtos têm garantia?",
    answer:
      "Todos os nossos produtos são originais e acompanham garantia do fabricante. Além disso, oferecemos suporte técnico especializado para nossos revendedores.",
  },
  {
    question: "Posso visitar a loja física?",
    answer:
      "Claro! Nossa loja está localizada em Ribeirão Preto/SP. Recomendamos agendar uma visita para que possamos apresentar nossos produtos e condições especiais.",
  },
] as const;

export function FAQSection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-start">
          {/* Left Side - Content */}
          <div className="order-2 lg:order-1">
            <Badge className="mb-3 sm:mb-4 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs sm:text-sm">
              ATACADO E VAREJO
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 leading-tight">
              Há mais de 25 anos Fornecendo Produtos de Qualidade para
              Revendedores
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              Distribuição de Eletrônicos, Informática e Perfumes Importados,
              Preços para Atacado e Varejo, Suporte Especializado e Condições
              Exclusivas para Revendedores e Consumidores.
            </p>
          </div>

          {/* Right Side - FAQ */}
          <div className="order-1 lg:order-2">
            <Accordion
              type="single"
              collapsible
              className="space-y-3 sm:space-y-4"
            >
              {FAQ_DATA.map((item, index) => (
                <AccordionItem
                  key={item.question}
                  value={`item-${index + 1}`}
                  className="border rounded-lg px-4 sm:px-6"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-4 sm:py-6 text-sm sm:text-base">
                    <span className="font-semibold">{item.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 sm:pb-6 text-sm sm:text-base text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
