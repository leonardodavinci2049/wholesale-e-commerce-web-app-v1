import { CartSummaryPanel } from "@/app/dashboard/_components/main_catalog/cart-summary-panel";
import { serverEnvs } from "@/core/config/envs.server";
import { createLogger } from "@/core/logger";
import { getAuthContext } from "@/server/auth-context";
import { orderSalesServiceApi } from "@/services/api-main/order-sales";
import {
  transformCustomerEntity,
  transformDashboardDetailsEntity,
  transformDashboardItemEntity,
  transformSummaryEntity,
} from "@/services/api-main/order-sales/transformers/transformers";

import { HeaderMiniCartClient } from "./header-mini-cart-client";

const logger = createLogger("header-mini-cart");

const BUDGET_HREF = "/dashboard";

async function getOrderCart(
  orderId: number,
  params: {
    customerId?: number;
    typeBusiness?: number;
    pe_user_id: string;
    pe_user_name: string;
    pe_user_role: string;
    pe_person_id: number;
  },
) {
  const response = await orderSalesServiceApi.findCartId({
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

export async function HeaderMiniCart() {
  const { session, apiContext } = await getAuthContext();

  const customerId = session.user.personId ?? 0;
  const typeBusiness = serverEnvs.TYPE_BUSINESS;

  const orderCart = await getOrderCart(0, {
    ...apiContext,
    customerId,
    typeBusiness,
  }).catch((error) => {
    logger.error("Erro ao carregar carrinho para o header:", error);
    return undefined;
  });

  const items = orderCart?.items ?? [];
  const summary = orderCart?.summary;
  const orderId = orderCart?.details?.orderId;
  const selectedPaymentId = orderCart?.details?.paymentFormId;

  const href = orderId ? `${BUDGET_HREF}?orderId=${orderId}` : BUDGET_HREF;

  return (
    <HeaderMiniCartClient
      itemCount={items.length}
      href={href}
      cartContent={
        <CartSummaryPanel
          items={items}
          summary={summary}
          orderId={orderId}
          selectedPaymentId={selectedPaymentId}
        />
      }
    />
  );
}
