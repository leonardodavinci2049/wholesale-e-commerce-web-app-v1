"use server";

import { revalidateTag } from "next/cache";
import { z } from "zod";
import { createLogger } from "@/core/logger";
import { CACHE_TAGS } from "@/lib/cache-config";
import { getAuthContext } from "@/server/auth-context";
import {
  OrderOperationsError,
  orderOperationsServiceApi,
} from "@/services/api-main/order-operations";
import { validateEditableOrderCustomer } from "./validate-editable-order-customer";

const logger = createLogger("sales-dashboard-close-order-action");

const CloseOrderSchema = z.object({
  orderId: z.number().int().positive(),
});

type CloseOrderActionResult = {
  success: boolean;
  message: string;
};

export async function closeOrderAction(
  orderId: number,
): Promise<CloseOrderActionResult> {
  try {
    const validatedOrderId = CloseOrderSchema.parse({ orderId }).orderId;
    const { apiContext, session } = await getAuthContext();
    const orderCustomerValidation = await validateEditableOrderCustomer(
      validatedOrderId,
      session.user.personId ?? 0,
      apiContext,
    );

    if (!orderCustomerValidation.success) {
      return {
        success: false,
        message: orderCustomerValidation.message,
      };
    }

    const response = await orderOperationsServiceApi.closeOrder({
      pe_order_id: validatedOrderId,
      ...apiContext,
    });

    revalidateTag(CACHE_TAGS.orderSale(String(validatedOrderId)), "hours");
    revalidateTag(CACHE_TAGS.orderSales, "seconds");

    return {
      success: true,
      message:
        response.message ||
        response.data?.[0]?.sp_message ||
        "Pedido fechado com sucesso",
    };
  } catch (error) {
    if (error instanceof OrderOperationsError) {
      return {
        success: false,
        message: error.message,
      };
    }

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.issues[0]?.message ?? "ID do pedido inválido",
      };
    }

    logger.error("Erro ao finalizar pedido", error);

    return {
      success: false,
      message: "Erro ao finalizar pedido",
    };
  }
}
