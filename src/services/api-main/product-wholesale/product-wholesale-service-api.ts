import "server-only";

import { serverEnvs } from "@/core/config/envs.server";
import {
  API_STATUS_CODES,
  isApiError,
  isApiSuccess,
  PRODUCT_WHOLESALE_ENDPOINTS,
} from "@/core/constants/api-constants";
import { createLogger } from "@/core/logger";
import { BaseApiService } from "@/lib/axios/base-api-service";

import type {
  ProductWholesaleDetail,
  ProductWholesaleFindAllRequest,
  ProductWholesaleFindAllResponse,
  ProductWholesaleFindByIdRequest,
  ProductWholesaleFindByIdResponse,
  ProductWholesaleListItem,
  ProductWholesaleRelatedCategory,
  ProductWholesaleRelatedProduct,
  ProductWholesaleSectionsRequest,
  ProductWholesaleSectionsResponse,
} from "./types/product-wholesale-types";
import {
  ProductWholesaleError,
  ProductWholesaleNotFoundError,
} from "./types/product-wholesale-types";
import {
  ProductWholesaleFindAllSchema,
  ProductWholesaleFindByIdSchema,
  ProductWholesaleSectionsSchema,
} from "./validation/product-wholesale-schemas";

const logger = createLogger("ProductWholesaleServiceApi");

export class ProductWholesaleServiceApi extends BaseApiService {
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

  async findAllProductsWholesale(
    params: Partial<ProductWholesaleFindAllRequest> = {},
  ): Promise<ProductWholesaleFindAllResponse> {
    try {
      const validatedParams =
        ProductWholesaleFindAllSchema.partial().parse(params);
      const requestBody = this.buildBasePayload({
        pe_user_id: validatedParams.pe_user_id,
        pe_user_name: validatedParams.pe_user_name,
        pe_user_role: validatedParams.pe_user_role,
        pe_person_id: validatedParams.pe_person_id,
        pe_customer_id: validatedParams.pe_customer_id ?? 0,
        pe_search: validatedParams.pe_search ?? "",
        pe_taxonomy_id: validatedParams.pe_taxonomy_id ?? 0,
        pe_brand_id: validatedParams.pe_brand_id ?? 0,
        pe_stock_flag: validatedParams.pe_stock_flag ?? 0,
        pe_qt_records: validatedParams.pe_qt_records ?? 100,
        pe_page_id: validatedParams.pe_page_id ?? 0,
        pe_column_id: validatedParams.pe_column_id ?? 1,
        pe_order_id: validatedParams.pe_order_id ?? 2,
      });

      const response = await this.post<ProductWholesaleFindAllResponse>(
        PRODUCT_WHOLESALE_ENDPOINTS.FIND_ALL,
        requestBody,
      );

      return this.normalizeEmptyFindAllResponse(response);
    } catch (error) {
      logger.error("Erro ao buscar todos os produtos atacado", error);
      throw error;
    }
  }

  async findProductWholesaleById(
    params: ProductWholesaleFindByIdRequest,
  ): Promise<ProductWholesaleFindByIdResponse> {
    try {
      const validatedParams = ProductWholesaleFindByIdSchema.parse(params);
      const requestBody = this.buildBasePayload({
        ...validatedParams,
        pe_customer_id: validatedParams.pe_customer_id ?? 0,
        pe_product_id: validatedParams.pe_product_id ?? 0,
        pe_product_slug: validatedParams.pe_product_slug ?? "",
      });

      const response = await this.post<ProductWholesaleFindByIdResponse>(
        PRODUCT_WHOLESALE_ENDPOINTS.FIND_BY_ID,
        requestBody,
      );

      if (response.statusCode === API_STATUS_CODES.NOT_FOUND) {
        throw new ProductWholesaleNotFoundError(validatedParams);
      }

      if (isApiError(response.statusCode)) {
        throw new ProductWholesaleError(
          response.message || "Erro ao buscar produto atacado por ID",
          "PRODUCT_WHOLESALE_FIND_BY_ID_ERROR",
          response.statusCode,
        );
      }

      return response;
    } catch (error) {
      logger.error("Erro ao buscar produto atacado por ID", error);
      throw error;
    }
  }

  async findProductsWholesaleSections(
    params: Partial<ProductWholesaleSectionsRequest> = {},
  ): Promise<ProductWholesaleSectionsResponse> {
    try {
      const validatedParams =
        ProductWholesaleSectionsSchema.partial().parse(params);
      const requestBody = this.buildBasePayload({
        pe_user_id: validatedParams.pe_user_id,
        pe_user_name: validatedParams.pe_user_name,
        pe_user_role: validatedParams.pe_user_role,
        pe_person_id: validatedParams.pe_person_id,
        pe_customer_id: validatedParams.pe_customer_id ?? 0,
        pe_taxonomy_id: validatedParams.pe_taxonomy_id ?? 0,
        pe_brand_id: validatedParams.pe_brand_id ?? 0,
        pe_type_id: validatedParams.pe_type_id ?? 0,
        pe_promotion_flag: validatedParams.pe_promotion_flag ?? 0,
        pe_highlight_flag: validatedParams.pe_highlight_flag ?? 0,
        pe_launch_flag: validatedParams.pe_launch_flag ?? 0,
        pe_limit: validatedParams.pe_limit ?? 10,
      });

      const response = await this.post<ProductWholesaleSectionsResponse>(
        PRODUCT_WHOLESALE_ENDPOINTS.SECTIONS,
        requestBody,
      );

      return this.normalizeEmptySectionsResponse(response);
    } catch (error) {
      logger.error("Erro ao buscar seções de produtos atacado", error);
      throw error;
    }
  }

  private normalizeEmptyFindAllResponse(
    response: ProductWholesaleFindAllResponse,
  ): ProductWholesaleFindAllResponse {
    if (
      response.statusCode === API_STATUS_CODES.NOT_FOUND ||
      response.statusCode === API_STATUS_CODES.EMPTY_RESULT
    ) {
      return {
        ...response,
        statusCode: API_STATUS_CODES.SUCCESS,
        quantity: 0,
        data: {
          "Product List": [],
        },
      };
    }
    return response;
  }

  private normalizeEmptySectionsResponse(
    response: ProductWholesaleSectionsResponse,
  ): ProductWholesaleSectionsResponse {
    if (
      response.statusCode === API_STATUS_CODES.NOT_FOUND ||
      response.statusCode === API_STATUS_CODES.EMPTY_RESULT
    ) {
      return {
        ...response,
        statusCode: API_STATUS_CODES.SUCCESS,
        quantity: 0,
        data: {
          "Product Sections": [],
        },
      };
    }
    return response;
  }

  extractProductsWholesale(
    response: ProductWholesaleFindAllResponse,
  ): ProductWholesaleListItem[] {
    return response.data?.["Product List"] ?? [];
  }

  extractProductsWholesaleSections(
    response: ProductWholesaleSectionsResponse,
  ): ProductWholesaleListItem[] {
    return response.data?.["Product Sections"] ?? [];
  }

  extractProductWholesaleById(
    response: ProductWholesaleFindByIdResponse,
  ): ProductWholesaleDetail | null {
    return response.data?.["Product Details"]?.[0] ?? null;
  }

  extractRelatedCategories(
    response: ProductWholesaleFindByIdResponse,
  ): ProductWholesaleRelatedCategory[] {
    return response.data?.["Category Related"] ?? [];
  }

  extractRelatedProducts(
    response: ProductWholesaleFindByIdResponse,
  ): ProductWholesaleRelatedProduct[] {
    return response.data?.["Related Products"] ?? [];
  }

  isValidProductWholesaleList(
    response: ProductWholesaleFindAllResponse,
  ): boolean {
    return (
      isApiSuccess(response.statusCode) &&
      response.data &&
      Array.isArray(response.data["Product List"])
    );
  }

  isValidProductWholesaleDetail(
    response: ProductWholesaleFindByIdResponse,
  ): boolean {
    return (
      isApiSuccess(response.statusCode) &&
      response.data &&
      Array.isArray(response.data["Product Details"]) &&
      response.data["Product Details"].length > 0
    );
  }

  isValidProductWholesaleSectionsList(
    response: ProductWholesaleSectionsResponse,
  ): boolean {
    return (
      isApiSuccess(response.statusCode) &&
      response.data &&
      Array.isArray(response.data["Product Sections"])
    );
  }
}

export const productWholesaleServiceApi = new ProductWholesaleServiceApi();
