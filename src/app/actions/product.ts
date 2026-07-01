"use server";

import { createLogger } from "@/core/logger";
import {
  findCategoryBySlug,
  transformCategoryMenu,
  transformProductDetail,
  transformProductList,
  transformRelatedProducts,
  type UIProduct,
  type UITaxonomyItem,
} from "@/lib/transformers";
import { CategoryServiceApi } from "@/services/api-main/category";
import { ProductWebServiceApi } from "@/services/api-main/product";
import type { ProductWebFindByIdResponse } from "@/services/api-main/product/types/product-types";
import { ProductWebNotFoundError } from "@/services/api-main/product/types/product-types";
import type { GalleryImage } from "@/types/api-assets";

const logger = createLogger("ProductActions");
const CATEGORY_MENU_TYPE_ID = 1;
const CATEGORY_PARENT_ID = 0;

interface ProductSlugResolution {
  fullSlug: string;
  productId: number;
}

export interface ProductWithRelated {
  product: UIProduct;
  relatedProducts: UIProduct[];
}

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

async function getCategories() {
  const response = await CategoryServiceApi.findMenu({
    pe_id_tipo: CATEGORY_MENU_TYPE_ID,
    pe_parent_id: CATEGORY_PARENT_ID,
  });

  return transformCategoryMenu(CategoryServiceApi.extractCategories(response));
}

async function getCategoryBySlug(
  categorySlug: string,
  subcategorySlug?: string,
) {
  const categories = await getCategories();
  return findCategoryBySlug(categories, categorySlug, subcategorySlug);
}

function resolveProductSlug(slug: string[]): ProductSlugResolution | undefined {
  const fullSlug = slug.join("/").replace(/^\/+|\/+$/g, "");

  if (!fullSlug) {
    return undefined;
  }

  const lastSegment = fullSlug.split("-").at(-1);
  const productId =
    lastSegment && /^\d+$/.test(lastSegment)
      ? Number.parseInt(lastSegment, 10)
      : 0;

  return {
    fullSlug,
    productId: productId > 0 ? productId : 0,
  };
}

function normalizeSlugForCompare(value: string | null | undefined): string {
  return (value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isCloseSlugMatch(
  requestedSlug: string,
  candidateSlug: string,
): boolean {
  const requested = normalizeSlugForCompare(requestedSlug);
  const candidate = normalizeSlugForCompare(candidateSlug);

  if (!requested || !candidate) {
    return false;
  }

  if (requested === candidate) {
    return true;
  }

  return (
    (candidate.startsWith(requested) &&
      candidate.length - requested.length <= 5) ||
    (requested.startsWith(candidate) &&
      requested.length - candidate.length <= 5)
  );
}

async function findProductResponseBySlugFallback(
  resolution: ProductSlugResolution,
): Promise<ProductWebFindByIdResponse | undefined> {
  if (resolution.productId > 0) {
    return undefined;
  }

  const searchTerm = resolution.fullSlug.replace(/-/g, " ");
  const searchResponse = await ProductWebServiceApi.findProducts({
    pe_produto: searchTerm,
    pe_qt_registros: 10,
    pe_pagina_id: 0,
  });
  const candidates = ProductWebServiceApi.extractProductList(searchResponse);
  const candidate = candidates.find(
    (product) =>
      product.ID_PRODUTO > 0 &&
      product.SLUG &&
      isCloseSlugMatch(resolution.fullSlug, product.SLUG),
  );

  if (!candidate) {
    return undefined;
  }

  return ProductWebServiceApi.findProductById({
    pe_id_produto: candidate.ID_PRODUTO,
    pe_slug_produto: candidate.SLUG ?? resolution.fullSlug,
  });
}

async function findProductResponseByResolution(
  resolution: ProductSlugResolution,
): Promise<ProductWebFindByIdResponse | undefined> {
  try {
    return await ProductWebServiceApi.findProductById({
      pe_id_produto: resolution.productId,
      pe_slug_produto: resolution.fullSlug,
    });
  } catch (error) {
    if (error instanceof ProductWebNotFoundError) {
      return findProductResponseBySlugFallback(resolution);
    }

    throw error;
  }
}

/**
 * Fetch all products
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
    const response = await ProductWebServiceApi.findProducts({
      pe_id_taxonomy: params.taxonomyId ?? 0,
      pe_id_marca: params.brandId ?? 0,
      pe_qt_registros: params.limit ?? 100,
      pe_pagina_id: Math.max(0, (params.page ?? 1) - 1),
      pe_produto: params.searchTerm ?? "",
      pe_coluna_id: params.sortCol ?? 1,
      pe_ordem_id: params.sortOrd ?? 1,
      pe_flag_estoque: params.stockOnly ? 1 : 0,
    });

    return transformProductList(
      ProductWebServiceApi.extractProductList(response),
    );
  } catch (error) {
    // Don't log connection errors (expected during build when API is unavailable)
    if (!isConnectionError(error)) {
      logger.error("Failed to fetch products:", error);
    }
    return [];
  }
}

/**
 * Fetch all categories
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
 * Fetch a product by its slug
 */
export async function fetchProductBySlugAction(slug: string[]) {
  try {
    const resolution = resolveProductSlug(slug);

    if (!resolution) {
      logger.error("Invalid empty product slug");
      return undefined;
    }

    const response = await findProductResponseByResolution(resolution);
    if (!response) {
      return undefined;
    }

    const product = ProductWebServiceApi.extractProduct(response);
    return product ? transformProductDetail(product) : undefined;
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
    const resolution = resolveProductSlug(slug);

    if (!resolution) {
      logger.error("Invalid empty product slug");
      return undefined;
    }

    const response = await findProductResponseByResolution(resolution);
    if (!response) {
      return undefined;
    }

    const product = ProductWebServiceApi.extractProduct(response);
    if (!product) {
      return undefined;
    }

    const taxonomy: UITaxonomyItem[] = ProductWebServiceApi.extractTaxonomies(
      response,
    )
      .filter((t) => t.TAXONOMIA && t.ID_TAXONOMY)
      .sort((a, b) => (a.LEVEL ?? 0) - (b.LEVEL ?? 0))
      .map((t) => ({
        id: String(t.ID_TAXONOMY),
        name: t.TAXONOMIA as string,
        slug: t.SLUG || "",
        level: t.LEVEL ?? 0,
      }));

    const relatedProducts = transformRelatedProducts(
      ProductWebServiceApi.extractRelatedProducts(response),
    ).filter((p) => p.id !== String(product.ID_PRODUTO));
    const transformedProduct = transformProductDetail(product);

    return {
      product: { ...transformedProduct, taxonomy },
      relatedProducts,
    };
  } catch (error) {
    if (!isConnectionError(error)) {
      logger.error("Failed to fetch product with related:", error);
    }
    return undefined;
  }
}

/**
 * Fetch related products
 */
export async function fetchRelatedProductsAction(
  productId: string,
  taxonomyId: string,
) {
  try {
    const parsedTaxonomyId = Number.parseInt(taxonomyId, 10);
    if (Number.isNaN(parsedTaxonomyId) || parsedTaxonomyId <= 0) {
      return [];
    }

    const response = await ProductWebServiceApi.findProducts({
      pe_id_taxonomy: parsedTaxonomyId,
      pe_qt_registros: 10,
    });

    return transformProductList(
      ProductWebServiceApi.extractProductList(response),
    ).filter((p) => p.id !== productId);
  } catch (error) {
    if (!isConnectionError(error)) {
      logger.error("Failed to fetch related products:", error);
    }
    return [];
  }
}

/**
 * Fetch category by slug
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
 * Fetch products by category
 */
export async function fetchProductsByCategoryAction(
  categoryId: string,
  subcategoryId?: string,
) {
  try {
    const idToUse = subcategoryId || categoryId;
    const taxonomyId = Number.parseInt(idToUse, 10);

    if (Number.isNaN(taxonomyId) || taxonomyId <= 0) {
      logger.warn(`Invalid categoryId/subcategoryId: ${idToUse}`);
      return [];
    }

    const response = await ProductWebServiceApi.findProducts({
      pe_id_taxonomy: taxonomyId,
      pe_qt_registros: 30,
    });

    return transformProductList(
      ProductWebServiceApi.extractProductList(response),
    );
  } catch (error) {
    if (!isConnectionError(error)) {
      logger.error("Failed to fetch products by category:", error);
    }
    return [];
  }
}

/**
 * Fetch products by taxonomy slug
 */
export async function fetchProductsBySlugAction(
  slugTaxonomy: string,
  limit?: number,
  page?: number,
  sortCol: number = 1,
  sortOrd: number = 1,
) {
  try {
    const response = await ProductWebServiceApi.findProducts({
      pe_slug_taxonomy: slugTaxonomy,
      pe_qt_registros: limit,
      pe_pagina_id: Math.max(0, (page ?? 1) - 1),
      pe_coluna_id: sortCol,
      pe_ordem_id: sortOrd,
    });

    return transformProductList(
      ProductWebServiceApi.extractProductList(response),
    );
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
    const stockFlag = stockOnly ? 1 : 0;
    const hasValidTaxonomyId = taxonomyId !== undefined && taxonomyId > 0;

    const response = await ProductWebServiceApi.findProducts({
      pe_id_taxonomy: hasValidTaxonomyId ? taxonomyId : 0,
      pe_slug_taxonomy: hasValidTaxonomyId ? "" : slugOrId,
      pe_qt_registros: limit,
      pe_pagina_id: Math.max(0, (page ?? 1) - 1),
      pe_coluna_id: sortCol,
      pe_ordem_id: sortOrd,
      pe_flag_estoque: stockFlag,
    });
    const products = ProductWebServiceApi.extractProductList(response);

    if (products.length === 0) {
      logger.info(
        `No products found for taxonomy: ${slugOrId} (ID: ${taxonomyId ?? "n/a"})`,
      );
      return [];
    }

    return transformProductList(products);
  } catch (error) {
    if (!isConnectionError(error)) {
      logger.error("Failed to fetch products by taxonomy:", error);
    }
    return [];
  }
}

/**
 * Fetch product image gallery from Assets API
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
