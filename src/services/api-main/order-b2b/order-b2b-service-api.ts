import "server-only";

import { serverEnvs } from "@/core/config/envs.server";
import {
  API_STATUS_CODES,
  isApiError,
  ORDER_B2B_ENDPOINTS,
} from "@/core/constants/api-constants";
import { createLogger } from "@/core/logger";
import { BaseApiService } from "@/lib/axios/base-api-service";

import type {
  OrderFindBudgetCustomerIdRequest,
  OrderFindBudgetCustomerIdResponse,
  OrderFindDashboardCustomerIdRequest,
  OrderFindDashboardCustomerIdResponse,
  OrderItemFindQtRequest,
  OrderItemFindQtResponse,
} from "./types/order-b2b-types";
import { OrderB2bError, OrderB2bNotFoundError } from "./types/order-b2b-types";
import {
  OrderFindBudgetCustomerIdSchema,
  OrderFindDashboardCustomerIdSchema,
  OrderItemFindQtSchema,
} from "./validation/order-b2b-schemas";

const logger = createLogger("OrderB2bServiceApi");

export class OrderB2bServiceApi extends BaseApiService {
  private buildBasePayload(
    additionalData: Record<string, unknown> = {},
  ): Record<string, unknown> {
    return {
      pe_app_id: serverEnvs.APP_ID,
      pe_store_id: serverEnvs.STORE_ID,
      ...additionalData,
      pe_system_client_id: serverEnvs.SYSTEM_CLIENT_ID,
      pe_organization_id: serverEnvs.ORGANIZATION_ID,
    };
  }

  async findBudgetCustomerId(
    params: OrderFindBudgetCustomerIdRequest,
  ): Promise<OrderFindBudgetCustomerIdResponse> {
    try {
      const validatedParams = OrderFindBudgetCustomerIdSchema.parse(params);
      const requestBody = this.buildBasePayload({
        pe_user_id: validatedParams.pe_user_id,
        pe_user_name: validatedParams.pe_user_name,
        pe_user_role: validatedParams.pe_user_role,
        pe_person_id: validatedParams.pe_person_id,
        pe_customer_id: validatedParams.pe_customer_id,
      });

      const response = await this.post<OrderFindBudgetCustomerIdResponse>(
        ORDER_B2B_ENDPOINTS.FIND_BUDGET_CUSTOMER_ID,
        requestBody,
      );

      if (response.statusCode === API_STATUS_CODES.NOT_FOUND) {
        throw new OrderB2bNotFoundError(validatedParams);
      }

      if (isApiError(response.statusCode)) {
        throw new OrderB2bError(
          response.message || "Erro ao buscar orçamento por customer ID",
          "ORDER_B2B_FIND_BUDGET_ERROR",
          response.statusCode,
        );
      }

      return response;
    } catch (error) {
      logger.error("Erro ao buscar orçamento por customer ID", error);
      throw error;
    }
  }

  async findDashboardCustomerId(
    params: OrderFindDashboardCustomerIdRequest,
  ): Promise<OrderFindDashboardCustomerIdResponse> {
    try {
      const validatedParams = OrderFindDashboardCustomerIdSchema.parse(params);
      const requestBody = this.buildBasePayload({
        pe_user_id: validatedParams.pe_user_id,
        pe_user_name: validatedParams.pe_user_name,
        pe_user_role: validatedParams.pe_user_role,
        pe_person_id: validatedParams.pe_person_id,
        pe_order_id: validatedParams.pe_order_id,
        pe_customer_id: validatedParams.pe_customer_id,
      });

      const response = await this.post<OrderFindDashboardCustomerIdResponse>(
        ORDER_B2B_ENDPOINTS.FIND_DASHBOARD_CUSTOMER_ID,
        requestBody,
      );

      if (response.statusCode === API_STATUS_CODES.NOT_FOUND) {
        throw new OrderB2bNotFoundError(validatedParams);
      }

      if (isApiError(response.statusCode)) {
        throw new OrderB2bError(
          response.message || "Erro ao buscar dashboard por customer ID",
          "ORDER_B2B_FIND_DASHBOARD_ERROR",
          response.statusCode,
        );
      }

      return response;
    } catch (error) {
      logger.error("Erro ao buscar dashboard por customer ID", error);
      throw error;
    }
  }

  async findItemQt(
    params: OrderItemFindQtRequest,
  ): Promise<OrderItemFindQtResponse> {
    try {
      const validatedParams = OrderItemFindQtSchema.parse(params);
      const requestBody = this.buildBasePayload({
        pe_user_id: validatedParams.pe_user_id,
        pe_user_name: validatedParams.pe_user_name,
        pe_user_role: validatedParams.pe_user_role,
        pe_person_id: validatedParams.pe_person_id,
        pe_customer_id: validatedParams.pe_customer_id,
      });

      const response = await this.post<OrderItemFindQtResponse>(
        ORDER_B2B_ENDPOINTS.FIND_ITEM_QT,
        requestBody,
      );

      if (response.statusCode === API_STATUS_CODES.NOT_FOUND) {
        throw new OrderB2bNotFoundError(validatedParams);
      }

      if (isApiError(response.statusCode)) {
        throw new OrderB2bError(
          response.message || "Erro ao buscar quantidade de itens do pedido",
          "ORDER_B2B_FIND_ITEM_QT_ERROR",
          response.statusCode,
        );
      }

      return response;
    } catch (error) {
      logger.error("Erro ao buscar quantidade de itens do pedido", error);
      throw error;
    }
  }

  // === Extractors - Budget ===

  extractBudgetSummary(response: OrderFindBudgetCustomerIdResponse) {
    return response.data?.["Order Summary"]?.[0] ?? null;
  }

  extractBudgetDetails(response: OrderFindBudgetCustomerIdResponse) {
    return response.data?.["Order Details"]?.[0] ?? null;
  }

  extractBudgetItems(response: OrderFindBudgetCustomerIdResponse) {
    return response.data?.["Order Items"] ?? [];
  }

  extractBudgetCustomer(response: OrderFindBudgetCustomerIdResponse) {
    return response.data?.["Customer Details"]?.[0] ?? null;
  }

  extractBudgetSeller(response: OrderFindBudgetCustomerIdResponse) {
    return response.data?.["Seller Details"]?.[0] ?? null;
  }

  // === Extractors - Dashboard ===

  extractDashboardSummary(response: OrderFindDashboardCustomerIdResponse) {
    return response.data?.["Order Summary"]?.[0] ?? null;
  }

  extractDashboardDetails(response: OrderFindDashboardCustomerIdResponse) {
    return response.data?.["Order Details"]?.[0] ?? null;
  }

  extractDashboardItems(response: OrderFindDashboardCustomerIdResponse) {
    return response.data?.["Order Items"] ?? [];
  }

  extractDashboardCustomer(response: OrderFindDashboardCustomerIdResponse) {
    return response.data?.["Customer Details"]?.[0] ?? null;
  }

  extractDashboardSeller(response: OrderFindDashboardCustomerIdResponse) {
    return response.data?.["Seller Details"]?.[0] ?? null;
  }

  // === Extractors - Item Quantity ===

  extractItemQt(response: OrderItemFindQtResponse): number {
    return response.data?.["Qt Items"]?.[0]?.QT_ITEMS ?? 0;
  }
}

export const orderB2bServiceApi = new OrderB2bServiceApi();
