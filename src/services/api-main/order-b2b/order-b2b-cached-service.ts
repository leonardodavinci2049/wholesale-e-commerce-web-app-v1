import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { createLogger } from "@/core/logger";
import { CACHE_TAGS } from "@/lib/cache-config";

import { orderB2bServiceApi } from "./order-b2b-service-api";
import {
  transformCustomerEntity,
  transformDetailsEntity,
  transformFindLatestEntity,
  transformItemEntity,
  transformSellerEntity,
  transformStatisticsCustomerEntity,
  transformSummaryEntity,
  type UIOrderB2bCustomer,
  type UIOrderB2bDetails,
  type UIOrderB2bItem,
  type UIOrderB2bSeller,
  type UIOrderB2bSummary,
  type UIOrderFindLatest,
  type UIOrderStatisticsCustomer,
} from "./transformers/transformers";

const logger = createLogger("order-b2b-cached-service");

interface BaseParams {
  pe_user_id?: string;
  pe_user_name?: string;
  pe_user_role?: string;
  pe_person_id?: number;
}

// === Budget ===

export interface UIBudgetOrderDetail {
  summary: UIOrderB2bSummary | null;
  details: UIOrderB2bDetails | null;
  items: UIOrderB2bItem[];
  customer: UIOrderB2bCustomer | null;
  seller: UIOrderB2bSeller | null;
}

export async function getBudgetByCustomerId(
  customerId: number,
  params: BaseParams = {},
): Promise<UIBudgetOrderDetail | undefined> {
  "use cache";
  cacheLife("seconds");
  cacheTag(CACHE_TAGS.orderB2bDetail(String(customerId)), CACHE_TAGS.orderB2b);

  try {
    const response = await orderB2bServiceApi.findBudgetCustomerId({
      pe_customer_id: customerId,
      pe_user_id: params.pe_user_id,
      pe_user_name: params.pe_user_name,
      pe_user_role: params.pe_user_role,
      pe_person_id: params.pe_person_id,
    });

    const summary = orderB2bServiceApi.extractBudgetSummary(response);
    const details = orderB2bServiceApi.extractBudgetDetails(response);
    const items = orderB2bServiceApi.extractBudgetItems(response);
    const customer = orderB2bServiceApi.extractBudgetCustomer(response);
    const seller = orderB2bServiceApi.extractBudgetSeller(response);

    return {
      summary: summary ? transformSummaryEntity(summary) : null,
      details: details ? transformDetailsEntity(details) : null,
      items: items.map(transformItemEntity),
      customer: customer ? transformCustomerEntity(customer) : null,
      seller: seller ? transformSellerEntity(seller) : null,
    };
  } catch (error) {
    logger.error(
      `Erro ao buscar orçamento para customer ID ${customerId}:`,
      error,
    );
    throw error;
  }
}

// === Dashboard ===

export interface UIDashboardOrderDetail {
  summary: UIOrderB2bSummary | null;
  details: UIOrderB2bDetails | null;
  items: UIOrderB2bItem[];
  customer: UIOrderB2bCustomer | null;
  seller: UIOrderB2bSeller | null;
}

export async function getDashboardByCustomerId(
  customerId: number,
  params: BaseParams & { orderId?: number } = {},
): Promise<UIDashboardOrderDetail | undefined> {
  "use cache";
  cacheLife("seconds");
  cacheTag(CACHE_TAGS.orderB2bDetail(String(customerId)), CACHE_TAGS.orderB2b);

  try {
    const response = await orderB2bServiceApi.findDashboardCustomerId({
      pe_order_id: params.orderId ?? 0,
      pe_customer_id: customerId,
      pe_user_id: params.pe_user_id,
      pe_user_name: params.pe_user_name,
      pe_user_role: params.pe_user_role,
      pe_person_id: params.pe_person_id,
    });

    const summary = orderB2bServiceApi.extractDashboardSummary(response);
    const details = orderB2bServiceApi.extractDashboardDetails(response);
    const items = orderB2bServiceApi.extractDashboardItems(response);
    const customer = orderB2bServiceApi.extractDashboardCustomer(response);
    const seller = orderB2bServiceApi.extractDashboardSeller(response);

    return {
      summary: summary ? transformSummaryEntity(summary) : null,
      details: details ? transformDetailsEntity(details) : null,
      items: items.map(transformItemEntity),
      customer: customer ? transformCustomerEntity(customer) : null,
      seller: seller ? transformSellerEntity(seller) : null,
    };
  } catch (error) {
    logger.error(
      `Erro ao buscar dashboard para customer ID ${customerId}:`,
      error,
    );
    throw error;
  }
}

// === Item Quantity ===

export async function getOrderItemQt(
  customerId: number,
  params: BaseParams = {},
): Promise<number> {
  "use cache";
  cacheLife("seconds");
  cacheTag(CACHE_TAGS.orderB2bDetail(String(customerId)), CACHE_TAGS.orderB2b);

  try {
    const response = await orderB2bServiceApi.findItemQt({
      pe_customer_id: customerId,
      pe_user_id: params.pe_user_id,
      pe_user_name: params.pe_user_name,
      pe_user_role: params.pe_user_role,
      pe_person_id: params.pe_person_id,
    });

    return orderB2bServiceApi.extractItemQt(response);
  } catch (error) {
    logger.error(
      `Erro ao buscar quantidade de itens para customer ID ${customerId}:`,
      error,
    );
    throw error;
  }
}

// === Find Latest ===

export async function getOrderFindLatest(
  customerId: number,
  params: BaseParams = {},
): Promise<UIOrderFindLatest[]> {
  "use cache";
  cacheLife("seconds");
  cacheTag(CACHE_TAGS.orderB2bDetail(String(customerId)), CACHE_TAGS.orderB2b);

  try {
    const response = await orderB2bServiceApi.findLatest({
      pe_customer_id: customerId,
      pe_user_id: params.pe_user_id,
      pe_user_name: params.pe_user_name,
      pe_user_role: params.pe_user_role,
      pe_person_id: params.pe_person_id,
    });

    const entities = orderB2bServiceApi.extractFindLatest(response);
    return entities.map(transformFindLatestEntity);
  } catch (error) {
    logger.error(
      `Erro ao buscar últimos pedidos para customer ID ${customerId}:`,
      error,
    );
    throw error;
  }
}

// === Statistics Customer ===

export async function getOrderStatisticsCustomer(
  customerId: number,
  params: BaseParams = {},
): Promise<UIOrderStatisticsCustomer | null> {
  "use cache";
  cacheLife("seconds");
  cacheTag(CACHE_TAGS.orderB2bDetail(String(customerId)), CACHE_TAGS.orderB2b);

  try {
    const response = await orderB2bServiceApi.statisticsCustomer({
      pe_customer_id: customerId,
      pe_user_id: params.pe_user_id,
      pe_user_name: params.pe_user_name,
      pe_user_role: params.pe_user_role,
      pe_person_id: params.pe_person_id,
    });

    const entity = orderB2bServiceApi.extractStatisticsCustomer(response);
    return entity ? transformStatisticsCustomerEntity(entity) : null;
  } catch (error) {
    logger.error(
      `Erro ao buscar estatísticas de pedidos para customer ID ${customerId}:`,
      error,
    );
    throw error;
  }
}
