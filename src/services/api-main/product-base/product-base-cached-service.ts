import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { createLogger } from "@/core/logger";
import { CACHE_TAGS } from "@/lib/cache-config";

import { productBaseServiceApi } from "./product-base-service-api";
import {
  transformProductDetail,
  transformProductList,
  transformProductSearchList,
  type UIProduct,
  type UIProductDetail,
} from "./transformers/transformers";

const logger = createLogger("product-base-cached-service");

export async function getProducts(
  params: {
    search?: string;
    taxonomyId?: number;
    typeId?: number;
    brandId?: number;
    flagStock?: number;
    flagService?: number;
    recordsQuantity?: number;
    pageId?: number;
    columnId?: number;
    orderId?: number;
    pe_user_id?: string;
    pe_user_name?: string;
    pe_user_role?: string;
    pe_person_id?: number;
  } = {},
): Promise<UIProduct[]> {
  "use cache";
  cacheLife("seconds");
  cacheTag(CACHE_TAGS.productsBase);

  try {
    const response = await productBaseServiceApi.findAllProducts({
      pe_search: params.search,
      pe_taxonomy_id: params.taxonomyId,
      pe_type_id: params.typeId,
      pe_brand_id: params.brandId,
      pe_flag_stock: params.flagStock,
      pe_flag_service: params.flagService,
      pe_records_quantity: params.recordsQuantity,
      pe_page_id: params.pageId,
      pe_column_id: params.columnId,
      pe_order_id: params.orderId,
      pe_user_id: params.pe_user_id,
      pe_user_name: params.pe_user_name,
      pe_user_role: params.pe_user_role,
      pe_person_id: params.pe_person_id,
    });

    const products = productBaseServiceApi.extractProducts(response);
    return transformProductList(products);
  } catch (error) {
    logger.error("Erro ao buscar produtos:", error);
    throw error;
  }
}

export async function getPremiumProducts(
  params: {
    search?: string;
    taxonomyId?: number;
    typeId?: number;
    brandId?: number;
    stockFlag?: number;
    flagService?: number;
    flagPromotions?: number;
    flagHighlight?: number;
    flagLaunch?: number;
    recordsQuantity?: number;
    pageId?: number;
    columnId?: number;
    orderId?: number;
    pe_user_id?: string;
    pe_user_name?: string;
    pe_user_role?: string;
    pe_person_id?: number;
  } = {},
): Promise<UIProduct[]> {
  "use cache";
  cacheLife("seconds");
  cacheTag(CACHE_TAGS.productsBasePremium);

  try {
    const response = await productBaseServiceApi.findPremiumProducts({
      pe_search: params.search,
      pe_taxonomy_id: params.taxonomyId,
      pe_type_id: params.typeId,
      pe_brand_id: params.brandId,
      pe_stock_flag: params.stockFlag,
      pe_flag_service: params.flagService,
      pe_flag_promotions: params.flagPromotions,
      pe_flag_highlight: params.flagHighlight,
      pe_flag_launch: params.flagLaunch,
      pe_records_quantity: params.recordsQuantity,
      pe_page_id: params.pageId,
      pe_column_id: params.columnId,
      pe_order_id: params.orderId,
      pe_user_id: params.pe_user_id,
      pe_user_name: params.pe_user_name,
      pe_user_role: params.pe_user_role,
      pe_person_id: params.pe_person_id,
    });

    const products = productBaseServiceApi.extractPremiumProducts(response);
    return transformProductList(products);
  } catch (error) {
    logger.error("Erro ao buscar produtos premium:", error);
    throw error;
  }
}

export async function searchProducts(params: {
  search: string;
  customerId?: number;
  flagStock?: number;
  recordsQuantity?: number;
  pe_user_id?: string;
  pe_user_name?: string;
  pe_user_role?: string;
  pe_person_id?: number;
}): Promise<UIProduct[]> {
  "use cache";
  cacheLife("seconds");
  cacheTag(CACHE_TAGS.productsBase);

  try {
    const response = await productBaseServiceApi.searchAllProducts({
      pe_search: params.search,
      pe_customer_id: params.customerId,
      pe_flag_stock: params.flagStock,
      pe_records_quantity: params.recordsQuantity,
      pe_user_id: params.pe_user_id,
      pe_user_name: params.pe_user_name,
      pe_user_role: params.pe_user_role,
      pe_person_id: params.pe_person_id,
    });

    const products = productBaseServiceApi.extractSearchProducts(response);
    return transformProductSearchList(products);
  } catch (error) {
    logger.error("Erro ao pesquisar produtos:", error);
    throw error;
  }
}

export async function getProductById(
  id: number,
  params: {
    pe_user_id?: string;
    pe_user_name?: string;
    pe_user_role?: string;
    pe_person_id?: number;
  } = {},
): Promise<UIProductDetail | undefined> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.productBase(String(id)), CACHE_TAGS.productsBase);

  try {
    const response = await productBaseServiceApi.findProductById({
      pe_product_id: id,
      pe_user_id: params.pe_user_id,
      pe_user_name: params.pe_user_name,
      pe_user_role: params.pe_user_role,
      pe_person_id: params.pe_person_id,
    });

    const product = productBaseServiceApi.extractProductById(response);
    if (!product) {
      return undefined;
    }

    const categories = productBaseServiceApi.extractProductCategories(response);
    const related = productBaseServiceApi.extractProductRelated(response);

    return transformProductDetail(product, categories, related);
  } catch (error) {
    logger.error(`Erro ao buscar produto por ID ${id}:`, error);
    throw error;
  }
}
