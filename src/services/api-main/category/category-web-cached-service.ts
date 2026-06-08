import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { createLogger } from "@/core/logger";
import { CACHE_TAGS } from "@/lib/cache-config";
import {
  type CategoryLookupResult,
  findCategoryBySlug,
  transformCategoryMenu,
  type UICategory,
  type UISubcategory,
} from "@/lib/transformers";
import { CategoryServiceApi } from "./category-service-api";
import type {
  TblTaxonomyFindById,
  TblTaxonomyRelated,
} from "./types/category-types";

const logger = createLogger("CategoryWebCachedService");

const CATEGORY_MENU_TYPE_ID = 1;
const CATEGORY_PARENT_ID = 0;

export interface CategoryDetailsWithRelated {
  detail: TblTaxonomyFindById | null;
  relatedCategories: TblTaxonomyRelated[];
}

function findSubcategoryIdBySlug(
  subcategories: UISubcategory[] | undefined,
  taxonomySlug: string,
): string | null {
  if (!subcategories) {
    return null;
  }

  for (const subcategory of subcategories) {
    if (subcategory.slug === taxonomySlug) {
      return subcategory.id;
    }

    const childId = findSubcategoryIdBySlug(subcategory.children, taxonomySlug);
    if (childId) {
      return childId;
    }
  }

  return null;
}

function findTaxonomyIdBySlug(
  categories: UICategory[],
  taxonomySlug: string,
): string | null {
  for (const category of categories) {
    if (category.slug === taxonomySlug) {
      return category.id;
    }

    const subcategoryId = findSubcategoryIdBySlug(
      category.subcategories,
      taxonomySlug,
    );
    if (subcategoryId) {
      return subcategoryId;
    }
  }

  return null;
}

/**
 * Busca o menu hierárquico de categorias com cache.
 */
export async function getCategories(): Promise<UICategory[]> {
  "use cache";
  cacheLife("quarter");
  cacheTag(CACHE_TAGS.categories, CACHE_TAGS.navigation);

  try {
    const response = await CategoryServiceApi.findMenu({
      pe_id_tipo: CATEGORY_MENU_TYPE_ID,
      pe_parent_id: CATEGORY_PARENT_ID,
    });

    const menu = CategoryServiceApi.extractCategories(response);

    if (menu.length === 0) {
      logger.warn("No categories found in menu response");
    }

    return transformCategoryMenu(menu);
  } catch (error) {
    logger.error("Failed to fetch categories:", error);
    return [];
  }
}

/**
 * Busca uma categoria pelo slug dentro do menu hierárquico em cache.
 */
export async function getCategoryBySlug(
  categorySlug: string,
  subcategorySlug?: string,
): Promise<CategoryLookupResult | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.categories);

  try {
    const categories = await getCategories();
    return findCategoryBySlug(categories, categorySlug, subcategorySlug);
  } catch (error) {
    logger.error("Failed to fetch category by slug:", error);
    return null;
  }
}

/**
 * Busca detalhes e categorias relacionadas de uma taxonomia por ID com cache.
 */
export async function getCategoryDetailsWithRelatedById(
  taxonomyId: number | string,
): Promise<CategoryDetailsWithRelated> {
  "use cache";
  cacheLife("hours");

  const normalizedId =
    typeof taxonomyId === "number"
      ? taxonomyId
      : Number.parseInt(taxonomyId, 10);

  if (Number.isNaN(normalizedId) || normalizedId <= 0) {
    logger.warn(`Invalid taxonomy ID: ${String(taxonomyId)}`);
    return {
      detail: null,
      relatedCategories: [],
    };
  }

  cacheTag(CACHE_TAGS.categories, CACHE_TAGS.category(String(normalizedId)));

  try {
    const response = await CategoryServiceApi.findByIdOrSlug({
      pe_taxonomy_id: normalizedId,
    });

    return {
      detail: CategoryServiceApi.extractCategoryDetails(response),
      relatedCategories: CategoryServiceApi.extractRelatedCategories(response),
    };
  } catch (error) {
    logger.error(
      `Failed to fetch category details by ID ${normalizedId}:`,
      error,
    );
    return {
      detail: null,
      relatedCategories: [],
    };
  }
}

/**
 * Busca detalhes de uma taxonomia por ID com cache.
 */
export async function getCategoryDetailsById(
  taxonomyId: number | string,
): Promise<TblTaxonomyFindById | null> {
  const result = await getCategoryDetailsWithRelatedById(taxonomyId);
  return result.detail;
}

/**
 * Busca detalhes e categorias relacionadas de uma taxonomia por slug com cache.
 */
export async function getCategoryDetailsWithRelatedBySlug(
  taxonomySlug: string,
): Promise<CategoryDetailsWithRelated> {
  "use cache";
  cacheLife("hours");

  const normalizedSlug = taxonomySlug.trim();

  if (normalizedSlug.length === 0) {
    logger.warn("Invalid taxonomy slug: empty value");
    return {
      detail: null,
      relatedCategories: [],
    };
  }

  cacheTag(CACHE_TAGS.categories, CACHE_TAGS.category(normalizedSlug));

  try {
    const categories = await getCategories();
    const taxonomyId = findTaxonomyIdBySlug(categories, normalizedSlug);

    if (!taxonomyId) {
      logger.warn(`Category slug not found in cached menu: ${normalizedSlug}`);
      return {
        detail: null,
        relatedCategories: [],
      };
    }

    return getCategoryDetailsWithRelatedById(taxonomyId);
  } catch (error) {
    logger.error(
      `Failed to fetch category details by slug ${normalizedSlug}:`,
      error,
    );
    return {
      detail: null,
      relatedCategories: [],
    };
  }
}

/**
 * Busca detalhes de uma taxonomia por slug com cache.
 */
export async function getCategoryDetailsBySlug(
  taxonomySlug: string,
): Promise<TblTaxonomyFindById | null> {
  const result = await getCategoryDetailsWithRelatedBySlug(taxonomySlug);
  return result.detail;
}
