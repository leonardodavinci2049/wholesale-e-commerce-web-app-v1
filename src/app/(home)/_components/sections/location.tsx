import { Clock, MapPin, Phone, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { publicEnvs } from "@/core/config/envs.client";

const CONTACT_INFO = {
  address: "Av. Caramuru, 1008 - Jardim Sumaré\nRibeirão Preto - SP, 14025-080",
  phone: publicEnvs.NEXT_PUBLIC_COMPANY_PHONE,
  email: publicEnvs.NEXT_PUBLIC_COMPANY_EMAIL,
  hours: {
    weekdays: "Segunda a Sexta: 8h às 18h",
    saturday: "Sábado: 8h às 12h",
    sunday: "Domingo: Fechado",
  },
} as const;

export function LocationSection() {
  return (
    <section className="bg-muted/50 py-16 sm:py-20">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center sm:mb-12">
          <h2 className="mb-3 text-2xl font-bold sm:mb-4 sm:text-3xl lg:text-4xl">
            Visite Nossa Loja Física
          </h2>
          <p className="text-muted-foreground mx-auto max-w-3xl text-base sm:text-lg lg:text-xl">
            Venha conhecer nosso showroom com mais de 5.000 produtos em
            exposição. Nossa equipe especializada está pronta para atendê-lo com
            os melhores preços e condições especiais para revendedores.
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 sm:gap-12 lg:grid-cols-2">
          {/* Map */}
          <div className="order-2 lg:order-1">
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-gray-800">
              <iframe
                src={publicEnvs.NEXT_PUBLIC_COMPANY_MAPS_URL}
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[300px] w-full sm:h-[350px] lg:h-[400px]"
                title={`Localização da ${publicEnvs.NEXT_PUBLIC_COMPANY_NAME}`}
              />
            </div>
          </div>

          {/* Location Info */}
          <div className="order-1 space-y-6 sm:space-y-8 lg:order-2">
            <div>
              <h3 className="mb-4 text-xl font-bold sm:mb-6 sm:text-2xl">
                {publicEnvs.NEXT_PUBLIC_COMPANY_NAME}
              </h3>

              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 sm:h-12 sm:w-12 dark:bg-green-900/20">
                      <MapPin className="h-5 w-5 text-green-600 sm:h-6 sm:w-6" />
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-1 text-sm font-semibold sm:text-base">
                      Endereço
                    </h4>
                    <p className="text-muted-foreground text-sm whitespace-pre-line sm:text-base">
                      {CONTACT_INFO.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 sm:h-12 sm:w-12 dark:bg-blue-900/20">
                      <Phone className="h-5 w-5 text-blue-600 sm:h-6 sm:w-6" />
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-1 text-sm font-semibold sm:text-base">
                      Telefone
                    </h4>
                    <p className="text-muted-foreground text-sm sm:text-base">
                      {CONTACT_INFO.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 sm:h-12 sm:w-12 dark:bg-purple-900/20">
                      <Clock className="h-5 w-5 text-purple-600 sm:h-6 sm:w-6" />
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-1 text-sm font-semibold sm:text-base">
                      Horário de Funcionamento
                    </h4>
                    <div className="text-muted-foreground space-y-1 text-sm sm:text-base">
                      <p>{CONTACT_INFO.hours.weekdays}</p>
                      <p>{CONTACT_INFO.hours.saturday}</p>
                      <p>{CONTACT_INFO.hours.sunday}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Button
                size="lg"
                className="flex h-12 min-h-[3rem] flex-1 items-center justify-center whitespace-nowrap cursor-pointer"
              >
                <MapPin className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Abrir no Google Maps
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="flex h-12 min-h-[3rem] flex-1 items-center justify-center bg-transparent whitespace-nowrap cursor-pointer"
              >
                <Phone className="mr-2 h-4 w-4 sm:h-5 sm:w-5 " />
                Ligar Agora
              </Button>
            </div>

            <Card className="border-green-200 bg-linear-to-r from-green-50 to-blue-50 dark:border-green-800 dark:from-green-950/20 dark:to-blue-950/20">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start space-x-3">
                  <div className="shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 sm:h-10 sm:w-10 dark:bg-green-900/20">
                      <Star className="h-4 w-4 text-green-600 sm:h-5 sm:w-5" />
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-2 text-sm font-semibold sm:text-base">
                      Agende sua Visita
                    </h4>
                    <p className="text-muted-foreground mb-3 text-xs sm:text-sm">
                      Recomendamos agendar uma visita para apresentarmos nossos
                      produtos e condições especiais para revendedores.
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-transparent text-xs sm:text-sm"
                    >
                      Agendar Visita
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
