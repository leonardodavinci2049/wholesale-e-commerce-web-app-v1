"use server";

import { createLogger } from "@/core/logger";
import {
  getCategories,
  getCategoryBySlug,
} from "@/services/api-main/category/category-web-cached-service";
import {
  getProductBySlug,
  getProducts,
  getProductsByCategory,
  getProductsBySlug,
  getProductsByTaxonomy,
  getProductWithRelated,
  getRelatedProducts,
  type ProductWithRelated,
} from "@/services/api-main/product/product-web-cached-service";
import type { GalleryImage } from "@/types/api-assets";

const logger = createLogger("ProductActions");

/**
 * Check if error is a connection error (expected during build when API is unavailable)
 */
function isConnectionError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes("connection") ||
      message.includes("econnrefused") ||
      message.includes("fetch failed") ||
      message.includes("network")
    );
  }
  return false;
}

/**
 * Fetch all products (cached via 'use cache' in service)
 */
export async function fetchProductsAction(
  params: {
    taxonomyId?: number;
    brandId?: number;
    limit?: number;
    page?: number;
    searchTerm?: string;
    sortCol?: number;
    sortOrd?: number;
    stockOnly?: boolean;
  } = {},
) {
  try {
    return await getProducts(params);
  } catch (error) {
    // Don't log connection errors (expected during build when API is unavailable)
    if (!isConnectionError(error)) {
      logger.error("Failed to fetch products:", error);
    }
    return [];
  }
}

/**
 * Fetch all categories (cached via 'use cache' in service)
 */
export async function fetchCategoriesAction() {
  try {
    return await getCategories();
  } catch (error) {
    if (!isConnectionError(error)) {
      logger.error("Failed to fetch categories:", error);
    }
    return [];
  }
}

/**
 * Fetch a product by its slug (cached via 'use cache' in service)
 */
export async function fetchProductBySlugAction(slug: string[]) {
  try {
    return await getProductBySlug(slug);
  } catch (error) {
    if (!isConnectionError(error)) {
      logger.error("Failed to fetch product by slug:", error);
    }
    return undefined;
  }
}

/**
 * Fetch a product by its slug along with related products
 * Uses a single API call - related products come from data[2] of the API response
 */
export async function fetchProductWithRelatedAction(
  slug: string[],
): Promise<ProductWithRelated | undefined> {
  try {
    return await getProductWithRelated(slug);
  } catch (error) {
    if (!isConnectionError(error)) {
      logger.error("Failed to fetch product with related:", error);
    }
    return undefined;
  }
}

/**
 * Fetch related products (cached via 'use cache' in service)
 */
export async function fetchRelatedProductsAction(
  productId: string,
  taxonomyId: string,
) {
  try {
    return await getRelatedProducts(productId, taxonomyId);
  } catch (error) {
    if (!isConnectionError(error)) {
      logger.error("Failed to fetch related products:", error);
    }
    return [];
  }
}

/**
 * Fetch category by slug (cached via 'use cache' in service)
 */
export async function fetchCategoryBySlugAction(
  categorySlug: string,
  subcategorySlug?: string,
) {
  try {
    return await getCategoryBySlug(categorySlug, subcategorySlug);
  } catch (error) {
    if (!isConnectionError(error)) {
      logger.error("Failed to fetch category by slug:", error);
    }
    return null;
  }
}

/**
 * Fetch products by category (cached via 'use cache' in service)
 */
export async function fetchProductsByCategoryAction(
  categoryId: string,
  subcategoryId?: string,
) {
  try {
    return await getProductsByCategory(categoryId, subcategoryId);
  } catch (error) {
    if (!isConnectionError(error)) {
      logger.error("Failed to fetch products by category:", error);
    }
    return [];
  }
}

/**
 * Fetch products by taxonomy slug (cached via 'use cache' in service)
 */
export async function fetchProductsBySlugAction(
  slugTaxonomy: string,
  limit?: number,
  page?: number,
  sortCol: number = 1,
  sortOrd: number = 1,
) {
  try {
    return await getProductsBySlug(slugTaxonomy, limit, page, sortCol, sortOrd);
  } catch (error) {
    if (!isConnectionError(error)) {
      logger.error("Failed to fetch products by slug:", error);
    }
    return [];
  }
}

/**
 * Fetch products by taxonomy - tries slug first, falls back to ID
 */
export async function fetchProductsByTaxonomyAction(
  slugOrId: string,
  taxonomyId?: number,
  limit?: number,
  page?: number,
  sortCol: number = 1,
  sortOrd: number = 1,
  stockOnly?: boolean,
) {
  try {
    return await getProductsByTaxonomy(
      slugOrId,
      taxonomyId,
      limit,
      page,
      sortCol,
      sortOrd,
      stockOnly,
    );
  } catch (error) {
    if (!isConnectionError(error)) {
      logger.error("Failed to fetch products by taxonomy:", error);
    }
    return [];
  }
}

/**
 * Fetch product image gallery from Assets API (with cache)
 * Delegates to cached service for automatic caching and deduplication
 */
export async function fetchProductGalleryAction(
  productId: string,
): Promise<GalleryImage[]> {
  // Import dynamically to avoid circular dependencies and keep server-only
  const { getProductGallery } = await import(
    "@/services/api-assets/gallery-cached-service"
  );
  return getProductGallery(productId);
}
