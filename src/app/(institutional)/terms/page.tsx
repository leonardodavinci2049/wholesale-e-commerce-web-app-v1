import { AlertCircle, Building2, FileText, Scale, Shield } from "lucide-react";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { companyInfo } from "@/data/info-company";
import { getCurrentDatePtBr, getCurrentYear } from "@/lib/current-time";

export const metadata: Metadata = {
  title: `Termos e Condições - ${companyInfo.name}`,
  description: `Termos de uso e condições para vendas no atacado e varejo B2B/B2C da ${companyInfo.name}. Conheça as regras e políticas que regem nossa plataforma de e-commerce atacadista e varejista.`,
};

export default async function TermsPage() {
  const [currentDate, currentYear] = await Promise.all([
    getCurrentDatePtBr(),
    getCurrentYear(),
  ]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      {/* Header Principal */}
      <div className="mb-12 text-center">
        <div className="mb-4 flex items-center justify-center gap-2">
          <Scale className="text-primary h-8 w-8" />
          <h1 className="from-primary to-primary/60 bg-gradient-to-r bg-clip-text text-4xl font-bold text-transparent">
            Termos e Condições
          </h1>
        </div>
        <p className="text-muted-foreground mx-auto max-w-3xl text-xl leading-relaxed">
          Condições de uso da plataforma de e-commerce atacadista e varejista.
          Ao acessar e utilizar nossos serviços, você concorda com os termos
          estabelecidos.
        </p>
        <div className="mt-6 flex items-center justify-center gap-4">
          <Badge variant="outline" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Comércio B2B/B2C - Atacado e Varejo
          </Badge>
          <Badge variant="outline" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Atualizado em {currentDate}
          </Badge>
        </div>
      </div>

      {/* Aviso Importante */}
      <Card className="mb-8 border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/30">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
            <div>
              <h3 className="mb-2 font-semibold text-amber-800 dark:text-amber-200">
                Aviso Importante
              </h3>
              <p className="text-sm leading-relaxed text-amber-700 dark:text-amber-300">
                Ao acessar e usar este website de qualquer forma, o usuário
                concorda com os TERMOS DE USO constantes deste documento. Caso
                contrário, <strong>NÃO DEVERÁ USAR ESTE WEBSITE</strong>. Se
                estiver usando como representante de sua empresa, você confirma
                estar autorizado a aceitar estes termos em nome do seu
                empregador.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-8 lg:grid-cols-4">
        {/* Navegação Lateral */}
        <aside className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4" />
                Navegação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <nav className="space-y-1">
                <a
                  href="#acceptance"
                  className="hover:text-primary block py-1 text-sm transition-colors"
                >
                  1. Aceitação dos Termos
                </a>
                <a
                  href="#definitions"
                  className="hover:text-primary block py-1 text-sm transition-colors"
                >
                  2. Definições
                </a>
                <a
                  href="#usage"
                  className="hover:text-primary block py-1 text-sm transition-colors"
                >
                  3. Uso da Plataforma
                </a>
                <a
                  href="#pricing"
                  className="hover:text-primary block py-1 text-sm transition-colors"
                >
                  4. Política de Preços B2B/B2C
                </a>
                <a
                  href="#orders"
                  className="hover:text-primary block py-1 text-sm transition-colors"
                >
                  5. Pedidos e Disponibilidade
                </a>
                <a
                  href="#information"
                  className="hover:text-primary block py-1 text-sm transition-colors"
                >
                  6. Informações de Produtos
                </a>
                <a
                  href="#privacy"
                  className="hover:text-primary block py-1 text-sm transition-colors"
                >
                  7. Privacidade e Dados
                </a>
                <a
                  href="#liability"
                  className="hover:text-primary block py-1 text-sm transition-colors"
                >
                  8. Limitação de Responsabilidade
                </a>
                <a
                  href="#intellectual"
                  className="hover:text-primary block py-1 text-sm transition-colors"
                >
                  9. Propriedade Intelectual
                </a>
                <a
                  href="#modifications"
                  className="hover:text-primary block py-1 text-sm transition-colors"
                >
                  10. Modificações
                </a>
                <a
                  href="#contact"
                  className="hover:text-primary block py-1 text-sm transition-colors"
                >
                  11. Contato
                </a>
              </nav>
            </CardContent>
          </Card>
        </aside>

        {/* Conteúdo Principal */}
        <div className="space-y-8 lg:col-span-3">
          {/* 1. Aceitação dos Termos */}
          <Card id="acceptance">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Shield className="text-primary h-5 w-5" />
                1. Aceitação dos Termos
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                Os TERMOS DE USO são estabelecidos entre a{" "}
                <strong>{companyInfo.name}</strong> e você, o USUÁRIO.
                Reservamo-nos o direito de, a nosso critério, alterar,
                modificar, atualizar, adicionar ou remover seções destes TERMOS
                DE USO a qualquer momento, sem notificação prévia.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Constitui obrigação do usuário verificar a ocorrência de
                mudanças nestes termos. O uso continuado após a publicação de
                mudanças significará que o usuário aceita as alterações.
              </p>
            </CardContent>
          </Card>

          {/* 2. Definições */}
          <Card id="definitions">
            <CardHeader>
              <CardTitle className="text-xl">2. Definições</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="border-primary/20 border-l-4 pl-4">
                  <h4 className="mb-2 font-semibold">Plataforma B2B/B2C</h4>
                  <p className="text-muted-foreground text-sm">
                    Sistema de e-commerce voltado para vendas no atacado e
                    varejo, atendendo empresas e consumidores finais.
                  </p>
                </div>
                <div className="border-primary/20 border-l-4 pl-4">
                  <h4 className="mb-2 font-semibold">
                    Cliente Atacadista e Varejista
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Empresa, pessoa jurídica ou pessoa física credenciada para
                    realizar compras no atacado ou varejo.
                  </p>
                </div>
                <div className="border-primary/20 border-l-4 pl-4">
                  <h4 className="mb-2 font-semibold">Usuário Autorizado</h4>
                  <p className="text-muted-foreground text-sm">
                    Pessoa física representante de empresa com credenciais
                    válidas de acesso ao sistema.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. Uso da Plataforma */}
          <Card id="usage">
            <CardHeader>
              <CardTitle className="text-xl">3. Uso da Plataforma</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                Esta publicação é fornecida &ldquo;DA MANEIRA COMO SE
                ENCONTRA&rdquo; sem garantias de qualquer espécie. Não assumimos
                responsabilidade por erros ou omissões nesta publicação ou em
                documentos vinculados.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Referências a empresas e produtos, indicações de uso e
                especificações técnicas atendem ao propósito de informar e
                facilitar a pesquisa do usuário. A arquitetura deste website foi
                projetada para dar amplo controle de pesquisa às informações,
                sempre visibilizando PRODUTO, FABRICANTE, MARCA e MODELO para
                comparação global.
              </p>
            </CardContent>
          </Card>

          {/* 4. Política de Preços B2B/B2C */}
          <Card id="pricing">
            <CardHeader>
              <CardTitle className="text-xl">
                4. Política de Preços B2B/B2C
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/30">
                <h4 className="mb-2 font-semibold text-blue-800 dark:text-blue-200">
                  🔐 Acesso Restrito a Preços
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Os preços são exibidos exclusivamente para usuários
                  autenticados e credenciados. Visitantes não logados não têm
                  acesso às informações de preços.
                </p>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Trabalhamos com diferentes categorias de preços baseadas no
                perfil do cliente: Ouro, Prata, Bronze, Atacado, Corporativo e
                Varejo. Os preços podem variar conforme o volume de compra e
                relacionamento comercial.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Todos os preços estão sujeitos a alteração sem aviso prévio.
                Oferecemos as condições comerciais mais competitivas do mercado,
                sempre priorizando relacionamentos de longo prazo.
              </p>
            </CardContent>
          </Card>

          {/* 5. Pedidos e Disponibilidade */}
          <Card id="orders">
            <CardHeader>
              <CardTitle className="text-xl">
                5. Pedidos e Disponibilidade
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                Não temos obrigação de atender a todos os pedidos, podendo
                suspendê-los a qualquer momento por motivos de falta de produto,
                produto fora de linha, produção suspensa, distribuição suspensa,
                valor incorreto, entre outros fatores.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Em caso de cancelamento de pedidos já pagos, sugerimos
                substituição por produtos disponíveis com características
                compatíveis ou devolução do valor pago. Trabalhamos com
                disponibilidade imediata em alguns produtos, sendo o envio
                realizado o mais breve possível após confirmação do pagamento.
              </p>
            </CardContent>
          </Card>

          {/* 6. Informações de Produtos */}
          <Card id="information">
            <CardHeader>
              <CardTitle className="text-xl">
                6. Informações de Produtos
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                Como empresa comercial MULTIMARCAS, não pretendemos abarcar a
                dimensão completa das especificações técnicas de cada produto.
                Existem riscos de erros de digitação, seja da literatura técnica
                primária ou da transcrição para nossas páginas.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Listamos características que entendemos relevantes para
                comparação e pesquisa. Advertimos sobre o risco de decidir sobre
                um produto sem cotejamento das características aqui apresentadas
                com as especificações completas dos fabricantes.
              </p>
              <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30">
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  <strong>Importante:</strong> Em casos particulares, a concisão
                  pode comprometer a compreensão das características de
                  determinados produtos. Entre em contato para informações
                  adicionais quando necessário.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 7. Privacidade e Dados */}
          <Card id="privacy">
            <CardHeader>
              <CardTitle className="text-xl">
                7. Privacidade e Proteção de Dados
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                Quando interagindo com nossa Loja em processo de compra, o
                usuário será solicitado ao preenchimento de cadastro em ambiente
                seguro e protegido por identificação e senha pessoais.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Seus dados cadastrais serão utilizados apenas para processamento
                de suas compras e só poderão ser acessados com sua identificação
                e senha. Os dados de cartão de crédito/débito não são
                requisitados nem acessíveis pelo lojista, sendo informados
                apenas no ambiente seguro do banco ou administradora.
              </p>
              <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/30">
                <p className="text-sm text-green-700 dark:text-green-300">
                  <strong>🔒 Garantia de Segurança:</strong> Os dados do cartão
                  não são armazenados na internet e suas informações não serão
                  fornecidas a terceiros em hipótese alguma.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 8. Limitação de Responsabilidade */}
          <Card id="liability">
            <CardHeader>
              <CardTitle className="text-xl">
                8. Limitação de Responsabilidade
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                O usuário assume todos os riscos referentes à adequabilidade e
                precisão das informações do website. O site pode conter
                informações técnicas inexatas e erros tipográficos.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Isentamo-nos de qualquer responsabilidade por inexatidões, erros
                ou omissões no website. Em nenhuma hipótese seremos responsáveis
                por danos acidentais, especiais, indiretos ou consequentes,
                resultantes do uso das informações disponíveis.
              </p>
            </CardContent>
          </Card>

          {/* 9. Propriedade Intelectual */}
          <Card id="intellectual">
            <CardHeader>
              <CardTitle className="text-xl">
                9. Propriedade Intelectual
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                Todos os materiais contidos neste website constituem propriedade
                da {companyInfo.name}
                ou dos fabricantes referidos através de suas marcas e produtos.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Todas as marcas comerciais e nomes comerciais são propriedades
                de seus respectivos fabricantes e proprietários, protegidos por
                leis internacionais de copyright e propriedade industrial.
              </p>
              <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                <h4 className="text-foreground mb-2 font-semibold">
                  Uso Permitido de Documentos:
                </h4>
                <ul className="text-muted-foreground space-y-1 text-sm">
                  <li>
                    • Visualização, cópia e impressão para uso informativo
                  </li>
                  <li>• Não modificação de materiais e imagens</li>
                  <li>• Não distribuição de imagens separadamente do texto</li>
                  <li>• Manutenção de avisos de direitos autorais</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* 10. Modificações */}
          <Card id="modifications">
            <CardHeader>
              <CardTitle className="text-xl">
                10. Alterações do Website
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p className="leading-relaxed font-semibold text-red-600 uppercase">
                PODEMOS, A QUALQUER MOMENTO E SEM PRÉVIO AVISO, ALTERAR AS
                INFORMAÇÕES DESTE WEBSITE DA MANEIRA QUE MELHOR NOS CONVIER.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Isso inclui especificações técnicas, preços, ofertas de
                produtos, layout, quantidade de produtos expostos por
                fabricante, quantidade de fabricantes e marcas, ou quaisquer
                outras alterações necessárias aos nossos objetivos comerciais e
                técnicos.
              </p>
            </CardContent>
          </Card>

          {/* 11. Informações de Contato */}
          <Card id="contact">
            <CardHeader>
              <CardTitle className="text-xl">
                11. Informações de Contato
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="mb-3 font-semibold">Dados da Empresa</h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Razão Social:</strong> {companyInfo.name}
                    </p>
                    <p>
                      <strong>Telefone:</strong> {companyInfo.phone}
                    </p>
                    <p>
                      <strong>WhatsApp:</strong> {companyInfo.whatsapp}
                    </p>
                    <p>
                      <strong>E-mail:</strong> {companyInfo.email}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="mb-3 font-semibold">Canais de Atendimento</h4>
                  <div className="space-y-2 text-sm">
                    <p>• Dúvidas sobre produtos e especificações</p>
                    <p>• Informações comerciais e orçamentos</p>
                    <p>• Suporte técnico especializado</p>
                    <p>• Atendimento pós-venda</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer dos Termos */}
          <Card className="bg-slate-50 dark:bg-slate-800/50">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-muted-foreground mb-2 text-sm">
                  <strong>
                    Copyright © 2011-{currentYear} | {companyInfo.name}
                  </strong>
                </p>
                <p className="text-muted-foreground text-xs">
                  Todos os direitos reservados. E-commerce desenvolvido para
                  vendas atacadistas e varejistas B2B/B2C.
                </p>
                <p className="text-muted-foreground mt-2 text-xs">
                  Última atualização: {currentDate}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
