import { CartSummaryPanel } from "@/app/dashboard/order/budget/_components/cart-summary-panel";
import { serverEnvs } from "@/core/config/envs.server";
import { createLogger } from "@/core/logger";
import { getAuthContext } from "@/server/auth-context";
import { getOrderCart } from "@/services/api-main/order-sales/order-sales-cached-service";

import { HeaderMiniCartClient } from "./header-mini-cart-client";

const logger = createLogger("header-mini-cart");

const BUDGET_HREF = "/dashboard/order/budget";

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
