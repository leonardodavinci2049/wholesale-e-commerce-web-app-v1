"use server";

import { revalidateTag } from "next/cache";
import { z } from "zod";
import { createLogger } from "@/core/logger";
import { CACHE_TAGS } from "@/lib/cache-config";
import { getAuthContext } from "@/server/auth-context";
import { orderUpdServiceApi } from "@/services/api-main/order-upd";
import { validateEditableOrderCustomer } from "./validate-editable-order-customer";

const logger = createLogger("sales-dashboard-update-order-inline-field-action");

const EditableOrderFieldSchema = z.object({
  orderId: z.number().int().positive(),
  field: z.enum(["ANOTACOES"]),
  value: z.string().max(500),
});

type UpdateOrderInlineFieldResult = {
  success: boolean;
  message: string;
};

export async function updateOrderInlineFieldAction(
  orderId: number,
  field: "ANOTACOES",
  value: string,
): Promise<UpdateOrderInlineFieldResult> {
  try {
    const validated = EditableOrderFieldSchema.parse({ orderId, field, value });
    const { apiContext, session } = await getAuthContext();
    const orderCustomerValidation = await validateEditableOrderCustomer(
      validated.orderId,
      session.user.personId ?? 0,
      apiContext,
    );

    if (!orderCustomerValidation.success) {
      return {
        success: false,
        message: orderCustomerValidation.message,
      };
    }

    await orderUpdServiceApi.updateField({
      ...apiContext,
      pe_register_id: validated.orderId,
      pe_field_type: 1,
      pe_field: validated.field,
      pe_value_str: validated.value.trim(),
      pe_value_int: 0,
      pe_value_numeric: 0,
      pe_value_date: null,
    });

    revalidateTag(CACHE_TAGS.orderSale(String(validated.orderId)), "seconds");
    revalidateTag(CACHE_TAGS.orderSales, "seconds");

    return {
      success: true,
      message: "Campo do pedido atualizado com sucesso",
    };
  } catch (error) {
    logger.error("Erro ao atualizar campo inline do pedido", error);

    return {
      success: false,
      message:
        error instanceof z.ZodError
          ? "Dados invalidos para atualizar o campo do pedido"
          : "Nao foi possivel atualizar o campo do pedido",
    };
  }
}
