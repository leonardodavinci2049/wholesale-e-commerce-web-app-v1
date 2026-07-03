import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { companyInfo } from "@/data/info-company";

const CONTACT_ITEMS = [
  {
    icon: MapPin,
    label: "Endereço",
    value: companyInfo.address,
  },
  {
    icon: Phone,
    label: "Telefone",
    value: companyInfo.phone,
  },
  {
    icon: Mail,
    label: "E-mail",
    value: companyInfo.email,
    href: `mailto:${companyInfo.email}`,
  },
  {
    icon: Clock,
    label: "Horário de atendimento",
    value: `Seg a sex: ${companyInfo.openingHours} · Sáb: ${companyInfo.openingSaturday}`,
  },
] as const;

export function RegisterTrustSection() {
  return (
    <section className="border-t border-border/40 py-8 sm:py-10 lg:py-12">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
              Quem é a {companyInfo.name}
            </h2>
            <p className="mt-2.5 text-sm text-muted-foreground sm:text-base">
              Atendemos lojistas e revendedores com foco em atacado. Faça seu
              pré-cadastro e nossa equipe comercial entra em contato para
              concluir o atendimento.
            </p>
            <p className="mt-2.5 text-sm text-muted-foreground">
              Estamos em Ribeirão Preto/SP. Todos os contatos abaixo são
              oficiais para atendimento comercial.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {CONTACT_ITEMS.map((item) => {
              const Icon = item.icon;
              const content = (
                <>
                  <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-4" />
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {item.label}
                    </span>
                    <span className="text-sm leading-snug">{item.value}</span>
                  </span>
                </>
              );

              return "href" in item && item.href ? (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-start gap-3 rounded-2xl border border-border/60 bg-card p-3.5 shadow-sm transition-colors hover:border-primary/40 hover:bg-muted/40"
                >
                  {content}
                </a>
              ) : (
                <div
                  key={item.label}
                  className="flex items-start gap-3 rounded-2xl border border-border/60 bg-card p-3.5 shadow-sm"
                >
                  {content}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
