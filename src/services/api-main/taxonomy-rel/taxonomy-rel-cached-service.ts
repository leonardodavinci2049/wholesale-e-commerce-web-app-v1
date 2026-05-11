import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { createLogger } from "@/core/logger";
import { CACHE_TAGS } from "@/lib/cache-config";

import { taxonomyRelServiceApi } from "./taxonomy-rel-service-api";
import {
  transformTaxonomyRelProductList,
  type UITaxonomyRelProduct,
} from "./transformers/transformers";

const logger = createLogger("taxonomy-rel-cached-service");

export async function getProductsByTaxonomy(
  taxonomyId: number,
  params: {
    pe_user_id?: string;
    pe_user_name?: string;
    pe_user_role?: string;
    pe_person_id?: number;
  } = {},
): Promise<UITaxonomyRelProduct[]> {
  "use cache";
  cacheLife("seconds");
  cacheTag(
    CACHE_TAGS.taxonomyRelProduct(String(taxonomyId)),
    CACHE_TAGS.taxonomyRelProducts,
  );

  try {
    const response = await taxonomyRelServiceApi.findAllProductsByTaxonomy({
      pe_record_id: taxonomyId,
      pe_user_id: params.pe_user_id,
      pe_user_name: params.pe_user_name,
      pe_user_role: params.pe_user_role,
      pe_person_id: params.pe_person_id,
    });

    const products = taxonomyRelServiceApi.extractProducts(response);
    return transformTaxonomyRelProductList(products);
  } catch (error) {
    logger.error("Erro ao buscar produtos por taxonomia:", error);
    throw error;
  }
}
