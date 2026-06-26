export {
  PhysicalProductServiceApi,
  physicalProductServiceApi,
} from "./physical-product-service-api";
export type {
  UIOrderItemCustomer,
  UIPhysicalProduct,
  UIPhysicalProductWarranty,
} from "./transformers/transformers";
export {
  transformOrderItemCustomer,
  transformOrderItemsCustomer,
  transformPhysicalProduct,
  transformPhysicalProducts,
  transformPhysicalProductWarranties,
  transformPhysicalProductWarranty,
} from "./transformers/transformers";
export type {
  OrderItemCustomerEntity,
  OrderItemFindAllCustomerRequest,
  OrderItemFindAllCustomerResponse,
  OrderItemFindIdCustomerRequest,
  OrderItemFindIdCustomerResponse,
  PhysicalProductEntity,
  PhysicalProductFindAllRequest,
  PhysicalProductFindAllResponse,
  PhysicalProductWarrantyEntity,
  PhysicalProductWarrantyIdCustomerRequest,
  PhysicalProductWarrantyIdCustomerResponse,
  PhysicalProductWarrantyIdRequest,
  PhysicalProductWarrantyIdResponse,
  PhysicalProductWarrantyMovCustomerRequest,
  PhysicalProductWarrantyMovCustomerResponse,
  PhysicalProductWarrantyMovRequest,
  PhysicalProductWarrantyMovResponse,
} from "./types/physical-product-types";
export {
  PhysicalProductError,
  PhysicalProductNotFoundError,
  PhysicalProductValidationError,
} from "./types/physical-product-types";
