import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  PackageCheck,
  ShieldCheck,
  TimerReset,
  UserRound,
} from "lucide-react";
import { connection } from "next/server";

import { SiteHeaderWithBreadcrumb } from "@/components/dashboard/header/site-header-with-breadcrumb";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { createLogger } from "@/core/logger";
import { getAuthContext } from "@/server/auth-context";
import {
  type PhysicalProductWarrantyEntity,
  physicalProductServiceApi,
} from "@/services/api-main/physical_product";
import { formatCurrency, parseMonetaryValue } from "@/utils/common-utils";

const logger = createLogger("lacre-warranty-page");

type LacrePageProps = {
  searchParams: Promise<{
    lacreId?: string;
  }>;
};

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

function parseLacreId(value: string | undefined): number | null {
  const normalized = value?.trim();
  if (!normalized || !/^\d+$/.test(normalized)) return null;

  const lacreId = Number(normalized);
  return Number.isSafeInteger(lacreId) && lacreId > 0 ? lacreId : null;
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "Não informado";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Não informado";

  return dateFormatter.format(date);
}

function getDaysUntil(value: string | null | undefined): number | null {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  return Math.ceil((date.getTime() - today.getTime()) / 86_400_000);
}

function getWarrantyStatus(warranty: PhysicalProductWarrantyEntity) {
  const status = warranty.STATUS_GARANTIA?.trim() || "Status indisponível";
  const daysRemaining = getDaysUntil(warranty.GARANTIA_LIMITE);
  const isActive =
    status.toLocaleUpperCase("pt-BR").includes("EM GARANTIA") ||
    (daysRemaining !== null && daysRemaining >= 0);

  if (isActive) {
    return {
      icon: CheckCircle2,
      badgeVariant: "default" as const,
      label: status,
      tone: "border-emerald-200/70 bg-emerald-50 text-emerald-950 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-100",
      helper:
        daysRemaining === null
          ? "Cobertura válida conforme as informações retornadas."
          : daysRemaining === 0
            ? "A cobertura termina hoje."
            : `Restam ${daysRemaining} dia${daysRemaining === 1 ? "" : "s"} de cobertura.`,
    };
  }

  return {
    icon: AlertCircle,
    badgeVariant: "secondary" as const,
    label: status,
    tone: "border-amber-200/70 bg-amber-50 text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100",
    helper:
      daysRemaining === null
        ? "Confira os dados do pedido para mais detalhes."
        : `Cobertura encerrada há ${Math.abs(daysRemaining)} dia${Math.abs(daysRemaining) === 1 ? "" : "s"}.`,
  };
}

function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="min-w-0 rounded-lg border border-border/60 bg-background/55 p-3">
      <dt className="text-xs font-medium uppercase text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 break-words text-sm font-semibold text-foreground">
        {value || "Não informado"}
      </dd>
    </div>
  );
}

function EmptyState({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: typeof ShieldCheck;
}) {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-3xl items-center justify-center px-4 py-8 lg:px-6">
      <div className="flex w-full flex-col items-center rounded-3xl border border-dashed border-border/70 bg-card/70 px-6 py-12 text-center shadow-sm">
        <div className="mb-4 flex size-14 items-center justify-center rounded-full border border-border/70 bg-background text-muted-foreground shadow-sm">
          <Icon className="size-7" aria-hidden="true" />
        </div>
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

function WarrantyDetails({
  lacreId,
  warranty,
}: {
  lacreId: number;
  warranty: PhysicalProductWarrantyEntity;
}) {
  const status = getWarrantyStatus(warranty);
  const StatusIcon = status.icon;
  const warrantyDays = warranty.TEMPODEGARANTIA_DIA ?? 0;

  return (
    <main className="mx-auto flex w-full max-w-350 flex-1 flex-col gap-5 p-4 md:gap-6 md:p-6">
      <section className="rounded-3xl border border-border/60 bg-card/80 p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge variant={status.badgeVariant}>{status.label}</Badge>
              <Badge variant="outline">Lacre #{lacreId}</Badge>
              {warranty.STATUS_FINANCEIRO && (
                <Badge variant="secondary">{warranty.STATUS_FINANCEIRO}</Badge>
              )}
            </div>
            <h1 className="text-2xl font-semibold leading-tight text-foreground md:text-3xl">
              {warranty.PRODUTO || `Produto físico #${lacreId}`}
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              Dados da garantia vinculados ao produto comprado por{" "}
              <span className="font-medium text-foreground">
                {warranty.CLIENTE || "cliente identificado"}
              </span>
              .
            </p>
          </div>

          <div
            className={`flex min-w-0 gap-3 rounded-2xl border p-4 ${status.tone}`}
          >
            <StatusIcon className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold">Situação da cobertura</p>
              <p className="mt-1 text-sm leading-5">{status.helper}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="rounded-3xl border-border/60 bg-card/70 shadow-sm">
          <CardHeader className="gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl border border-border/60 bg-background text-emerald-700 dark:text-emerald-300">
              <ShieldCheck className="size-5" aria-hidden="true" />
            </div>
            <div>
              <CardTitle>Garantia até</CardTitle>
              <CardDescription>
                {formatDate(warranty.GARANTIA_LIMITE)}
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

        <Card className="rounded-3xl border-border/60 bg-card/70 shadow-sm">
          <CardHeader className="gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl border border-border/60 bg-background text-sky-700 dark:text-sky-300">
              <CalendarDays className="size-5" aria-hidden="true" />
            </div>
            <div>
              <CardTitle>Retirada</CardTitle>
              <CardDescription>
                {formatDate(warranty.DT_RETIRADA)}
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

        <Card className="rounded-3xl border-border/60 bg-card/70 shadow-sm">
          <CardHeader className="gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl border border-border/60 bg-background text-violet-700 dark:text-violet-300">
              <TimerReset className="size-5" aria-hidden="true" />
            </div>
            <div>
              <CardTitle>Prazo contratado</CardTitle>
              <CardDescription>
                {warrantyDays > 0
                  ? `${warrantyDays} dia${warrantyDays === 1 ? "" : "s"}`
                  : "Conforme política do produto"}
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="rounded-3xl border-border/60 bg-card/75 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <PackageCheck className="size-5 text-muted-foreground" />
              <CardTitle>Produto</CardTitle>
            </div>
            <CardDescription>
              Identificação do item físico coberto pela garantia.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <InfoItem label="ID da garantia" value={warranty.GARANTIA_ID} />
              <InfoItem label="Etiqueta" value={warranty.ETIQUETA} />
              <InfoItem label="Tipo" value={warranty.TIPO} />
              <InfoItem label="Marca" value={warranty.MARCA} />
              <InfoItem label="Número de série" value={warranty.N_SERIE} />
              <InfoItem label="Código de barras" value={warranty.COD_BARRAS} />
              <InfoItem label="Localização" value={warranty.LOCATION} />
              <InfoItem
                label="Valor da venda"
                value={formatCurrency(parseMonetaryValue(warranty.VL_VENDA))}
              />
            </dl>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-border/60 bg-card/75 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <ClipboardList className="size-5 text-muted-foreground" />
              <CardTitle>Pedido</CardTitle>
            </div>
            <CardDescription>
              Compra que originou a cobertura deste produto.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-3">
              <InfoItem label="Pedido" value={`#${warranty.ID_PEDIDO}`} />
              <InfoItem label="Movimento" value={`#${warranty.ID_MOVIMENTO}`} />
              <InfoItem
                label="Data do pedido"
                value={formatDate(warranty.DATA_PEDIDO)}
              />
              <InfoItem
                label="Status do pedido"
                value={warranty.STATUS_PEDIDO}
              />
              <InfoItem
                label="Status financeiro"
                value={warranty.STATUS_FINANCEIRO}
              />
            </dl>
          </CardContent>
        </Card>
      </section>

      <Card className="rounded-3xl border-border/60 bg-card/75 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <UserRound className="size-5 text-muted-foreground" />
            <CardTitle>Cliente e atendimento</CardTitle>
          </div>
          <CardDescription>
            Dados relacionados à conta e ao vendedor responsável pela compra.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <InfoItem label="Cliente" value={warranty.CLIENTE} />
            <InfoItem label="Conta" value={warranty.ACCOUNT_TIPO} />
            <InfoItem label="Status da conta" value={warranty.ACCOUNT_STATUS} />
            <InfoItem label="Vendedor" value={warranty.VENDEDOR} />
          </dl>

          <Separator className="my-5" />

          <p className="text-sm leading-6 text-muted-foreground">
            Em caso de solicitação de troca, conserto ou devolução, apresente o
            lacre e os dados do pedido para agilizar o atendimento.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

export default async function LacrePage({ searchParams }: LacrePageProps) {
  await connection();

  const params = await searchParams;
  const lacreId = parseLacreId(params.lacreId);
  const { apiContext } = await getAuthContext();

  let warranty: PhysicalProductWarrantyEntity | null = null;

  if (lacreId && apiContext.pe_person_id > 0) {
    try {
      const response =
        await physicalProductServiceApi.findWarrantyByPhysicalIdAndCustomer({
          pe_customer_id: apiContext.pe_person_id,
          pe_physical_id: lacreId,
          pe_user_id: apiContext.pe_user_id,
          pe_user_name: apiContext.pe_user_name,
          pe_user_role: apiContext.pe_user_role,
          pe_person_id: apiContext.pe_person_id,
        });

      warranty =
        physicalProductServiceApi.extractWarrantyByPhysicalIdAndCustomer(
          response,
        );
    } catch (error) {
      logger.error(`Erro ao buscar garantia do lacre ${lacreId}:`, error);
    }
  }

  return (
    <>
      <SiteHeaderWithBreadcrumb
        title="Garantia do Produto"
        breadcrumbItems={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Garantia do Produto", isActive: true },
        ]}
      />

      {!lacreId ? (
        <EmptyState
          icon={ShieldCheck}
          title="Lacre não informado"
          description="Acesse esta página pelo QR Code do produto ou por um link com o parâmetro lacreId válido."
        />
      ) : !warranty ? (
        <EmptyState
          icon={AlertCircle}
          title="Garantia não encontrada"
          description="Não encontramos uma garantia para este lacre vinculada ao seu cadastro. Confira o QR Code lido ou fale com o atendimento."
        />
      ) : (
        <WarrantyDetails lacreId={lacreId} warranty={warranty} />
      )}
    </>
  );
}
