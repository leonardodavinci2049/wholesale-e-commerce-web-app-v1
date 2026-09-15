import "server-only";

interface ProductWholesaleBaseRequest {
  pe_app_id?: number;
  pe_system_client_id?: number;
  pe_store_id?: number;
  pe_organization_id?: string;
  pe_user_id?: string;
  pe_user_name?: string;
  pe_user_role?: string;
  pe_person_id?: number;
  pe_customer_id?: number;
}

interface ProductWholesaleBaseResponse {
  statusCode: number;
  message: string;
  recordId: number;
  quantity: number;
  errorId: number;
  info1?: string;
}

// --- Request Interfaces ---

export interface ProductWholesaleFindAllRequest
  extends ProductWholesaleBaseRequest {
  pe_search?: string;
  pe_taxonomy_id?: number;
  pe_brand_id?: number;
  pe_stock_flag?: number;
  pe_qt_records?: number;
  pe_page_id?: number;
  pe_column_id?: number;
  pe_order_id?: number;
}

export interface ProductWholesaleFindByIdRequest
  extends ProductWholesaleBaseRequest {
  pe_product_id?: number;
  pe_product_slug?: string;
}

export interface ProductWholesaleSectionsRequest
  extends ProductWholesaleBaseRequest {
  pe_taxonomy_id?: number;
  pe_brand_id?: number;
  pe_type_id?: number;
  pe_promotion_flag?: number;
  pe_highlight_flag?: number;
  pe_launch_flag?: number;
  pe_limit?: number;
}

// --- Entity Interfaces (campos retornados pela API) ---

export interface ProductWholesaleListItem {
  ID_PRODUTO: number;
  SKU: number;
  PRODUTO: string;
  DESCRICAO_TAB: string;
  ETIQUETA: string;
  REF: string;
  MODELO: string;
  TIPO: string;
  MARCA: string;
  PATH_IMAGEM_MARCA: string;
  PATH_IMAGEM: string;
  SLUG: string;
  ESTOQUE_LOJA: number;
  OURO: string;
  PRATA: string;
  BRONZE: string;
  VL_ATACADO: string;
  VL_CORPORATIVO: string;
  VL_VAREJO: string;
  DECONTO: string;
  TEMPODEGARANTIA_DIA: number;
  DESCRICAO_VENDA: string | null;
  IMPORTADO: number;
  PROMOCAO: number;
  LANCAMENTO: number;
  DATADOCADASTRO: string;
}

export interface ProductWholesaleDetail {
  ID_PRODUTO: number;
  SKU: number;
  PRODUTO: string;
  DESCRICAO_TAB: string;
  ETIQUETA: string;
  REF: string;
  MODELO: string;
  PATH_IMAGEM: string;
  SLUG: string;
  PATH_IMAGEM_MARCA: string;
  ID_TIPO: number;
  TIPO: string;
  ID_MARCA: number;
  MARCA: string;
  VL_ATACADO: string;
  VL_CORPORATIVO: string;
  VL_VAREJO: string;
  OURO: string;
  PRATA: string;
  BRONZE: string;
  ESTOQUE_LOJA: number;
  TEMPODEGARANTIA_DIA: number;
  PESO_GR: number;
  COMPRIMENTO_MM: number;
  LARGURA_MM: number;
  ALTURA_MM: number;
  DIAMETRO_MM: number;
  DESTAQUE: number;
  PROMOCAO: number;
  FLAG_SERVICO: number;
  IMPORTADO: number;
  DESCRICAO_VENDA: string | null;
  ANOTACOES: string | null;
  META_TITLE: string | null;
  META_DESCRIPTION: string | null;
}

export interface ProductWholesaleRelatedCategory {
  ID_TAXONOMY: number;
  PARENT_ID: number;
  TAXONOMIA: string;
  SLUG: string;
  ORDEM: number;
  LEVEL: number;
}

export interface ProductWholesaleRelatedProduct {
  ID_TAXONOMY: number;
  SKU: number;
  PRODUTO: string;
  DESCRICAO_TAB: string;
  ETIQUETA: string;
  REF: string;
  MODELO: string;
  PATH_IMAGEM: string;
  SLUG: string;
  ESTOQUE_LOJA: number;
  VL_ATACADO: string;
  VL_CORPORATIVO: string;
  VL_VAREJO: string;
  IMPORTADO: number;
  PROMOCAO: number;
  LANCAMENTO: number;
}

// --- Response Interfaces ---

export interface ProductWholesaleFindAllResponse
  extends ProductWholesaleBaseResponse {
  data: {
    "Product List": ProductWholesaleListItem[];
  };
}

export interface ProductWholesaleFindByIdData {
  "Product Details": ProductWholesaleDetail[];
  "Category Related": ProductWholesaleRelatedCategory[];
  "Related Products": ProductWholesaleRelatedProduct[];
}

export interface ProductWholesaleFindByIdResponse
  extends ProductWholesaleBaseResponse {
  data: ProductWholesaleFindByIdData;
}

export interface ProductWholesaleSectionsResponse
  extends ProductWholesaleBaseResponse {
  data: {
    "Product Sections": ProductWholesaleListItem[];
  };
}

// --- Error Classes ---

export class ProductWholesaleError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly statusCode?: number,
  ) {
    super(message);
    this.name = "ProductWholesaleError";
    Object.setPrototypeOf(this, ProductWholesaleError.prototype);
  }
}

export class ProductWholesaleNotFoundError extends ProductWholesaleError {
  constructor(params?: Record<string, unknown>) {
    const message = params
      ? `Produto atacado não encontrado com os parâmetros: ${JSON.stringify(params)}`
      : "Produto atacado não encontrado";
    super(message, "PRODUCT_WHOLESALE_NOT_FOUND", 100404);
    this.name = "ProductWholesaleNotFoundError";
    Object.setPrototypeOf(this, ProductWholesaleNotFoundError.prototype);
  }
}

export class ProductWholesaleValidationError extends ProductWholesaleError {
  constructor(
    message: string,
    public readonly validationErrors?: Record<string, string[]>,
  ) {
    super(message, "PRODUCT_WHOLESALE_VALIDATION_ERROR", 100400);
    this.name = "ProductWholesaleValidationError";
    Object.setPrototypeOf(this, ProductWholesaleValidationError.prototype);
  }
}
