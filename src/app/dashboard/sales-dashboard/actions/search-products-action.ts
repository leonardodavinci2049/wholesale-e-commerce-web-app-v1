"use server";

import { createLogger } from "@/core/logger";
import { getAuthContext } from "@/server/auth-context";
import { productPdvServiceApi } from "@/services/api-main/product-pdv";
import {
  transformProductPdvSearchList,
  type UIProductPdv,
} from "@/services/api-main/product-pdv/transformers/transformers";

const logger = createLogger("sales-dashboard-search-products-action");

export async function searchProductsAction(
  search: string,
): Promise<UIProductPdv[]> {
  try {
    const { apiContext } = await getAuthContext();

    const response = await productPdvServiceApi.findProductsPdvSearch({
      pe_search: search || undefined,
      pe_customer_id: 0,
      pe_flag_stock: 0,
      pe_limit: 20,
      ...apiContext,
    });

    return transformProductPdvSearchList(
      productPdvServiceApi.extractProductsPdvSearch(response),
    );
  } catch (error) {
    logger.error("Erro ao buscar produtos", error);
    return [];
  }
}
