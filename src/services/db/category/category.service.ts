import "server-only";

import { serverEnvs } from "@/core/config/envs.server";
import dbService from "@/database/dbConnection";
import type {
  CategoryDetail,
  CategoryListItem,
  CategoryListParams,
} from "@/services/db/category/types/category-list.types";
import { CATEGORY_FIND_ID_SQL } from "./query/category_find_id";
import { CATEGORY_LIST_SQL } from "./query/catgory-find_list";

function buildCategoryListQueryParams(params: CategoryListParams) {
  const clientId = serverEnvs.SYSTEM_CLIENT_ID;
  const search = params.search ?? null;

  return [
    clientId, // PE_SYSTEM_CLIENT_ID
    search, // PE_SEARCH (IS NULL check)
    search, // PE_SEARCH (TRIM check)
    search, // PE_SEARCH (REGEXP check)
    search, // PE_SEARCH (CAST AS UNSIGNED)
    search, // PE_SEARCH (LIKE inside REGEXP block)
    search, // PE_SEARCH (NOT REGEXP check)
    search, // PE_SEARCH (LIKE inside NOT REGEXP block)
  ];
}

export async function getCategoryList(
  params: CategoryListParams,
): Promise<CategoryListItem[]> {
  const queryParams = buildCategoryListQueryParams(params);

  return dbService.selectQuery<CategoryListItem>(
    CATEGORY_LIST_SQL,
    queryParams,
  );
}

export async function getCategoryById(
  id: number,
): Promise<CategoryDetail | null> {
  const clientId = serverEnvs.SYSTEM_CLIENT_ID;

  const rows = await dbService.selectQuery<CategoryDetail>(
    CATEGORY_FIND_ID_SQL,
    [clientId, id],
  );

  return rows[0] ?? null;
}

export async function updateCategoryMetaTitle(
  categoryId: number,
  value: string | null,
): Promise<void> {
  const clientId = serverEnvs.SYSTEM_CLIENT_ID;

  await dbService.modifyExecute(
    "UPDATE tbl_taxonomy SET META_TITLE = ? WHERE ID_TAXONOMY = ? AND ID_SYSTEM_CLIENTE = ?",
    [value, categoryId, clientId],
  );
}

export async function updateCategoryMetaDescription(
  categoryId: number,
  value: string | null,
): Promise<void> {
  const clientId = serverEnvs.SYSTEM_CLIENT_ID;

  await dbService.modifyExecute(
    "UPDATE tbl_taxonomy SET META_DESCRIPTION = ? WHERE ID_TAXONOMY = ? AND ID_SYSTEM_CLIENTE = ?",
    [value, categoryId, clientId],
  );
}

export async function updateCategoryAnotacoes(
  categoryId: number,
  value: string | null,
): Promise<void> {
  const clientId = serverEnvs.SYSTEM_CLIENT_ID;

  await dbService.modifyExecute(
    "UPDATE tbl_taxonomy SET ANOTACOES = ? WHERE ID_TAXONOMY = ? AND ID_SYSTEM_CLIENTE = ?",
    [value, categoryId, clientId],
  );
}

export async function updateCategoryMetaFields(
  categoryId: number,
  metaTitle: string | null,
  metaDescription: string | null,
): Promise<void> {
  const clientId = serverEnvs.SYSTEM_CLIENT_ID;

  await dbService.modifyExecute(
    `UPDATE tbl_taxonomy
        SET META_TITLE = ?,
            META_DESCRIPTION = ?,
            UPDATEDAT = NOW()
      WHERE ID_TAXONOMY = ?
        AND ID_SYSTEM_CLIENTE = ?`,
    [metaTitle, metaDescription, categoryId, clientId],
  );
}
