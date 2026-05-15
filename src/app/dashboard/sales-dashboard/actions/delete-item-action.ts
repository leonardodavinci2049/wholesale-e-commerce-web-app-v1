"use server";

import { revalidateTag, updateTag } from "next/cache";
import { z } from "zod";
import { createLogger } from "@/core/logger";
import { CACHE_TAGS } from "@/lib/cache-config";
import { getAuthContext } from "@/server/auth-context";
import { orderItemsServiceApi } from "@/services/api-main/order-items";
import { OrderItemsError } from "@/services/api-main/order-items/types/order-items-types";

const logger = createLogger("sales-dashboard-delete-item-action");

const DeleteItemSchema = z.object({
  orderId: z.number().int().positive(),
  movementId: z.number().int().positive(),
});

type DeleteItemActionResult = {
  success: boolean;
  message: string;
};

export async function deleteItemAction(params: {
  orderId: number;
  movementId: number;
}): Promise<DeleteItemActionResult> {
  try {
    const validated = DeleteItemSchema.parse(params);
    const { apiContext } = await getAuthContext();

    await orderItemsServiceApi.deleteOrderItem({
      ...apiContext,
      pe_movement_id: validated.movementId,
    });

    updateTag(CACHE_TAGS.orderSale(String(validated.orderId)));
    updateTag(CACHE_TAGS.orderSales);
    revalidateTag(CACHE_TAGS.orderItems, "seconds");

    return {
      success: true,
      message: "Item excluído com sucesso",
    };
  } catch (error) {
    logger.error("Erro ao excluir item do pedido", error);
    return {
      success: false,
      message:
        error instanceof z.ZodError
          ? "Dados inválidos para exclusão do item"
          : error instanceof OrderItemsError
            ? error.message
            : "Erro ao excluir item do pedido",
    };
  }
}
