import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Info,
  PackageCheck,
  ShieldCheck,
  TimerReset,
  UserRound,
} from "lucide-react";
import { connection } from "next/server";

import { SiteHeaderWithBreadcrumb } from "@/components/dashboard/header/site-header-with-breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const shortDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
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

function formatShortDate(value: string | null | undefined): string {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return shortDateFormatter.format(date);
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
      tone: "border-emerald-200/70 bg-emerald-50 text-emerald-950 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-100",
      barTone:
        "border-emerald-500/30 bg-emerald-500/10 dark:border-emerald-400/30 dark:bg-emerald-400/10",
      iconTone: "text-emerald-600 dark:text-emerald-300",
      helper:
        daysRemaining === null
          ? "Cobertura válida conforme as informações retornadas."
          : daysRemaining === 0
            ? "A cobertura termina hoje."
            : `Restam ${daysRemaining} dia${daysRemaining === 1 ? "" : "s"} de cobertura`,
    };
  }

  return {
    icon: AlertCircle,
    badgeVariant: "secondary" as const,
    label: status,
    tone: "border-amber-200/70 bg-amber-50 text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100",
    barTone:
      "border-amber-500/30 bg-amber-500/10 dark:border-amber-400/30 dark:bg-amber-400/10",
    iconTone: "text-amber-600 dark:text-amber-300",
    helper:
      daysRemaining === null
        ? "Confira os dados do pedido para mais detalhes."
        : `Cobertura encerrada há ${Math.abs(daysRemaining)} dia${Math.abs(daysRemaining) === 1 ? "" : "s"}`,
  };
}

function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5 py-1.5">
      <dt className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="truncate text-sm font-semibold text-foreground">
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
    <div className="mx-auto flex w-full max-w-3xl items-center justify-center px-3 py-6 lg:px-6">
      <div className="flex w-full flex-col items-center rounded-2xl border border-dashed border-border/70 bg-card/70 px-6 py-10 text-center shadow-sm">
        <div className="mb-3 flex size-12 items-center justify-center rounded-full border border-border/70 bg-background text-muted-foreground shadow-sm">
          <Icon className="size-6" aria-hidden="true" />
        </div>
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        <p className="mt-1.5 max-w-xl text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  iconClass,
}: {
  label: string;
  value: string;
  icon: typeof ShieldCheck;
  iconClass: string;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1 rounded-xl border border-border/60 bg-card/70 px-2.5 py-2 shadow-sm">
      <div className="flex items-center justify-between gap-1">
        <span className="truncate text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
          {label}
        </span>
        <Icon className={`size-3.5 shrink-0 ${iconClass}`} aria-hidden="true" />
      </div>
      <p className="truncate text-xs font-bold leading-tight text-foreground md:text-sm">
        {value}
      </p>
    </div>
  );
}

function DetailsGroup({ children }: { children: React.ReactNode }) {
  return <dl className="grid grid-cols-2 gap-x-3 sm:gap-x-5">{children}</dl>;
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
    <main className="mx-auto flex w-full max-w-350 flex-1 flex-col gap-2.5 p-2 md:gap-4 md:p-4">
      {/* Hero — identidade + status da cobertura */}
      <section
        className={`overflow-hidden rounded-2xl border shadow-sm md:rounded-3xl ${status.tone}`}
      >
        <div className="px-3.5 py-3 md:px-5 md:py-4">
          <div className="mb-2 flex flex-wrap items-center gap-1.5">
            <Badge variant={status.badgeVariant}>{status.label}</Badge>
            <Badge variant="outline">Lacre #{lacreId}</Badge>
            {warranty.STATUS_FINANCEIRO && (
              <Badge variant="secondary">{warranty.STATUS_FINANCEIRO}</Badge>
            )}
          </div>
          <h1 className="text-lg leading-tight font-bold text-foreground md:text-2xl">
            {warranty.PRODUTO || `Produto físico #${lacreId}`}
          </h1>
          <p className="mt-1 flex flex-wrap items-center gap-x-1.5 text-[11px] text-muted-foreground md:text-xs">
            <span className="font-semibold">SKU: {warranty.ID_PRODUTO}</span>
            <span aria-hidden="true">•</span>
            <span className="truncate">{warranty.CLIENTE}</span>
          </p>
        </div>

        <div
          className={`flex items-center gap-2.5 border-t px-3.5 py-2.5 md:px-5 md:py-3 ${status.barTone}`}
        >
          <StatusIcon
            className={`size-5 shrink-0 ${status.iconTone}`}
            aria-hidden="true"
          />
          <p className="text-xs font-semibold leading-tight md:text-sm">
            {status.helper}
          </p>
        </div>
      </section>

      {/* Stats — métricas-chave em uma única linha */}
      <section className="grid grid-cols-3 gap-2 md:gap-3">
        <StatCard
          label="Garantia até"
          value={formatShortDate(warranty.GARANTIA_LIMITE)}
          icon={ShieldCheck}
          iconClass="text-emerald-600 dark:text-emerald-300"
        />
        <StatCard
          label="Retirada"
          value={formatShortDate(warranty.DT_RETIRADA)}
          icon={CalendarDays}
          iconClass="text-sky-600 dark:text-sky-300"
        />
        <StatCard
          label="Prazo"
          value={
            warrantyDays > 0
              ? `${warrantyDays} dia${warrantyDays === 1 ? "" : "s"}`
              : "Polít. produto"
          }
          icon={TimerReset}
          iconClass="text-violet-600 dark:text-violet-300"
        />
      </section>

      {/* Detalhes — abas para condensar verticalmente */}
      <Card
        size="sm"
        className="rounded-2xl border-border/60 bg-card/75 shadow-sm md:rounded-3xl"
      >
        <CardContent className="px-3 pt-3 pb-3 md:px-4">
          <Tabs defaultValue="produto" className="gap-3">
            <TabsList className="grid h-9 w-full grid-cols-3 justify-stretch">
              <TabsTrigger value="produto" className="gap-1.5">
                <PackageCheck className="size-3.5" />
                <span className="text-xs">Produto</span>
              </TabsTrigger>
              <TabsTrigger value="pedido" className="gap-1.5">
                <ClipboardList className="size-3.5" />
                <span className="text-xs">Pedido</span>
              </TabsTrigger>
              <TabsTrigger value="cliente" className="gap-1.5">
                <UserRound className="size-3.5" />
                <span className="text-xs">Cliente</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="produto" className="mt-1">
              <DetailsGroup>
                <InfoItem label="ID da garantia" value={warranty.GARANTIA_ID} />
                <InfoItem label="Etiqueta" value={warranty.ETIQUETA} />
                <InfoItem label="Tipo" value={warranty.TIPO} />
                <InfoItem label="Marca" value={warranty.MARCA} />
                <InfoItem label="Nº de série" value={warranty.N_SERIE} />
                <InfoItem
                  label="Código de barras"
                  value={warranty.COD_BARRAS}
                />
                <InfoItem label="Localização" value={warranty.LOCATION} />
                <InfoItem
                  label="Valor da venda"
                  value={formatCurrency(parseMonetaryValue(warranty.VL_VENDA))}
                />
              </DetailsGroup>
            </TabsContent>

            <TabsContent value="pedido" className="mt-1">
              <DetailsGroup>
                <InfoItem label="Pedido" value={`#${warranty.ID_PEDIDO}`} />
                <InfoItem
                  label="Movimento"
                  value={`#${warranty.ID_MOVIMENTO}`}
                />
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
              </DetailsGroup>
            </TabsContent>

            <TabsContent value="cliente" className="mt-1">
              <DetailsGroup>
                <InfoItem label="Cliente" value={warranty.CLIENTE} />
                <InfoItem label="Conta" value={warranty.ACCOUNT_TIPO} />
                <InfoItem
                  label="Status da conta"
                  value={warranty.ACCOUNT_STATUS}
                />
                <InfoItem label="Vendedor" value={warranty.VENDEDOR} />
              </DetailsGroup>
            </TabsContent>
          </Tabs>

          <div className="mt-3 flex items-start gap-2 rounded-lg border border-border/60 bg-muted/50 px-3 py-2.5 text-[11px] leading-relaxed text-muted-foreground">
            <Info className="size-3.5 shrink-0 translate-y-0.5 text-sky-600 dark:text-sky-300" />
            <p>
              Em caso de troca, conserto ou devolução, apresente o lacre e os
              dados do pedido para agilizar o atendimento.
            </p>
          </div>
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
