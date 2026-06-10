import {
  AlertTriangle,
  ArrowLeftRight,
  Building2,
  CheckCircle,
  Clock,
  CreditCard,
  FileText,
  Mail,
  Package,
  Phone,
  RefreshCw,
  Settings,
  Shield,
  Truck,
  XCircle,
} from "lucide-react";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { companyInfo } from "@/data/info-company";
import { getCurrentDatePtBr, getCurrentYear } from "@/lib/current-time";

export const metadata: Metadata = {
  title: `Política de Entrega, Troca e Devolução - ${companyInfo.name}`,
  description: `Política completa de entrega, troca e devolução de produtos da ${companyInfo.name}. Conheça prazos, condições e procedimentos para vendas no atacado e varejo B2B/B2C.`,
};

export default async function ReturnPage() {
  const [currentDate, currentYear] = await Promise.all([
    getCurrentDatePtBr(),
    getCurrentYear(),
  ]);
  const companyName = companyInfo.name;
  const companyEmail = companyInfo.email;
  const companyPhone = companyInfo.phone;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Header Principal */}
      <div className="mb-8 text-center sm:mb-12">
        <div className="mb-4 flex flex-col items-center justify-center gap-2 sm:mb-6 sm:flex-row">
          <ArrowLeftRight className="text-primary h-6 w-6 sm:h-8 sm:w-8" />
          <h1 className="from-primary to-primary/60 bg-gradient-to-r bg-clip-text text-center text-2xl font-bold text-transparent sm:text-4xl">
            Política de Entrega, Troca e Devolução
          </h1>
        </div>
        <p className="text-muted-foreground mx-auto max-w-3xl px-4 text-lg leading-relaxed sm:text-xl">
          Sua satisfação é muito importante para nós. Conheça nossos
          procedimentos e prazos para entrega, troca e devolução de produtos no
          segmento atacadista e varejista B2B/B2C.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:mt-6 sm:gap-4">
          <Badge variant="outline" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span className="text-xs sm:text-sm">
              Comércio B2B/B2C - Atacado e Varejo
            </span>
          </Badge>
          <Badge variant="outline" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="text-xs sm:text-sm">
              Atualizado em {currentDate}
            </span>
          </Badge>
          <Badge variant="outline" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span className="text-xs sm:text-sm">Política Completa</span>
          </Badge>
        </div>
      </div>

      {/* Orientação Inicial */}
      <Card className="mb-6 border-blue-200 bg-blue-50/50 sm:mb-8 dark:bg-blue-950/20">
        <CardContent className="pt-4 sm:pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
            <div>
              <h3 className="mb-2 font-semibold text-blue-800 dark:text-blue-200">
                Orientação Importante
              </h3>
              <p className="text-sm leading-relaxed text-blue-700 dark:text-blue-300">
                <strong>Antes de realizar a compra</strong>, verifique as
                características do produto e suas especificações (cor, dimensão,
                compatibilidade, voltagem, etc.) para minimizar transtornos. Em
                caso de dúvidas, entre em contato com nossa Central de
                Atendimento.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-4 lg:gap-8">
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
                  href="#general-conditions"
                  className="hover:text-primary block py-1 text-sm transition-colors"
                >
                  1. Condições Gerais
                </a>
                <a
                  href="#withdrawal"
                  className="hover:text-primary block py-1 text-sm transition-colors"
                >
                  2. Desistência/Arrependimento
                </a>
                <a
                  href="#defective-products"
                  className="hover:text-primary block py-1 text-sm transition-colors"
                >
                  3. Produtos com Defeito
                </a>
                <a
                  href="#damaged-products"
                  className="hover:text-primary block py-1 text-sm transition-colors"
                >
                  4. Produtos Avariados
                </a>
                <a
                  href="#delivery-policy"
                  className="hover:text-primary block py-1 text-sm transition-colors"
                >
                  5. Política de Entrega
                </a>
                <a
                  href="#payment-refund"
                  className="hover:text-primary block py-1 text-sm transition-colors"
                >
                  6. Restituição de Valores
                </a>
                <a
                  href="#procedures"
                  className="hover:text-primary block py-1 text-sm transition-colors"
                >
                  7. Procedimentos
                </a>
                <a
                  href="#contact"
                  className="hover:text-primary block py-1 text-sm transition-colors"
                >
                  8. Central de Atendimento
                </a>
              </nav>
            </CardContent>
          </Card>
        </aside>

        {/* Conteúdo Principal */}
        <div className="space-y-6 sm:space-y-8 lg:col-span-3">
          {/* 1. Condições Gerais */}
          <Card id="general-conditions">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Clock className="text-primary h-5 w-5" />
                1. Condições Gerais
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate dark:prose-invert max-w-none">
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/20">
                <h4 className="mb-2 flex items-center gap-2 font-semibold text-red-800 dark:text-red-200">
                  <Clock className="h-4 w-4" />
                  Prazo Fundamental
                </h4>
                <p className="text-sm text-red-700 dark:text-red-300">
                  O prazo para trocas e devoluções é de{" "}
                  <strong>7 (sete) dias corridos</strong>, a contar da data da
                  entrega do produto.
                </p>
              </div>

              <div className="grid gap-4">
                <div className="border-l-4 border-red-500 pl-4">
                  <h4 className="mb-2 font-semibold text-red-800 dark:text-red-200">
                    🚫 IMPORTANTE
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    <strong>NÃO ACEITAMOS</strong> trocas posteriores a esse
                    prazo e nem trocas por outros produtos.
                  </p>
                </div>

                <div className="border-l-4 border-amber-500 pl-4">
                  <h4 className="mb-2 font-semibold text-amber-800 dark:text-amber-200">
                    ⚠️ Responsabilidades
                  </h4>
                  <ul className="text-muted-foreground space-y-1 text-sm">
                    <li>
                      • Todas as despesas de transporte são de responsabilidade
                      do cliente
                    </li>
                    <li>
                      • Não nos responsabilizamos por itens anexos que não
                      pertençam ao produto
                    </li>
                    <li>
                      • Produtos devolvidos sem autorização serão reenviados sem
                      consulta
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/20">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>📞 Antes de efetuar devolução:</strong> Entre em
                  contato com nossa Central de Atendimento para obter
                  autorização e instruções específicas.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 2. Desistência/Arrependimento */}
          <Card id="withdrawal">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <RefreshCw className="h-5 w-5 text-blue-600" />
                2. Desistência/Arrependimento
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Garantimos durante o prazo improrrogável de{" "}
                <strong>7 dias</strong> contados do recebimento, a devolução do
                produto caso não atenda às expectativas.
              </p>

              <div className="mb-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/20">
                  <h4 className="mb-3 font-semibold text-green-800 dark:text-green-200">
                    ✅ Opções Disponíveis
                  </h4>
                  <ul className="space-y-2 text-sm text-green-700 dark:text-green-300">
                    <li>• Crédito em produtos de igual valor</li>
                    <li>• Restituição dos valores pagos (exceto frete)</li>
                    <li>• Troca por produto disponível em estoque</li>
                  </ul>
                </div>
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/20">
                  <h4 className="mb-3 font-semibold text-amber-800 dark:text-amber-200">
                    ⚠️ Condições Obrigatórias
                  </h4>
                  <ul className="space-y-2 text-sm text-amber-700 dark:text-amber-300">
                    <li>• Embalagem original sem violação</li>
                    <li>• Sem indícios de uso</li>
                    <li>• Manual e acessórios inclusos</li>
                    <li>• Lacre do fabricante intacto</li>
                  </ul>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-950/50">
                <h4 className="mb-3 font-semibold">
                  📋 Documentos Necessários
                </h4>
                <div className="grid gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Código de autorização (fornecido pela Central)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Nome completo do cliente</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Endereço completo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Número do pedido</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Descrição detalhada do produto</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. Produtos com Defeito */}
          <Card id="defective-products">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Settings className="h-5 w-5 text-orange-600" />
                3. Produtos com Defeito
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Para produtos com defeito de fabricação dentro do prazo de
                garantia, primeiro verifique as instruções do manual e busque
                atendimento junto ao fabricante.
              </p>

              <div className="grid gap-4">
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/20">
                  <h4 className="mb-3 font-semibold text-blue-800 dark:text-blue-200">
                    🔧 Procedimento Recomendado
                  </h4>
                  <ol className="list-inside list-decimal space-y-2 text-sm text-blue-700 dark:text-blue-300">
                    <li>Verifique o manual e certificado de garantia</li>
                    <li>
                      Entre em contato com a Central de Atendimento do
                      fabricante
                    </li>
                    <li>
                      Procure assistências técnicas indicadas pelo fabricante
                    </li>
                    <li>
                      Se não resolvido, contate nossa Central de Atendimento
                    </li>
                  </ol>
                </div>

                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-950/50">
                  <h4 className="mb-3 font-semibold">
                    📋 Critérios para Garantia
                  </h4>
                  <div className="grid gap-3 text-sm md:grid-cols-2">
                    <div>
                      <h5 className="mb-2 font-semibold text-green-700 dark:text-green-300">
                        ✅ Aceito
                      </h5>
                      <ul className="text-muted-foreground space-y-1">
                        <li>• Dentro do prazo de garantia (90 dias)</li>
                        <li>• Embalagem original preservada</li>
                        <li>• Manual e acessórios inclusos</li>
                        <li>• Cupom fiscal anexado</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="mb-2 font-semibold text-red-700 dark:text-red-300">
                        ❌ Não Aceito
                      </h5>
                      <ul className="text-muted-foreground space-y-1">
                        <li>• Problemas por mau uso</li>
                        <li>• Má conservação do produto</li>
                        <li>• Danos por fenômenos naturais</li>
                        <li>• Fora do prazo de garantia</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/20">
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  <strong>⏱️ Prazo de Resolução:</strong> Reservamo-nos o direito
                  de solucionar problemas de fabricação em até 30 dias corridos,
                  conforme Código de Defesa do Consumidor.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 4. Produtos Avariados */}
          <Card id="damaged-products">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <XCircle className="h-5 w-5 text-red-600" />
                4. Produtos Avariados
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate dark:prose-invert max-w-none">
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/20">
                <h4 className="mb-2 font-semibold text-red-800 dark:text-red-200">
                  🚨 Ação Imediata
                </h4>
                <p className="text-sm text-red-700 dark:text-red-300">
                  Ao receber o produto e perceber avaria,{" "}
                  <strong>RECUSE A ENTREGA</strong> e entre em contato
                  imediatamente com nossa Central de Atendimento.
                </p>
              </div>

              <div className="grid gap-4">
                <div className="border-l-4 border-red-500 pl-4">
                  <h4 className="mb-2 font-semibold">⏰ Prazos Críticos</h4>
                  <ul className="text-muted-foreground space-y-1 text-sm">
                    <li>
                      • <strong>Na entrega:</strong> Recuse imediatamente
                    </li>
                    <li>
                      • <strong>Após recebimento:</strong> 24 horas para contato
                    </li>
                    <li>
                      • <strong>Fora do prazo:</strong> Solicitações não serão
                      aceitas
                    </li>
                  </ul>
                </div>

                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="mb-2 font-semibold">
                    🔍 Situações que Justificam Recusa
                  </h4>
                  <ul className="text-muted-foreground space-y-1 text-sm">
                    <li>• Produto em desacordo com o pedido</li>
                    <li>• Embalagem violada ou danificada</li>
                    <li>• Sinais evidentes de avarias</li>
                    <li>• Produto diferente do solicitado</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 5. Política de Entrega */}
          <Card id="delivery-policy">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Truck className="h-5 w-5 text-blue-600" />
                5. Política de Entrega
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate dark:prose-invert max-w-none">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/20">
                  <h4 className="mb-3 font-semibold text-blue-800 dark:text-blue-200">
                    🚚 Entrega Nacional
                  </h4>
                  <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                    <li>• Cobertura para todo Brasil</li>
                    <li>• Parcerias com transportadoras confiáveis</li>
                    <li>• Rastreamento completo do pedido</li>
                    <li>• Seguro de transporte incluso</li>
                  </ul>
                </div>
                <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/20">
                  <h4 className="mb-3 font-semibold text-green-800 dark:text-green-200">
                    📦 Condições B2B/B2C
                  </h4>
                  <ul className="space-y-2 text-sm text-green-700 dark:text-green-300">
                    <li>• Frete diferenciado para atacado e varejo</li>
                    <li>• Prazos otimizados por região</li>
                    <li>• Entregas programadas disponíveis</li>
                    <li>
                      • Nota fiscal adequada para revenda e consumidor final
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-950/50">
                <h4 className="mb-3 font-semibold">
                  📍 Prazos Estimados de Entrega
                </h4>
                <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                  <div className="text-center">
                    <div className="text-primary font-semibold">Sudeste</div>
                    <div className="text-muted-foreground">2-4 dias úteis</div>
                  </div>
                  <div className="text-center">
                    <div className="text-primary font-semibold">Sul</div>
                    <div className="text-muted-foreground">3-5 dias úteis</div>
                  </div>
                  <div className="text-center">
                    <div className="text-primary font-semibold">
                      Centro-Oeste
                    </div>
                    <div className="text-muted-foreground">4-6 dias úteis</div>
                  </div>
                  <div className="text-center">
                    <div className="text-primary font-semibold">
                      Norte/Nordeste
                    </div>
                    <div className="text-muted-foreground">5-8 dias úteis</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 6. Restituição de Valores */}
          <Card id="payment-refund">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <CreditCard className="h-5 w-5 text-green-600" />
                6. Restituição de Valores
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-muted-foreground mb-4 leading-relaxed">
                A restituição é efetuada conforme a forma de pagamento original,
                com prazos específicos para cada modalidade.
              </p>

              <div className="grid gap-4">
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/20">
                  <h4 className="mb-3 flex items-center gap-2 font-semibold text-blue-800 dark:text-blue-200">
                    <CreditCard className="h-4 w-4" />
                    Cartão de Crédito
                  </h4>
                  <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                    <li>• Solicitamos cancelamento junto à administradora</li>
                    <li>• Estorno automático na próxima fatura</li>
                    <li>• Prazo depende da administradora e banco emissor</li>
                    <li>• Acompanhamento via fatura do cartão</li>
                  </ul>
                </div>

                <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/20">
                  <h4 className="mb-3 flex items-center gap-2 font-semibold text-green-800 dark:text-green-200">
                    <Package className="h-4 w-4" />
                    Boleto Bancário / PIX
                  </h4>
                  <ul className="space-y-2 text-sm text-green-700 dark:text-green-300">
                    <li>• Depósito identificado em conta corrente</li>
                    <li>• Conta deve ser de titularidade do comprador</li>
                    <li>
                      • Prazo: <strong>10 dias úteis</strong> após recebimento
                    </li>
                    <li>• Sem conta corrente: orientações pela Central</li>
                  </ul>
                </div>
              </div>

              <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/20">
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  <strong>💡 Importante:</strong> Os valores de frete não são
                  restituíveis em casos de desistência ou arrependimento, apenas
                  em casos de defeito ou erro nosso.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 7. Procedimentos */}
          <Card id="procedures">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Shield className="h-5 w-5 text-purple-600" />
                7. Procedimentos de Análise
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate dark:prose-invert max-w-none">
              <div className="space-y-4">
                <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-950/20">
                  <h4 className="mb-3 font-semibold text-purple-800 dark:text-purple-200">
                    🔍 Processo de Análise
                  </h4>
                  <ol className="list-inside list-decimal space-y-2 text-sm text-purple-700 dark:text-purple-300">
                    <li>
                      Recebimento da solicitação via Central de Atendimento
                    </li>
                    <li>Envio de e-mail com instruções de retorno</li>
                    <li>Análise técnica do produto recebido</li>
                    <li>Verificação de conformidade com critérios</li>
                    <li>Aprovação e processamento da troca/devolução</li>
                  </ol>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/20">
                    <h4 className="mb-3 font-semibold text-green-800 dark:text-green-200">
                      ✅ Se Aprovado
                    </h4>
                    <ul className="space-y-1 text-sm text-green-700 dark:text-green-300">
                      <li>• Envio de produto substituto</li>
                      <li>• Processamento de cancelamento</li>
                      <li>• Restituição de valores</li>
                      <li>• Comunicação por e-mail</li>
                    </ul>
                  </div>
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/20">
                    <h4 className="mb-3 font-semibold text-red-800 dark:text-red-200">
                      ❌ Se Reprovado
                    </h4>
                    <ul className="space-y-1 text-sm text-red-700 dark:text-red-300">
                      <li>• Reenvio do produto ao remetente</li>
                      <li>• Sem consulta prévia</li>
                      <li>• Justificativa por e-mail</li>
                      <li>• Frete por conta do cliente</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 8. Central de Atendimento */}
          <Card id="contact">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Phone className="text-primary h-5 w-5" />
                8. Central de Atendimento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Nossa Central de Atendimento está preparada para auxiliar em
                todos os processos de troca, devolução e esclarecimento de
                dúvidas.
              </p>

              <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                <div>
                  <h4 className="mb-3 flex items-center gap-2 font-semibold">
                    <Phone className="text-primary h-4 w-4" />
                    Telefone
                  </h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>Fixo:</strong> {companyPhone}
                    </p>
                    <p>
                      <strong>WhatsApp:</strong> {companyInfo.whatsapp}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="mb-3 flex items-center gap-2 font-semibold">
                    <Mail className="text-primary h-4 w-4" />
                    E-mail
                  </h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <a
                        href={`mailto:${companyEmail}`}
                        className="text-primary hover:underline"
                      >
                        {companyEmail}
                      </a>
                    </p>
                    <p>Resposta em até 24h úteis</p>
                  </div>
                </div>
                <div>
                  <h4 className="mb-3 flex items-center gap-2 font-semibold">
                    <Clock className="text-primary h-4 w-4" />
                    Horário
                  </h4>
                  <div className="text-muted-foreground space-y-1 text-sm">
                    <p>Segunda a Sexta: 8h às 18h</p>
                    <p>Sábado: 8h às 12h</p>
                  </div>
                </div>
              </div>

              <div className="bg-primary text-primary-foreground mt-6 rounded-lg p-4">
                <h4 className="mb-2 font-semibold">
                  💼 Atendimento Especializado B2B/B2C
                </h4>
                <p className="text-sm opacity-90">
                  Nossa equipe está preparada para atender empresas e
                  consumidores finais com processos específicos para compras
                  corporativas, no varejo, notas fiscais e condições
                  diferenciadas.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Footer da Política */}
          <Card className="bg-slate-50 dark:bg-slate-900/50">
            <CardContent className="pt-4 sm:pt-6">
              <div className="text-center">
                <p className="text-muted-foreground mb-2 text-sm">
                  <strong>
                    Política de Entrega, Troca e Devolução - {companyName}
                  </strong>
                </p>
                <p className="text-muted-foreground text-xs">
                  Copyright © 2011-{currentYear} | Todos os direitos reservados
                </p>
                <p className="text-muted-foreground mt-2 text-xs">
                  Última atualização: {currentDate}
                </p>
                <p className="text-muted-foreground mt-2 text-xs">
                  E-commerce B2B/B2C com atendimento especializado para empresas
                  e consumidores
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
