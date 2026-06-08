import {
  Award,
  Building2,
  Clock,
  Globe,
  Handshake,
  Heart,
  Shield,
  Star,
  Target,
  TrendingUp,
  Truck,
  Users,
  Zap,
} from "lucide-react";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { publicEnvs } from "@/core/config/envs.client";
import { getCurrentYear } from "@/lib/current-time";

export const metadata: Metadata = {
  title: `Quem Somos - ${publicEnvs.NEXT_PUBLIC_COMPANY_NAME}`,
  description: `Conheça a história da ${publicEnvs.NEXT_PUBLIC_COMPANY_NAME}, empresa atacadista e varejista B2B/B2C com mais de 30 anos de experiência no mercado. Excelência em atendimento e os melhores preços para sua empresa.`,
};

export default async function AboutPage() {
  const currentYear = await getCurrentYear();
  const foundingYear = 1994;
  const yearsInMarket = currentYear - foundingYear;

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      {/* Hero Section */}
      <div className="mb-16 text-center">
        <div className="mb-6 flex items-center justify-center gap-2">
          <Building2 className="text-primary h-12 w-12" />
          <h1 className="from-primary to-primary/60 bg-gradient-to-r bg-clip-text text-5xl font-bold text-transparent">
            Quem Somos
          </h1>
        </div>
        <p className="text-muted-foreground mx-auto max-w-4xl text-2xl leading-relaxed">
          Há mais de <strong>{yearsInMarket} anos</strong> no mercado, somos uma
          das maiores distribuidoras atacadistas e varejistas do Brasil,
          oferecendo <strong>excelência em atendimento </strong> e os{" "}
          <strong>melhores preços </strong>
          para empresas que buscam tecnologia e qualidade.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Badge
            variant="default"
            className="flex items-center gap-2 px-4 py-2 text-base"
          >
            <Clock className="h-4 w-4" />
            Desde {foundingYear}
          </Badge>
          <Badge
            variant="outline"
            className="flex items-center gap-2 px-4 py-2 text-base"
          >
            <Globe className="h-4 w-4" />
            Atuação Nacional
          </Badge>
          <Badge
            variant="outline"
            className="flex items-center gap-2 px-4 py-2 text-base"
          >
            <Building2 className="h-4 w-4" />
            B2B/B2C - Atacado e Varejo
          </Badge>
        </div>
      </div>

      {/* Nossa História */}
      <section className="mb-16">
        <Card className="border-primary/20 from-primary/5 bg-gradient-to-br to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-3xl">
              <Clock className="text-primary h-8 w-8" />
              Nossa História
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none">
            <div className="grid items-center gap-8 lg:grid-cols-2">
              <div>
                <h3 className="text-primary mb-4 text-xl font-semibold">
                  O Início de Tudo
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  <strong>
                    &ldquo;Qual a melhor forma de negociar produtos de
                    tecnologia para oferecer os melhores preços?&rdquo;
                  </strong>
                  A busca por essa resposta foi o que motivou o empresário{" "}
                  <strong>Wellington de Freitas</strong> a criar{" "}
                  {publicEnvs.NEXT_PUBLIC_COMPANY_NAME}
                  em <strong>1994</strong>.
                </p>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Vendo uma oportunidade significativa na emergente indústria de
                  computadores pessoais, lançou seu próprio negócio com uma
                  filosofia clara:{" "}
                  <strong>
                    excelência em atendimento e assistência técnica são tão
                    importantes quanto preço baixo
                  </strong>
                  .
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Usando suas próprias economias, conseguiu realizar grandes
                  negociações no mercado regional, depois no mercado nacional,
                  dando os primeiros passos em uma jornada de crescimento e
                  inovação sem precedentes.
                </p>
              </div>
              <div className="rounded-lg border bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                <h4 className="text-foreground mb-4 text-center font-semibold">
                  Filosofia Empresarial
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Star className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
                    <span className="text-foreground text-sm">
                      Excelência em atendimento
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                    <span className="text-foreground text-sm">
                      Assistência técnica especializada
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-green-500 dark:text-green-400" />
                    <span className="text-foreground text-sm">
                      Preços competitivos
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Handshake className="text-primary h-5 w-5" />
                    <span className="text-foreground text-sm">
                      Relacionamentos de longo prazo
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Timeline */}
      <section className="mb-16">
        <h2 className="mb-12 flex items-center justify-center gap-3 text-center text-3xl font-bold">
          <Clock className="text-primary h-8 w-8" />
          Linha do Tempo - {publicEnvs.NEXT_PUBLIC_COMPANY_NAME}
        </h2>

        <div className="relative">
          {/* Linha vertical */}
          <div className="from-primary to-primary/30 absolute left-1/2 h-full w-1 -translate-x-1/2 transform bg-gradient-to-b"></div>

          <div className="space-y-12">
            {[
              {
                year: "1994",
                title: `Nasce a ${publicEnvs.NEXT_PUBLIC_COMPANY_NAME}`,
                description:
                  "Início das atividades comercializando produtos de informática e eletrônicos, atuando no setor atacadista em Ribeirão Preto e região.",
                icon: <Building2 className="h-6 w-6" />,
                position: "left",
              },
              {
                year: "2000",
                title: "Expansão Regional",
                description:
                  "Consolidação da presença no mercado regional e início das operações para outros estados.",
                icon: <Globe className="h-6 w-6" />,
                position: "right",
              },
              {
                year: "2003",
                title: "Inovação em Serviços",
                description:
                  "Criação de departamento de soluções especializadas e investimentos em tecnologia própria.",
                icon: <Zap className="h-6 w-6" />,
                position: "left",
              },
              {
                year: "2009",
                title: "Múltiplos Segmentos",
                description:
                  "Expansão para múltiplos segmentos de mercado, diversificando o portfólio de produtos e serviços.",
                icon: <TrendingUp className="h-6 w-6" />,
                position: "right",
              },
              {
                year: "2010",
                title: "Departamento de TI",
                description:
                  "Criação do próprio departamento de tecnologia, desenvolvendo soluções exclusivas.",
                icon: <Zap className="h-6 w-6" />,
                position: "left",
              },
              {
                year: "2012",
                title: "Era Digital",
                description:
                  "Início das atividades online utilizando tecnologia própria, revolucionando o atendimento B2B e B2C.",
                icon: <Globe className="h-6 w-6" />,
                position: "right",
              },
              {
                year: "2024",
                title: `${publicEnvs.NEXT_PUBLIC_COMPANY_NAME} B2B/B2C`,
                description:
                  "Lançamento da plataforma especializada em vendas no atacado e varejo, atendendo tanto empresas quanto consumidores finais nos segmentos B2B e B2C.",
                icon: <Star className="h-6 w-6" />,
                position: "left",
              },
            ].map((item) => (
              <div
                key={item.year}
                className={`flex items-center ${item.position === "left" ? "lg:flex-row" : "lg:flex-row-reverse"}`}
              >
                <div
                  className={`lg:w-1/2 ${item.position === "left" ? "lg:pr-8" : "lg:pl-8"}`}
                >
                  <Card className="transition-shadow hover:shadow-lg">
                    <CardContent className="pt-6">
                      <div className="mb-3 flex items-center gap-3">
                        <div className="bg-primary/10 text-primary rounded-full p-2">
                          {item.icon}
                        </div>
                        <Badge
                          variant="outline"
                          className="text-base font-bold"
                        >
                          {item.year}
                        </Badge>
                      </div>
                      <h3 className="mb-2 text-lg font-semibold">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Círculo na linha do tempo */}
                <div className="bg-primary relative z-10 flex h-4 w-4 items-center justify-center rounded-full border-4 border-white shadow-lg"></div>

                <div className="lg:w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Missão, Visão e Valores */}
      <section className="mb-16">
        <h2 className="mb-12 text-center text-3xl font-bold">Nossos Pilares</h2>

        <div className="grid gap-8 md:grid-cols-3">
          <Card className="text-center transition-shadow hover:shadow-lg">
            <CardHeader>
              <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <Target className="text-primary h-8 w-8" />
              </div>
              <CardTitle className="text-xl">Missão</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Entregar produtos e serviços confiáveis que facilitem o
                dia-a-dia das empresas, garantindo atendimento dedicado, preços
                competitivos e soluções tecnológicas inovadoras.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center transition-shadow hover:shadow-lg">
            <CardHeader>
              <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <Award className="text-primary h-8 w-8" />
              </div>
              <CardTitle className="text-xl">Visão</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Ser reconhecida como a principal distribuidora atacadista e
                varejista do Brasil, referência em qualidade, inovação e
                relacionamento duradouro com nossos parceiros comerciais e
                clientes.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center transition-shadow hover:shadow-lg">
            <CardHeader>
              <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <Heart className="text-primary h-8 w-8" />
              </div>
              <CardTitle className="text-xl">Valores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="bg-primary h-2 w-2 rounded-full"></div>
                  <span>Transparência e ética</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-primary h-2 w-2 rounded-full"></div>
                  <span>Excelência no atendimento</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-primary h-2 w-2 rounded-full"></div>
                  <span>Inovação constante</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-primary h-2 w-2 rounded-full"></div>
                  <span>Relacionamentos duradouros</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-primary h-2 w-2 rounded-full"></div>
                  <span>Responsabilidade social</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="mb-16">
        <h2 className="mb-12 text-center text-3xl font-bold">
          Nossos Diferenciais
        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="text-center transition-all hover:-translate-y-1 hover:shadow-lg">
            <CardContent className="pt-6">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="mb-2 font-semibold">Atendimento Especializado</h3>
              <p className="text-muted-foreground text-sm">
                Equipe técnica qualificada para atender suas necessidades
                específicas
              </p>
            </CardContent>
          </Card>

          <Card className="text-center transition-all hover:-translate-y-1 hover:shadow-lg">
            <CardContent className="pt-6">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="mb-2 font-semibold">Preços Competitivos</h3>
              <p className="text-muted-foreground text-sm">
                Melhores condições do mercado para compras em grande volume
              </p>
            </CardContent>
          </Card>

          <Card className="text-center transition-all hover:-translate-y-1 hover:shadow-lg">
            <CardContent className="pt-6">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                <Truck className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="mb-2 font-semibold">Logística Eficiente</h3>
              <p className="text-muted-foreground text-sm">
                Entrega rápida e segura para todo o território nacional
              </p>
            </CardContent>
          </Card>

          <Card className="text-center transition-all hover:-translate-y-1 hover:shadow-lg">
            <CardContent className="pt-6">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
                <Shield className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="mb-2 font-semibold">Segurança Total</h3>
              <p className="text-muted-foreground text-sm">
                Processos seguros e conformidade fiscal garantida
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Compromisso */}
      <section className="mb-16">
        <Card className="from-primary/10 to-primary/5 border-primary/20 bg-gradient-to-r">
          <CardContent className="pt-8">
            <div className="text-center">
              <h2 className="mb-6 flex items-center justify-center gap-3 text-3xl font-bold">
                <Handshake className="text-primary h-8 w-8" />
                Nosso Compromisso
              </h2>
              <p className="text-muted-foreground mx-auto mb-8 max-w-4xl text-lg leading-relaxed">
                Antes mesmo do primeiro cliente, a{" "}
                {publicEnvs.NEXT_PUBLIC_COMPANY_NAME} já tinha como meta
                oferecer o melhor serviço e construir relacionamentos de longo
                prazo. Essa estratégia provou ser muito bem-sucedida e continua
                sendo um componente chave em nossa missão.
              </p>

              <div className="mt-8 grid gap-6 md:grid-cols-3">
                <div className="text-center">
                  <div className="text-primary mb-2 text-2xl font-bold">
                    {yearsInMarket}+
                  </div>
                  <div className="text-muted-foreground text-sm">
                    Anos de Experiência
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-primary mb-2 text-2xl font-bold">
                    10,000+
                  </div>
                  <div className="text-muted-foreground text-sm">
                    Clientes Atendidos
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-primary mb-2 text-2xl font-bold">
                    50,000+
                  </div>
                  <div className="text-muted-foreground text-sm">
                    Produtos Disponíveis
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* O Futuro */}
      <section className="mb-16">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-3xl">
              <Globe className="text-primary h-8 w-8" />O Futuro
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none">
            <p className="text-muted-foreground leading-relaxed">
              A tecnologia evolui rapidamente, e é inevitável que ela continue
              influenciando nossa forma de trabalhar, de nos relacionarmos e de
              gerirmos nossas vidas. Estar em sintonia com essa evolução e
              disponibilizar o melhor em produtos e serviços é o compromisso da{" "}
              <strong>{publicEnvs.NEXT_PUBLIC_COMPANY_NAME}</strong>.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Nos últimos anos, realizamos grandes investimentos em gestão de
              produtos, relacionamento com clientes e desenvolvimento de
              tecnologias exclusivas. Nosso objetivo é oferecer essas inovações
              ao mercado atacadista e varejista, sempre mantendo nossa tradição
              de excelência e preços competitivos.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Call to Action */}
      <section className="text-center">
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="pt-8">
            <h2 className="mb-4 text-3xl font-bold">Quer Saber Mais?</h2>
            <p className="mb-8 text-lg opacity-90">
              Entre em contato conosco e descubra como podemos ajudar sua
              empresa a crescer com as melhores soluções do mercado atacadista e
              varejista.
            </p>
            <div className="grid gap-6 text-center md:grid-cols-3">
              <div>
                <h3 className="mb-2 font-semibold">Telefone</h3>
                <p className="opacity-90">
                  {publicEnvs.NEXT_PUBLIC_COMPANY_PHONE}
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold">WhatsApp</h3>
                <p className="opacity-90">
                  {publicEnvs.NEXT_PUBLIC_COMPANY_WHATSAPP}
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold">E-mail</h3>
                <p className="opacity-90">
                  {publicEnvs.NEXT_PUBLIC_COMPANY_EMAIL}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
