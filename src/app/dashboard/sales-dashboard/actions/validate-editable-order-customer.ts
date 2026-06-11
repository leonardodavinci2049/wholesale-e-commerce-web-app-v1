import "server-only";

import { createLogger } from "@/core/logger";
import type { AuthContext } from "@/server/auth-context";
import { orderSalesServiceApi } from "@/services/api-main/order-sales/order-sales-service-api";

const logger = createLogger("sales-dashboard-validate-editable-order-customer");
const EDITABLE_ORDER_STATUS_ID = 22;

type ValidateEditableOrderCustomerResult =
  | {
      success: true;
      orderCustomerId: number;
    }
  | {
      success: false;
      message: string;
    };

export async function validateEditableOrderCustomer(
  orderId: number,
  customerId: number,
  apiContext: AuthContext["apiContext"],
): Promise<ValidateEditableOrderCustomerResult> {
  const dashboardResponse = await orderSalesServiceApi.findDashboardId({
    pe_order_id: orderId,
    pe_id_seller: apiContext.pe_person_id,
    pe_type_business: 1,
    ...apiContext,
  });

  const dashboardDetails = dashboardResponse
    ? orderSalesServiceApi.extractDashboardDetails(dashboardResponse)
    : null;

  if (!dashboardDetails) {
    return {
      success: false,
      message: "Nao foi possivel validar o status atual do pedido",
    };
  }

  if (dashboardDetails.ID_STATUS_PEDIDO !== EDITABLE_ORDER_STATUS_ID) {
    return {
      success: false,
      message: "Somente pedidos em orcamento podem ser editados",
    };
  }

  const orderCustomerId = dashboardDetails.ID_CLIENTE;

  if (orderCustomerId !== customerId) {
    logger.warn("Cliente informado nao pertence ao pedido validado", {
      orderId,
      orderCustomerId,
      requestedCustomerId: customerId,
    });

    return {
      success: false,
      message: "Cliente nao pertence ao pedido informado",
    };
  }

  return {
    success: true,
    orderCustomerId,
  };
}
