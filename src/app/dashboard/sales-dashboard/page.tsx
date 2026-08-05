import { connection } from "next/server";
import { Suspense } from "react";
import { SiteHeaderWithBreadcrumb } from "@/components/dashboard/header/site-header-with-breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { createLogger } from "@/core/logger";
import { getAuthContext } from "@/server/auth-context";
import type { OrderTipoFreteEntity } from "@/services/api-main/order-sales";
import { orderSalesServiceApi } from "@/services/api-main/order-sales";
import {
  transformCustomerEntity,
  transformDashboardDetailsEntity,
  transformDashboardItemEntity,
  transformSummaryEntity,
  type UIOrderCustomer,
  type UIOrderDashboardDetails,
  type UIOrderDashboardItem,
  type UIOrderSalesSummary,
} from "@/services/api-main/order-sales/transformers/transformers";
import { CustomerSection } from "./_components/customer-section";
import { HeaderOrderSection } from "./_components/header-order-section";
import { OrderActionsSection } from "./_components/order-actions-section";
import { OrderEditSection } from "./_components/order-edit-section";
import { OrderItemsSection } from "./_components/order-items-section";
import { OrderLoadErrorState } from "./_components/order-load-error-state";
import { OrderSummarySection } from "./_components/order-summary-section";
import { OrderTabsSection } from "./_components/order-tabs-section";
import { PurchaseDetailsSection } from "./_components/purchase-details-section";

const logger = createLogger("dashboard-pdv-page");

type UIOrderDashboardData = {
  summary: UIOrderSalesSummary | null;
  details: UIOrderDashboardDetails | null;
  items: UIOrderDashboardItem[];
  customer: UIOrderCustomer | null;
  error?: string;
};

interface PdvPageProps {
  searchParams: Promise<{ orderId?: string }>;
}

async function getFindOrder(
  orderId: number,
  params: {
    customerId?: number;
    typeBusiness?: number;
    pe_user_id: string;
    pe_user_name: string;
    pe_user_role: string;
    pe_person_id: number;
  },
): Promise<UIOrderDashboardData | undefined> {
  const response = await orderSalesServiceApi.findOrderId({
    pe_order_id: orderId,
    pe_id_customer: params.customerId,
    pe_type_business: params.typeBusiness,
    pe_user_id: params.pe_user_id,
    pe_user_name: params.pe_user_name,
    pe_user_role: params.pe_user_role,
    pe_person_id: params.pe_person_id,
  });

  if (!response) {
    return undefined;
  }

  const summary = orderSalesServiceApi.extractDashboardSummary(response);
  const details = orderSalesServiceApi.extractDashboardDetails(response);
  const items = orderSalesServiceApi.extractDashboardItems(response);
  const customer = orderSalesServiceApi.extractDashboardCustomer(response);

  return {
    summary: summary ? transformSummaryEntity(summary) : null,
    details: details ? transformDashboardDetailsEntity(details) : null,
    items: items.map(transformDashboardItemEntity),
    customer: customer ? transformCustomerEntity(customer) : null,
  };
}

function SalesPanelSkeleton() {
  return (
    <div className="mx-auto grid w-full max-w-350 gap-4 px-4 pb-6 pt-4 md:px-6 md:pb-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(360px,420px)] xl:grid-cols-[minmax(0,2fr)_minmax(380px,450px)]">
      <div className="space-y-4">
        <Skeleton className="h-32 w-full rounded-[28px]" />
        <Skeleton className="h-110 w-full rounded-[28px]" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-96 w-full rounded-[28px]" />
        <Skeleton className="h-32 w-full rounded-[28px]" />
      </div>
    </div>
  );
}

async function SalesPanelContent({ searchParams }: PdvPageProps) {
  await connection();

  const params = await searchParams;
  const orderId = params.orderId ? Number(params.orderId) : 0;
  const { apiContext, session } = await getAuthContext();
  const sessionCustomerId = session.user.personId ?? 0;

  let dashboardData: UIOrderDashboardData | null = null;
  let deliveryMethods: OrderTipoFreteEntity[] = [];

  try {
    dashboardData =
      (await getFindOrder(orderId, {
        ...apiContext,
        customerId: sessionCustomerId,
        typeBusiness: 1,
      })) ?? null;

    if (
      dashboardData?.details &&
      dashboardData.details.customerId !== sessionCustomerId
    ) {
      logger.warn("Pedido carregado nao pertence ao cliente autenticado", {
        orderId,
        orderCustomerId: dashboardData.details.customerId,
        sessionCustomerId,
      });

      dashboardData = {
        summary: null,
        details: null,
        items: [],
        customer: null,
        error: "Pedido nao encontrado para o cliente autenticado",
      };
    }

    if (dashboardData?.details) {
      try {
        const deliveryMethodsResponse =
          await orderSalesServiceApi.findCoTipoFrete({
            ...apiContext,
          });

        deliveryMethods = orderSalesServiceApi.extractTipoFrete(
          deliveryMethodsResponse,
        );
      } catch (error) {
        logger.error("Erro ao carregar formas de entrega do pedido", error);
      }
    }
  } catch (error) {
    logger.error("Erro ao carregar dados do pedido:", error);
  }

  const errorMessage = dashboardData?.error ?? null;
  const shouldShowErrorState = Boolean(errorMessage) || !dashboardData?.details;

  return (
    <div className="mx-auto flex w-full max-w-350 flex-col gap-4 px-4 pb-6 pt-4 md:px-6 md:pb-8">
      {shouldShowErrorState ? (
        <OrderLoadErrorState
          errorMessage={errorMessage}
          orderId={orderId > 0 ? orderId : undefined}
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(360px,420px)] xl:grid-cols-[minmax(0,2fr)_minmax(380px,450px)]">
          <main className="order-1 flex min-w-0 flex-col gap-4">
            <HeaderOrderSection
              details={dashboardData?.details ?? null}
              customerName={dashboardData?.customer?.customerName ?? null}
            />
            <OrderTabsSection
              cartContent={
                <OrderItemsSection
                  items={dashboardData?.items ?? []}
                  orderStatusId={dashboardData?.details?.orderStatusId ?? 0}
                  orderId={dashboardData?.details?.orderId ?? 0}
                  customerId={dashboardData?.details?.customerId ?? 0}
                  sellerId={dashboardData?.details?.sellerId ?? 0}
                  paymentFormId={dashboardData?.details?.paymentFormId ?? 0}
                />
              }
              purchaseDetailsContent={
                <PurchaseDetailsSection
                  details={dashboardData?.details ?? null}
                />
              }
              customerDetailsContent={
                <CustomerSection
                  customer={dashboardData?.customer ?? null}
                  orderId={dashboardData?.details?.orderId ?? orderId}
                  orderStatusId={dashboardData?.details?.orderStatusId ?? 0}
                />
              }
              orderEditContent={
                <OrderEditSection details={dashboardData?.details ?? null} />
              }
            />
          </main>

          <aside className="order-2 min-w-0">
            <div className="space-y-4 xl:sticky xl:top-4">
              <OrderSummarySection
                summary={dashboardData?.summary ?? null}
                deliveryMethods={deliveryMethods}
                hasFreeShipping={
                  dashboardData?.customer?.hasFreeShipping ?? false
                }
                orderId={dashboardData?.details?.orderId ?? orderId}
                orderStatusId={dashboardData?.details?.orderStatusId ?? 0}
              />
              <OrderActionsSection
                summary={dashboardData?.summary ?? null}
                details={dashboardData?.details ?? null}
                items={dashboardData?.items ?? []}
                customer={dashboardData?.customer ?? null}
                orderStatusId={dashboardData?.details?.orderStatusId ?? 0}
              />
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

export default function SalesPanelPage({ searchParams }: PdvPageProps) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-105 bg-[radial-gradient(circle_at_top_left,var(--tw-gradient-stops))] from-primary/10 via-background to-transparent" />

      <SiteHeaderWithBreadcrumb
        title="PDV"
        breadcrumbItems={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "PDV", isActive: true },
        ]}
      />

      <div className="relative flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          <Suspense fallback={<SalesPanelSkeleton />}>
            <SalesPanelContent searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
