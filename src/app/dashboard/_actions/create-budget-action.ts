"use server";

import { revalidateTag, updateTag } from "next/cache";
import { serverEnvs } from "@/core/config/envs.server";
import { createLogger } from "@/core/logger";
import { CACHE_TAGS } from "@/lib/cache-config";
import { getAuthContext } from "@/server/auth-context";
import { orderOperationsServiceApi } from "@/services/api-main/order-operations";
import { OrderOperationsError } from "@/services/api-main/order-operations/types/order-operations-types";
import type { ActionState } from "@/types/action-types";

const logger = createLogger("createBudgetAction");

export async function createBudgetAction(): Promise<ActionState> {
  try {
    const { session, apiContext } = await getAuthContext();

    const customerId = session.user.personId ?? 0;
    const sellerId = session.user.sellerId ?? 0;
    const typeBusiness = serverEnvs.TYPE_BUSINESS;

    if (!customerId) {
      return {
        success: false,
        message: "Cliente não identificado para criar o orçamento.",
      };
    }

    const createOrderResponse = await orderOperationsServiceApi.createOrder({
      pe_customer_id: customerId,
      pe_seller_id: sellerId,
      pe_business_type: typeBusiness,
      pe_payment_form_id: 1,
      pe_location_id: 1,
      pe_notes: "PDV ONLINE",
      ...apiContext,
    });

    const orderId =
      createOrderResponse.data?.[0]?.sp_return_id ??
      createOrderResponse.recordId;

    if (!orderId) {
      return {
        success: false,
        message: "Não foi possível obter o ID do orçamento criado.",
      };
    }

    updateTag(CACHE_TAGS.orderSale(String(orderId)));
    updateTag(CACHE_TAGS.orderSales);
    revalidateTag(CACHE_TAGS.orderItems, "seconds");

    return {
      success: true,
      message: `Novo orçamento #${orderId} criado com sucesso.`,
      data: { orderId },
    };
  } catch (error) {
    logger.error("Erro ao criar novo orçamento:", error);

    if (error instanceof OrderOperationsError) {
      return {
        success: false,
        message: error.message,
      };
    }

    const fallbackMessage =
      error instanceof Error
        ? error.message
        : "Não foi possível criar um novo orçamento.";

    return {
      success: false,
      message: fallbackMessage,
    };
  }
}
