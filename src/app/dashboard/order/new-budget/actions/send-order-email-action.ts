"use server";

import { serverEnvs } from "@/core/config/envs.server";
import { createLogger } from "@/core/logger";
import { getAuthContext } from "@/server/auth-context";
import { orderOperationsServiceApi } from "@/services/api-main/order-operations";
import type { ActionState } from "@/types/action-types";

const logger = createLogger("sendOrderEmailAction");

export async function sendOrderEmailAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const { session, apiContext } = await getAuthContext();

    const orderId = Number(formData.get("orderId"));
    if (!orderId) {
      return {
        success: false,
        message: "ID do pedido não fornecido.",
      };
    }

    await orderOperationsServiceApi.sendByEmail({
      pe_order_id: orderId,
      pe_seller_id: session.user.sellerId ?? 0,
      pe_business_type: serverEnvs.TYPE_BUSINESS,
      ...apiContext,
    });

    return {
      success: true,
      message: "E-mail enviado com sucesso!",
    };
  } catch (error) {
    logger.error("Erro ao enviar pedido por e-mail:", error);
    return {
      success: false,
      message: "Erro ao enviar e-mail. Tente novamente.",
    };
  }
}
