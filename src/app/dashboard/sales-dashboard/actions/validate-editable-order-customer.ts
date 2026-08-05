import "server-only";

import { createLogger } from "@/core/logger";
import type { AuthContext } from "@/server/auth-context";
import { orderB2bServiceApi } from "@/services/api-main/order-b2b/order-b2b-service-api";
import { OrderB2bNotFoundError } from "@/services/api-main/order-b2b/types/order-b2b-types";

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
  authenticatedCustomerId: number,
  apiContext: AuthContext["apiContext"],
  requestedCustomerId?: number,
): Promise<ValidateEditableOrderCustomerResult> {
  if (authenticatedCustomerId <= 0) {
    return {
      success: false,
      message: "Cliente autenticado invalido",
    };
  }

  if (
    requestedCustomerId !== undefined &&
    requestedCustomerId !== authenticatedCustomerId
  ) {
    logger.warn("Cliente informado difere do cliente autenticado", {
      orderId,
      authenticatedCustomerId,
      requestedCustomerId,
    });

    return {
      success: false,
      message: "Cliente nao pertence ao pedido informado",
    };
  }

  let dashboardResponse;

  try {
    dashboardResponse = await orderB2bServiceApi.findDashboardCustomerId({
      ...apiContext,
      pe_order_id: orderId,
      pe_customer_id: authenticatedCustomerId,
    });
  } catch (error) {
    if (error instanceof OrderB2bNotFoundError) {
      return {
        success: false,
        message: "Pedido nao encontrado para o cliente autenticado",
      };
    }

    throw error;
  }

  const dashboardDetails =
    orderB2bServiceApi.extractDashboardDetails(dashboardResponse);

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

  if (orderCustomerId !== authenticatedCustomerId) {
    logger.warn("Pedido retornado nao pertence ao cliente autenticado", {
      orderId,
      orderCustomerId,
      authenticatedCustomerId,
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
