"use server";

import { updateTag } from "next/cache";
import { z } from "zod";
import { createLogger } from "@/core/logger";
import { CACHE_TAGS } from "@/lib/cache-config";
import { getAuthContext } from "@/server/auth-context";
import { orderSalesServiceApi } from "@/services/api-main/order-sales";
import {
  OrderUpdError,
  orderUpdServiceApi,
} from "@/services/api-main/order-upd";

const logger = createLogger("sales-dashboard-update-delivery-method-action");
const EDITABLE_ORDER_STATUS_ID = 22;

const UpdateDeliveryMethodSchema = z.object({
  orderId: z.number().int().positive(),
  deliveryMethodId: z.number().int().positive(),
});

type UpdateDeliveryMethodResult = {
  success: boolean;
  message: string;
};

export async function updateDeliveryMethodAction(
  orderId: number,
  deliveryMethodId: number,
): Promise<UpdateDeliveryMethodResult> {
  try {
    const validated = UpdateDeliveryMethodSchema.parse({
      orderId,
      deliveryMethodId,
    });
    const { apiContext, session } = await getAuthContext();
    const customerId = session.user.personId ?? 0;

    if (customerId <= 0) {
      return {
        success: false,
        message: "Cliente autenticado inválido",
      };
    }

    const orderResponse = await orderSalesServiceApi.findOrderId({
      ...apiContext,
      pe_order_id: validated.orderId,
      pe_id_customer: customerId,
      pe_type_business: 1,
    });
    const orderDetails = orderResponse
      ? orderSalesServiceApi.extractDashboardDetails(orderResponse)
      : null;

    if (!orderDetails || orderDetails.ID_CLIENTE !== customerId) {
      return {
        success: false,
        message: "Pedido não encontrado para o cliente autenticado",
      };
    }

    if (orderDetails.ID_STATUS_PEDIDO !== EDITABLE_ORDER_STATUS_ID) {
      return {
        success: false,
        message: "Somente pedidos em orçamento podem ter o frete alterado",
      };
    }

    const deliveryMethodsResponse = await orderSalesServiceApi.findCoTipoFrete({
      ...apiContext,
    });
    const selectedDeliveryMethod = orderSalesServiceApi
      .extractTipoFrete(deliveryMethodsResponse)
      .find((method) => method.ID_TIPO_FRETE === validated.deliveryMethodId);

    if (!selectedDeliveryMethod) {
      return {
        success: false,
        message: "Forma de entrega indisponível para este pedido",
      };
    }

    await orderUpdServiceApi.updateFrete({
      ...apiContext,
      pe_order_id: validated.orderId,
      pe_shipping_type_id: selectedDeliveryMethod.ID_TIPO_FRETE,
    });

    updateTag(CACHE_TAGS.orderSale(String(validated.orderId)));
    updateTag(CACHE_TAGS.orderSales);

    return {
      success: true,
      message: "Forma de entrega atualizada com sucesso",
    };
  } catch (error) {
    logger.error("Erro ao atualizar forma de entrega do pedido", error);

    return {
      success: false,
      message:
        error instanceof z.ZodError
          ? "Dados inválidos para atualizar a forma de entrega"
          : error instanceof OrderUpdError
            ? error.message
            : "Não foi possível atualizar a forma de entrega",
    };
  }
}
