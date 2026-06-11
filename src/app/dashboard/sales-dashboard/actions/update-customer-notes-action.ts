"use server";

import { revalidateTag } from "next/cache";
import { z } from "zod";
import { createLogger } from "@/core/logger";
import { CACHE_TAGS } from "@/lib/cache-config";
import { getAuthContext } from "@/server/auth-context";
import {
  CustomerInlineError,
  customerInlineServiceApi,
} from "@/services/api-main/customer-inline";
import { validateEditableOrderCustomer } from "./validate-editable-order-customer";

const logger = createLogger("sales-dashboard-update-customer-notes-action");

const UpdateCustomerNotesSchema = z.object({
  orderId: z.number().int().positive(),
  customerId: z.number().int().positive(),
  notes: z.string(),
});

type UpdateCustomerNotesActionResult = {
  success: boolean;
  message: string;
};

export async function updateCustomerNotesAction(
  orderId: number,
  customerId: number,
  notes: string,
): Promise<UpdateCustomerNotesActionResult> {
  try {
    const validated = UpdateCustomerNotesSchema.parse({
      orderId,
      customerId,
      notes,
    });
    const { apiContext } = await getAuthContext();
    const orderCustomerValidation = await validateEditableOrderCustomer(
      validated.orderId,
      validated.customerId,
      apiContext,
    );

    if (!orderCustomerValidation.success) {
      return {
        success: false,
        message: orderCustomerValidation.message,
      };
    }

    await customerInlineServiceApi.updateField({
      ...apiContext,
      pe_register_id: orderCustomerValidation.orderCustomerId,
      pe_field_type: 1,
      pe_field: "ANOTACOES",
      pe_value_str: validated.notes.trim(),
      pe_value_int: 0,
      pe_value_numeric: 0,
      pe_value_date: null,
    });

    revalidateTag(CACHE_TAGS.orderSale(String(validated.orderId)), "seconds");
    revalidateTag(CACHE_TAGS.orderSales, "seconds");
    revalidateTag(
      CACHE_TAGS.customer(String(orderCustomerValidation.orderCustomerId)),
      "seconds",
    );
    revalidateTag(CACHE_TAGS.customers, "seconds");

    return {
      success: true,
      message: "Anotacoes do cliente atualizadas com sucesso",
    };
  } catch (error) {
    logger.error("Erro ao atualizar anotacoes do cliente", error);

    if (error instanceof CustomerInlineError) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: false,
      message: "Erro inesperado ao atualizar anotacoes do cliente",
    };
  }
}
