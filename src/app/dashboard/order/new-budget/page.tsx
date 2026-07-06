import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { SiteHeaderWithBreadcrumb } from "@/components/dashboard/header/site-header-with-breadcrumb";
import { serverEnvs } from "@/core/config/envs.server";
import { createLogger } from "@/core/logger";
import { getAuthContext } from "@/server/auth-context";
import { orderSalesServiceApi } from "@/services/api-main/order-sales";
import { transformDashboardDetailsEntity } from "@/services/api-main/order-sales/transformers/transformers";

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

    if (!details) {
      return null;
    }

    return {
      details: transformDashboardDetailsEntity(details),
      itemsCount: items.length,
    };
  } catch (error) {
    logger.error("Erro ao carregar orçamento aberto:", error);
    return null;
  }
}

const NewBudgetPage = async () => {
  const openBudget = await getOpenBudget();
  const openOrderId = openBudget?.details.orderId;
  const openItemsCount = openBudget?.itemsCount ?? 0;

  return (
    <>
      <SiteHeaderWithBreadcrumb
        title="Novo Orçamento"
        breadcrumbItems={[
          { label: "Orçamento", href: "/dashboard/order/budget-list" },
          { label: "Criar Orçamento", isActive: true },
        ]}
      />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-6">
          <div className="flex flex-col gap-6 py-6">
            <div className="px-4 lg:px-6">
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold">Novo Orçamento</h1>
                </div>

                <div className="flex min-h-72 flex-col items-center justify-center gap-6 rounded-2xl border border-dashed border-border/70 bg-muted/20 px-6 py-10 text-center">
                  <div className="rounded-full border border-border/70 bg-background p-5 shadow-sm">
                    <ShoppingCart className="size-8 text-primary" />
                  </div>

                  {openOrderId ? (
                    <div className="space-y-2">
                      <p className="text-muted-foreground max-w-md text-sm">
                        Você tem um orçamento aberto ID:{" "}
                        <span className="font-semibold text-foreground">
                          #{openOrderId}
                        </span>{" "}
                        com{" "}
                        <span className="font-semibold text-foreground">
                          {openItemsCount}{" "}
                          {openItemsCount === 1 ? "produto" : "produtos"}
                        </span>
                        .{" "}
                        <Link
                          href={`/dashboard?orderId=${openOrderId}`}
                          className="text-primary font-medium underline-offset-4 hover:underline"
                        >
                          ir para o catálogo de produtos e continuar comprando
                        </Link>
                        .
                      </p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground max-w-md text-sm">
                      Inicie um orçamento de compra e adicione produtos no
                      catálogo.
                    </p>
                  )}

                  <CreateBudgetButton size="lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewBudgetPage;
