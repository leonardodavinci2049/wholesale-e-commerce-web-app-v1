import { connection } from "next/server";
import { SiteHeaderWithBreadcrumb } from "@/components/dashboard/header/site-header-with-breadcrumb";
import { createLogger } from "@/core/logger";
import { getAuthContext } from "@/server/auth-context";
import { orderReportsServiceApi } from "@/services/api-main/order-reports";
import {
  transformCustomerAllList,
  type UIOrderListItem,
} from "@/services/api-main/order-reports/transformers/transformers";
import { BudgetListContent } from "./_components/budget-list-content";
import {
  BUDGET_ORDER_STATUS_ID,
  type BudgetListSearchParams,
  DEFAULT_BUDGET_LIST_LIMIT,
  getDefaultBudgetListFilters,
  normalizeBudgetListFilters,
} from "./budget-list.types";

interface BudgetListPageProps {
  searchParams: Promise<BudgetListSearchParams>;
}

const logger = createLogger("budget-list-page");

function toOptionalNumber(value?: string): number | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return undefined;
  }

  return parsed;
}

async function getCustomerBudgets(params: {
  orderId?: number;
  customerId?: number;
  sellerId?: number;
  orderStatusId?: number;
  financialStatusId?: number;
  locationId?: number;
  initialDate?: string;
  finalDate?: string;
  limit?: number;
  pe_user_id: string;
  pe_user_name: string;
  pe_user_role: string;
  pe_person_id: number;
}): Promise<UIOrderListItem[]> {
  const response = await orderReportsServiceApi.orderFindCustomerAll({
    pe_order_id: params.orderId,
    pe_customer_id: params.customerId,
    pe_seller_id: params.sellerId,
    pe_order_status_id: params.orderStatusId,
    pe_financial_status_id: params.financialStatusId,
    pe_location_id: params.locationId,
    pe_initial_date: params.initialDate,
    pe_final_date: params.finalDate,
    pe_limit: params.limit,
    pe_user_id: params.pe_user_id,
    pe_user_name: params.pe_user_name,
    pe_user_role: params.pe_user_role,
    pe_person_id: params.pe_person_id,
  });

  return transformCustomerAllList(
    orderReportsServiceApi.extractOrderFindCustomerAll(response),
  );
}

export default async function BudgetListPage(props: BudgetListPageProps) {
  await connection();

  const searchParams = await props.searchParams;
  const { apiContext } = await getAuthContext();
  const defaultFilters = getDefaultBudgetListFilters();
  const currentFilters = normalizeBudgetListFilters(
    searchParams,
    defaultFilters,
  );

  let budgets: Awaited<ReturnType<typeof getCustomerBudgets>> = [];

  try {
    budgets = await getCustomerBudgets({
      orderId: toOptionalNumber(currentFilters.orderId),
      customerId: apiContext.pe_person_id,
      sellerId: 0,
      orderStatusId: Number(BUDGET_ORDER_STATUS_ID),
      financialStatusId: toOptionalNumber(currentFilters.financialStatusId),
      locationId: toOptionalNumber(currentFilters.locationId),
      initialDate: currentFilters.initialDate,
      finalDate: currentFilters.finalDate,
      limit:
        toOptionalNumber(currentFilters.limit) ??
        Number(DEFAULT_BUDGET_LIST_LIMIT),
      ...apiContext,
    });
  } catch (error) {
    logger.error("Erro ao carregar orçamentos do cliente:", error);
  }

  return (
    <>
      <SiteHeaderWithBreadcrumb
        title="Listagem de Orçamentos"
        breadcrumbItems={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Pedidos", href: "#" },
          { label: "Listagem de Orçamentos", isActive: true },
        ]}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="@container/main mx-auto w-full max-w-[1400px] flex-1 flex-col gap-6 px-4 lg:px-6 py-6 overflow-hidden">
          <BudgetListContent
            orders={budgets}
            currentFilters={currentFilters}
            defaultFilters={defaultFilters}
          />
        </div>
      </div>
    </>
  );
}
