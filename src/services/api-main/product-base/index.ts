export {
  ProductBaseServiceApi,
  productBaseServiceApi,
} from "./product-base-service-api";

export type {
  ProductCreateRequest,
  ProductCreateResponse,
  ProductDetail,
  ProductDetailCategory,
  ProductDetailRelated,
  ProductFindAllRequest,
  ProductFindAllResponse,
  ProductFindByIdRequest,
  ProductFindByIdResponse,
  ProductListItem,
  ProductPremiumRequest,
  ProductPremiumResponse,
  ProductSearchAllRequest,
  ProductSearchAllResponse,
  ProductSearchItem,
  StoredProcedureResponse,
} from "./types/product-base-types";

export {
  ProductBaseError,
  ProductBaseNotFoundError,
  ProductBaseValidationError,
} from "./types/product-base-types";
