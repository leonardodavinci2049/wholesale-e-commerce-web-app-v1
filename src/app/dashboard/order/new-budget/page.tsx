import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  PackagePlus,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";
import { CatalogMobileBottomBar } from "@/components/common/catalog-mobile-bottom-bar";
import { SiteHeaderWithBreadcrumb } from "@/components/dashboard/header/site-header-with-breadcrumb";
import { Button } from "@/components/ui/button";
import { serverEnvs } from "@/core/config/envs.server";
import { createLogger } from "@/core/logger";
import { getAuthContext } from "@/server/auth-context";
import { orderSalesServiceApi } from "@/services/api-main/order-sales";
import {
  transformDashboardDetailsEntity,
  transformDashboardItemEntity,
  transformSummaryEntity,
} from "@/services/api-main/order-sales/transformers/transformers";

import { CartSummaryPanel } from "../../_components/main_catalog/cart-summary-panel";
import { CreateBudgetButton } from "../_components/create-budget-button";

const logger = createLogger("new-budget-page");

async function getOpenBudget() {
  const { session, apiContext } = await getAuthContext();

  const customerId = session.user.personId ?? 0;
  const typeBusiness = serverEnvs.TYPE_BUSINESS;

  try {
    const response = await orderSalesServiceApi.findCartId({
      pe_order_id: 0,
      pe_id_customer: customerId,
      pe_type_business: typeBusiness,
      ...apiContext,
    });

    if (!response) {
      return null;
    }

    const details = orderSalesServiceApi.extractDashboardDetails(response);
    const items = orderSalesServiceApi.extractDashboardItems(response);
    const summary = orderSalesServiceApi.extractDashboardSummary(response);

    if (!details) {
      return null;
    }

    return {
      details: transformDashboardDetailsEntity(details),
      items: items.map(transformDashboardItemEntity),
      summary: summary ? transformSummaryEntity(summary) : null,
    };
  } catch (error) {
    logger.error("Erro ao carregar orçamento aberto:", error);
    return null;
  }
}

const NewBudgetPage = async () => {
  const openBudget = await getOpenBudget();
  const openOrderId = openBudget?.details.orderId;
  const openItemsCount = openBudget?.items.length ?? 0;
  const selectedPaymentId = openBudget?.details.paymentFormId;

  return (
    <>
      <SiteHeaderWithBreadcrumb
        title="Novo Orçamento"
        breadcrumbItems={[
          { label: "Orçamento", href: "/dashboard/order/budget-list" },
          { label: "Criar Orçamento", isActive: true },
        ]}
      />
      <div className="flex flex-1 flex-col px-4 pt-6 pb-[calc(env(safe-area-inset-bottom)+6rem)] lg:px-6 xl:pb-6">
        <div className="@container/main flex flex-1 items-center justify-center">
          <section className="w-full max-w-3xl overflow-hidden rounded-3xl border border-border/70 bg-background shadow-sm">
            <div className="border-border/70 border-b bg-muted/30 px-5 py-4 sm:px-7">
              <div className="flex items-center gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-border/70 bg-background shadow-sm">
                  <ClipboardList className="size-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <h1 className="font-semibold text-2xl tracking-tight sm:text-3xl">
                    Novo orçamento
                  </h1>
                  <p className="mt-1 text-muted-foreground text-sm">
                    Comece uma nova compra e selecione os produtos no catálogo.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex min-h-[430px] flex-col items-center justify-center gap-7 px-5 py-10 text-center sm:px-8 sm:py-12">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-primary/10 blur-2xl" />
                <div className="relative flex size-24 items-center justify-center rounded-full border border-border/70 bg-card shadow-sm sm:size-28">
                  <ShoppingCart className="size-10 text-primary sm:size-12" />
                </div>
              </div>

              <div className="max-w-xl space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-muted/40 px-3 py-1 text-muted-foreground text-xs font-medium">
                  <PackagePlus className="size-3.5 text-primary" />
                  Fluxo rápido de criação
                </div>

                {openOrderId ? (
                  <div className="space-y-3">
                    <p className="text-base text-foreground sm:text-lg">
                      Já existe um orçamento aberto{" "}
                      <span className="font-semibold">#{openOrderId}</span>.
                    </p>
                    <p className="mx-auto max-w-md text-muted-foreground text-sm leading-6">
                      Ele possui{" "}
                      <span className="font-medium text-foreground">
                        {openItemsCount}{" "}
                        {openItemsCount === 1 ? "produto" : "produtos"}
                      </span>
                      . Você pode continuar de onde parou ou criar um novo
                      orçamento.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-base text-foreground sm:text-lg">
                      Tudo pronto para montar um orçamento profissional.
                    </p>
                    <p className="mx-auto max-w-md text-muted-foreground text-sm leading-6">
                      Clique no botão abaixo para abrir um novo orçamento e
                      adicionar produtos direto pelo catálogo.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex w-full max-w-sm flex-col items-center gap-3">
                <CreateBudgetButton
                  className="h-11 w-full px-6 text-sm shadow-sm sm:h-12"
                  size="lg"
                />

                {openOrderId ? (
                  <Button
                    asChild
                    className="w-full gap-2"
                    size="lg"
                    variant="outline"
                  >
                    <Link href={`/dashboard?orderId=${openOrderId}`}>
                      Continuar orçamento aberto
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                ) : (
                  <div className="flex items-center gap-2 text-muted-foreground text-xs">
                    <CheckCircle2 className="size-4 text-primary" />
                    Você será levado ao catálogo após criar o orçamento.
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>

      <CatalogMobileBottomBar
        cartItemCount={openItemsCount}
        cartContent={
          <CartSummaryPanel
            items={openBudget?.items ?? []}
            summary={openBudget?.summary}
            orderId={openOrderId}
            selectedPaymentId={selectedPaymentId}
          />
        }
      />
    </>
  );
};

export default NewBudgetPage;
