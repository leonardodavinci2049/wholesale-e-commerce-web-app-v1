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
    value: `Segunda a sexta: ${companyInfo.openingHours} · Sábado: ${companyInfo.openingSaturday}`,
  },
] as const;

export function RegisterTrustSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
              Quem é a {companyInfo.name}
            </h2>
            <p className="mt-3 text-base text-muted-foreground sm:text-lg">
              Atendemos lojistas e revendedores com foco em atacado. Faça seu
              pré-cadastro e nossa equipe comercial entra em contato para
              concluir o atendimento.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Estamos em Ribeirão Preto/SP. Todos os dados de contato abaixo são
              oficiais para atendimento comercial.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {CONTACT_ITEMS.map((item) => {
              const Icon = item.icon;
              const content = (
                <>
                  <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="size-4" />
                  </span>
                  <span className="flex flex-col">
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {item.label}
                    </span>
                    <span className="text-sm">{item.value}</span>
                  </span>
                </>
              );

              return "href" in item && item.href ? (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-start gap-3 rounded-2xl border bg-card p-4 shadow-sm transition-colors hover:bg-muted/50"
                >
                  {content}
                </a>
              ) : (
                <div
                  key={item.label}
                  className="flex items-start gap-3 rounded-2xl border bg-card p-4 shadow-sm"
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
