import type {
  ProductWholesaleDetail,
  ProductWholesaleListItem,
  ProductWholesaleRelatedCategory,
  ProductWholesaleRelatedProduct,
} from "../types/product-wholesale-types";

export interface UIProductWholesale {
  id: number;
  taxonomyId?: number;
  sku: number;
  name: string;
  shortDescription: string;
  label: string;
  ref: string;
  model: string;
  type: string;
  typeId?: number;
  brand: string;
  brandId?: number;
  brandImagePath?: string;
  imagePath?: string;
  slug?: string;
  storeStock: number;
  wholesalePrice: string;
  corporatePrice: string;
  retailPrice: string;
  goldPrice: string;
  silverPrice: string;
  bronzePrice: string;
  discount: string;
  warrantyDays: number;
  weightGr?: number;
  lengthMm?: number;
  widthMm?: number;
  heightMm?: number;
  diameterMm?: number;
  salesDescription?: string;
  notes?: string;
  imported: boolean;
  promotion: boolean;
  launch: boolean;
  featured?: boolean;
  isService?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  createdAt?: string;
}

export function transformProductWholesaleListItem(
  entity: ProductWholesaleListItem,
): UIProductWholesale {
  return {
    id: entity.ID_PRODUTO,
    sku: entity.SKU,
    name: entity.PRODUTO,
    shortDescription: entity.DESCRICAO_TAB,
    label: entity.ETIQUETA,
    ref: entity.REF,
    model: entity.MODELO,
    type: entity.TIPO,
    brand: entity.MARCA,
    brandImagePath: entity.PATH_IMAGEM_MARCA || undefined,
    imagePath: entity.PATH_IMAGEM || undefined,
    slug: entity.SLUG || undefined,
    storeStock: entity.ESTOQUE_LOJA,
    wholesalePrice: entity.VL_ATACADO,
    corporatePrice: entity.VL_CORPORATIVO,
    retailPrice: entity.VL_VAREJO,
    goldPrice: entity.OURO,
    silverPrice: entity.PRATA,
    bronzePrice: entity.BRONZE,
    discount: entity.DECONTO,
    warrantyDays: entity.TEMPODEGARANTIA_DIA,
    salesDescription: entity.DESCRICAO_VENDA ?? undefined,
    imported: entity.IMPORTADO === 1,
    promotion: entity.PROMOCAO === 1,
    launch: entity.LANCAMENTO === 1,
    createdAt: entity.DATADOCADASTRO,
  };
}

export function transformProductWholesaleList(
  items: ProductWholesaleListItem[],
): UIProductWholesale[] {
  return items.map(transformProductWholesaleListItem);
}

export function transformProductWholesaleDetail(
  entity: ProductWholesaleDetail,
): UIProductWholesale {
  return {
    id: entity.ID_PRODUTO,
    sku: entity.SKU,
    name: entity.PRODUTO,
    shortDescription: entity.DESCRICAO_TAB,
    label: entity.ETIQUETA,
    ref: entity.REF,
    model: entity.MODELO,
    type: entity.TIPO,
    typeId: entity.ID_TIPO,
    brand: entity.MARCA,
    brandId: entity.ID_MARCA,
    brandImagePath: entity.PATH_IMAGEM_MARCA || undefined,
    imagePath: entity.PATH_IMAGEM || undefined,
    slug: entity.SLUG || undefined,
    storeStock: entity.ESTOQUE_LOJA,
    wholesalePrice: entity.VL_ATACADO,
    corporatePrice: entity.VL_CORPORATIVO,
    retailPrice: entity.VL_VAREJO,
    goldPrice: entity.OURO,
    silverPrice: entity.PRATA,
    bronzePrice: entity.BRONZE,
    discount: "0.000000",
    warrantyDays: entity.TEMPODEGARANTIA_DIA,
    weightGr: entity.PESO_GR,
    lengthMm: entity.COMPRIMENTO_MM,
    widthMm: entity.LARGURA_MM,
    heightMm: entity.ALTURA_MM,
    diameterMm: entity.DIAMETRO_MM,
    salesDescription: entity.DESCRICAO_VENDA ?? undefined,
    notes: entity.ANOTACOES ?? undefined,
    imported: entity.IMPORTADO === 1,
    promotion: entity.PROMOCAO === 1,
    launch: false,
    featured: entity.DESTAQUE === 1,
    isService: entity.FLAG_SERVICO === 1,
    metaTitle: entity.META_TITLE ?? undefined,
    metaDescription: entity.META_DESCRIPTION ?? undefined,
  };
}

export function transformProductWholesaleDetailList(
  items: ProductWholesaleDetail[],
): UIProductWholesale[] {
  return items.map(transformProductWholesaleDetail);
}

export function transformProductWholesale(
  entity: ProductWholesaleListItem | ProductWholesaleDetail | null | undefined,
): UIProductWholesale | null {
  if (!entity) return null;

  if ("ANOTACOES" in entity) {
    return transformProductWholesaleDetail(entity as ProductWholesaleDetail);
  }

  return transformProductWholesaleListItem(entity as ProductWholesaleListItem);
}

// --- Related Categories ---

export interface UIProductWholesaleRelatedCategory {
  taxonomyId: number;
  parentId: number;
  name: string;
  slug: string;
  order: number;
  level: number;
}

export function transformRelatedCategory(
  entity: ProductWholesaleRelatedCategory,
): UIProductWholesaleRelatedCategory {
  return {
    taxonomyId: entity.ID_TAXONOMY,
    parentId: entity.PARENT_ID,
    name: entity.TAXONOMIA,
    slug: entity.SLUG,
    order: entity.ORDEM,
    level: entity.LEVEL,
  };
}

export function transformRelatedCategories(
  items: ProductWholesaleRelatedCategory[],
): UIProductWholesaleRelatedCategory[] {
  return items.map(transformRelatedCategory);
}

// --- Related Products ---

export interface UIProductWholesaleRelatedProduct {
  taxonomyId: number;
  sku: number;
  name: string;
  shortDescription: string;
  label: string;
  ref: string;
  model: string;
  imagePath?: string;
  slug?: string;
  storeStock: number;
  wholesalePrice: string;
  corporatePrice: string;
  retailPrice: string;
  imported: boolean;
  promotion: boolean;
  launch: boolean;
}

export function transformRelatedProduct(
  entity: ProductWholesaleRelatedProduct,
): UIProductWholesaleRelatedProduct {
  return {
    taxonomyId: entity.ID_TAXONOMY,
    sku: entity.SKU,
    name: entity.PRODUTO,
    shortDescription: entity.DESCRICAO_TAB,
    label: entity.ETIQUETA,
    ref: entity.REF,
    model: entity.MODELO,
    imagePath: entity.PATH_IMAGEM || undefined,
    slug: entity.SLUG || undefined,
    storeStock: entity.ESTOQUE_LOJA,
    wholesalePrice: entity.VL_ATACADO,
    corporatePrice: entity.VL_CORPORATIVO,
    retailPrice: entity.VL_VAREJO,
    imported: entity.IMPORTADO === 1,
    promotion: entity.PROMOCAO === 1,
    launch: entity.LANCAMENTO === 1,
  };
}

export function transformRelatedProducts(
  items: ProductWholesaleRelatedProduct[],
): UIProductWholesaleRelatedProduct[] {
  return items.map(transformRelatedProduct);
}
