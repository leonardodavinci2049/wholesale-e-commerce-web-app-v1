import { SiteHeaderWithBreadcrumb } from "@/components/dashboard/header/site-header-with-breadcrumb";
import { serverEnvs } from "@/core/config/envs.server";
import { createLogger } from "@/core/logger";
import { getAuthContext } from "@/server/auth-context";
import { getOrderDashboard } from "@/services/api-main/order-sales/order-sales-cached-service";
import { searchProductsPdv } from "@/services/api-main/product-pdv/product-pdv-cached-service";

const logger = createLogger("new-budget-page");

import { BudgetStepper } from "./_components/budget-stepper";
import { CartItemsList } from "./_components/cart-items-list";
import { MobileBottomBar } from "./_components/mobile-bottom-bar";
import { StepPayment } from "./_components/step-payment";
import { StepProducts } from "./_components/step-products";
import { StepSummary } from "./_components/step-summary";
import { BUDGET_FLOW_STEPS, normalizeBudgetStep } from "./budget-flow";

interface NewBudgetPageProps {
  searchParams: Promise<{
    step?: string;
    search?: string;
    orderId?: string;
    flagStock?: string;
    limit?: string;
  }>;
}

export default async function NewBudgetPage({
  searchParams,
}: NewBudgetPageProps) {
  const { session, apiContext } = await getAuthContext();

  const customerId = session.user.personId ?? 0;
  const sellerId = session.user.sellerId ?? 0;
  const typeBusiness = serverEnvs.TYPE_BUSINESS;

  const dashboardParams = {
    ...apiContext,
    sellerId,
    typeBusiness,
  };

  const params = await searchParams;
  const step = normalizeBudgetStep(Number(params.step));
  const search = params.search ?? "";
  const orderId = params.orderId ? Number(params.orderId) : undefined;
  const flagStock = params.flagStock === "0" ? 0 : 1;
  const DEFAULT_PRODUCT_LIMIT = 20;
  const productLimit = params.limit
    ? Math.max(DEFAULT_PRODUCT_LIMIT, Number(params.limit))
    : DEFAULT_PRODUCT_LIMIT;

  let products: Awaited<ReturnType<typeof searchProductsPdv>> = [];
  let orderDashboard: Awaited<ReturnType<typeof getOrderDashboard>>;

  if (step === BUDGET_FLOW_STEPS.cart) {
    if (search) {
      products = await searchProductsPdv({
        search,
        customerId,
        flagStock,
        limit: Math.max(50, productLimit),
        ...apiContext,
      });
    }

    if (orderId) {
      try {
        orderDashboard = await getOrderDashboard(orderId, dashboardParams);
      } catch (error) {
        logger.error("Erro ao carregar dashboard do pedido (cart):", error);
      }
    }
  }

  if (step === BUDGET_FLOW_STEPS.payment && orderId) {
    try {
      orderDashboard = await getOrderDashboard(orderId, dashboardParams);
    } catch (error) {
      logger.error("Erro ao carregar dashboard do pedido (payment):", error);
    }
  }

  if (step === BUDGET_FLOW_STEPS.summary && orderId) {
    try {
      orderDashboard = await getOrderDashboard(orderId, dashboardParams);
    } catch (error) {
      logger.error("Erro ao carregar dashboard do pedido (summary):", error);
    }
  }

  const customerName =
    orderDashboard?.customer?.customerName ?? session.user.name ?? undefined;

  const cartItems = orderDashboard?.items ?? [];
  const summary = orderDashboard?.summary;
  const hasCartItems = cartItems.length > 0;

  const showCartNextButton = step === BUDGET_FLOW_STEPS.cart;

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeaderWithBreadcrumb
        title="Novo Orçamento"
        breadcrumbItems={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Vendas", href: "#" },
          { label: "Novo Orçamento", isActive: true },
        ]}
      />

      <main className="flex flex-1 flex-col gap-6 p-4 pt-0 lg:p-6 lg:pt-0">
        <div className="mx-auto flex w-full max-w-350 flex-col gap-6">
          <BudgetStepper
            currentStep={step}
            customerId={customerId}
            customerName={customerName}
            orderId={orderId}
          >
            {step === BUDGET_FLOW_STEPS.cart && (
              <StepProducts
                products={products}
                orderDashboard={orderDashboard}
                search={search}
                orderId={orderId}
                customerId={customerId}
                flagStock={flagStock}
                productLimit={productLimit}
              />
            )}

            {step === BUDGET_FLOW_STEPS.payment && orderId && (
              <StepPayment orderDashboard={orderDashboard} orderId={orderId} />
            )}

            {step === BUDGET_FLOW_STEPS.summary && orderId && (
              <StepSummary orderDashboard={orderDashboard} orderId={orderId} />
            )}
          </BudgetStepper>
        </div>
      </main>

      <MobileBottomBar
        itemCount={cartItems.length}
        orderId={orderId}
        nextStep={showCartNextButton ? BUDGET_FLOW_STEPS.payment : undefined}
        nextLabel={showCartNextButton ? "Selecionar Pagamento" : undefined}
        disabled={showCartNextButton ? cartItems.length === 0 : undefined}
      >
        <CartItemsList
          items={cartItems}
          summary={summary}
          orderId={orderId}
          variant="mobile"
          emptyMessage={
            hasCartItems
              ? "Nenhum item adicionado."
              : "Selecione um produto para iniciar o carrinho."
          }
        />
      </MobileBottomBar>
    </div>
  );
}
