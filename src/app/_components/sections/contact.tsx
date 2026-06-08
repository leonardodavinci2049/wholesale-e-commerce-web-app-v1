import { MapPin, MessageSquare, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { publicEnvs } from "@/core/config";


const getContactData = () =>
  [
    {
      icon: Phone,
      title: "Televendas",
      info: publicEnvs.NEXT_PUBLIC_COMPANY_WHATSAPP.replace(/^55/, "").replace(
        /(\d{2})(\d{5})(\d{4})/,
        "($1) $2-$3",
      ),
      color: "green",
    },
    {
      icon: MessageSquare,
      title: "WhatsApp",
      info: publicEnvs.NEXT_PUBLIC_COMPANY_WHATSAPP.replace(
        /(\d{2})(\d{2})(\d{5})(\d{4})/,
        "$1 $2 $3-$4",
      ),
      href: `https://wa.me/${publicEnvs.NEXT_PUBLIC_COMPANY_WHATSAPP}`,
      color: "green",
    },
    {
      icon: MapPin,
      title: "Localização",
      info: "Ribeirão Preto, SP",
      color: "purple",
    },
  ] as const;

export function ContactSection() {
  const CONTACT_DATA = getContactData();

  return (
    <section id="contato" className="py-16 sm:py-20">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center sm:mb-16">
          <h2 className="mb-3 text-2xl font-bold sm:mb-4 sm:text-3xl lg:text-4xl">
            Entre em Contato
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-base sm:text-lg lg:text-xl">
            Nossa equipe está pronta para atender você
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
          {CONTACT_DATA.map((contact) => {
            const Icon = contact.icon;
            return (
              <Card key={contact.title}>
                <CardContent className="p-4 text-center sm:p-6">
                  <Icon
                    className={`h-6 w-6 sm:h-8 sm:w-8 text-${contact.color}-600 mx-auto mb-3 sm:mb-4`}
                  />
                  <h3 className="mb-2 text-sm font-semibold sm:text-base">
                    {contact.title}
                  </h3>
                  {"href" in contact ? (
                    <a
                      href={contact.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground text-sm hover:underline sm:text-base"
                    >
                      {contact.info}
                    </a>
                  ) : (
                    <p className="text-muted-foreground text-sm sm:text-base">
                      {contact.info}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
