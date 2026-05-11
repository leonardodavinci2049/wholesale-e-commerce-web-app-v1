import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { createLogger } from "@/core/logger";
import { CACHE_TAGS } from "@/lib/cache-config";

import { brandServiceApi } from "./brand-service-api";
import {
  transformBrand,
  transformBrandList,
  type UIBrand,
} from "./transformers/transformers";

const logger = createLogger("brand-cached-service");

export async function getBrands(
  params: {
    search?: string;
    inactive?: number;
    limit?: number;
    pe_user_id?: string;
    pe_user_name?: string;
    pe_user_role?: string;
    pe_person_id?: number;
  } = {},
): Promise<UIBrand[]> {
  "use cache";
  cacheLife("quarter");
  cacheTag(CACHE_TAGS.brands);

  try {
    const response = await brandServiceApi.findAllBrands({
      pe_search: params.search,
      pe_inactive: params.inactive,
      pe_limit: params.limit,
      pe_user_id: params.pe_user_id,
      pe_user_name: params.pe_user_name,
      pe_user_role: params.pe_user_role,
      pe_person_id: params.pe_person_id,
    });

    const brands = brandServiceApi.extractBrands(response);
    return transformBrandList(brands);
  } catch (error) {
    logger.error("Erro ao buscar marcas:", error);
    throw error;
  }
}

export async function getBrandById(
  id: number,
  params: {
    pe_user_id?: string;
    pe_user_name?: string;
    pe_user_role?: string;
    pe_person_id?: number;
  } = {},
): Promise<UIBrand | undefined> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.brand(String(id)), CACHE_TAGS.brands);

  try {
    const response = await brandServiceApi.findBrandById({
      pe_brand_id: id,
      pe_user_id: params.pe_user_id,
      pe_user_name: params.pe_user_name,
      pe_user_role: params.pe_user_role,
      pe_person_id: params.pe_person_id,
    });

    const brand = brandServiceApi.extractBrandById(response);
    if (!brand) {
      return undefined;
    }

    return transformBrand(brand) ?? undefined;
  } catch (error) {
    logger.error(`Erro ao buscar marca por ID ${id}:`, error);
    throw error;
  }
}
