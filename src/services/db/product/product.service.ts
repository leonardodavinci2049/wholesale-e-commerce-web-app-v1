import "server-only";

import { serverEnvs } from "@/core/config/envs.server";
import dbService from "@/database/dbConnection";
import { PRODUCT_FIND_ID_SQL } from "./query/product_find_id";
import { PRODUCT_LIST_SQL } from "./query/product-find_list";
import { PRODUCT_LIST_DESCRIPTION_SQL } from "./query/product-find_list-description";
import { PRODUCT_LIST_META_SQL } from "./query/product-find_list-meta";
import type {
  ProductDetail,
  ProductListDescriptionItem,
  ProductListItem,
  ProductListMetaItem,
  ProductListParams,
} from "./types/product-list.types";

function buildProductListQueryParams(params: ProductListParams) {
  const clientId = serverEnvs.SYSTEM_CLIENT_ID;
  const inativo = params.inativo === "all" ? null : Number(params.inativo);
  const search = params.search ?? null;

  return [
    clientId, // PE_SYSTEM_CLIENT_ID
    inativo, // PE_INATIVO_NULL_CHECK
    inativo, // PE_INATIVO
    search, // PE_SEARCH (IS NULL check)
    search, // PE_SEARCH (TRIM check)
    search, // PE_SEARCH (REGEXP check)
    search, // PE_SEARCH (CAST AS UNSIGNED)
    search, // PE_SEARCH (LIKE inside REGEXP block)
    search, // PE_SEARCH (NOT REGEXP check)
    search, // PE_SEARCH (LIKE inside NOT REGEXP block)
  ];
}

export async function getProductList(
  params: ProductListParams,
): Promise<ProductListItem[]> {
  const queryParams = buildProductListQueryParams(params);

  return dbService.selectQuery<ProductListItem>(PRODUCT_LIST_SQL, queryParams);
}

export async function getProductListMeta(
  params: ProductListParams,
): Promise<ProductListMetaItem[]> {
  const queryParams = buildProductListQueryParams(params);

  return dbService.selectQuery<ProductListMetaItem>(
    PRODUCT_LIST_META_SQL,
    queryParams,
  );
}

export async function getProductListDescription(
  params: ProductListParams,
): Promise<ProductListDescriptionItem[]> {
  const queryParams = buildProductListQueryParams(params);

  return dbService.selectQuery<ProductListDescriptionItem>(
    PRODUCT_LIST_DESCRIPTION_SQL,
    queryParams,
  );
}

export async function updateProductAnotacoes(
  productId: number,
  value: string | null,
): Promise<void> {
  const clientId = serverEnvs.SYSTEM_CLIENT_ID;
  await dbService.modifyExecute(
    "UPDATE tbl_produto SET ANOTACOES = ? WHERE ID_TBL_PRODUTO = ? AND ID_SYSTEM_CLIENTE = ?",
    [value, productId, clientId],
  );
}

export async function updateProductDescricaoVenda(
  productId: number,
  value: string | null,
): Promise<void> {
  const clientId = serverEnvs.SYSTEM_CLIENT_ID;
  await dbService.modifyExecute(
    "UPDATE tbl_produto SET DESCRICAO_VENDA = ? WHERE ID_TBL_PRODUTO = ? AND ID_SYSTEM_CLIENTE = ?",
    [value, productId, clientId],
  );
}

export async function updateProductMetaTitle(
  productId: number,
  value: string | null,
): Promise<void> {
  const clientId = serverEnvs.SYSTEM_CLIENT_ID;
  await dbService.modifyExecute(
    "UPDATE tbl_produto SET META_TITLE = ? WHERE ID_TBL_PRODUTO = ? AND ID_SYSTEM_CLIENTE = ?",
    [value, productId, clientId],
  );
}

export async function updateProductMetaDescription(
  productId: number,
  value: string | null,
): Promise<void> {
  const clientId = serverEnvs.SYSTEM_CLIENT_ID;
  await dbService.modifyExecute(
    "UPDATE tbl_produto SET META_DESCRIPTION = ? WHERE ID_TBL_PRODUTO = ? AND ID_SYSTEM_CLIENTE = ?",
    [value, productId, clientId],
  );
}

export async function updateProductMetaFields(
  productId: number,
  metaTitle: string | null,
  metaDescription: string | null,
): Promise<void> {
  const clientId = serverEnvs.SYSTEM_CLIENT_ID;

  await dbService.modifyExecute(
    `UPDATE tbl_produto
        SET META_TITLE = ?,
            META_DESCRIPTION = ?,
            FLAG_LOOP = 1,
            DT_UPDATE = NOW()
      WHERE ID_TBL_PRODUTO = ?
        AND ID_SYSTEM_CLIENTE = ?`,
    [metaTitle, metaDescription, productId, clientId],
  );
}

export async function getProductById(
  id: number,
): Promise<ProductDetail | null> {
  const clientId = serverEnvs.SYSTEM_CLIENT_ID;

  const queryParams = [
    clientId, // PE_SYSTEM_CLIENT_ID
    id, // PE_ID_PRODUTO
  ];

  const rows = await dbService.selectQuery<ProductDetail>(
    PRODUCT_FIND_ID_SQL,
    queryParams,
  );

  return rows[0] ?? null;
}
