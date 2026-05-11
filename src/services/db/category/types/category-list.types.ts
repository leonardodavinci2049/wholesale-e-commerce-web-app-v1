import type { RowDataPacket } from "mysql2/promise";

export type CategoryListParams = {
  search?: string | null;
};

type CategoryBaseColumns = {
  ID_TAXONOMY: number;
  TAXONOMIA: string | null;
  PARENT_ID: number | null;
  TAXONOMIA_FATHER: string | null;
  ID_TAXONOMY_GRANDFATHER: number | null;
  TAXONOMIA_GRANDFATHER: string | null;
  PATH_IMAGEM: string | null;
  SLUG: string | null;
  LEVEL: number | null;
  ORDEM: number | null;
  QT_RECORDS: number | null;
  ANOTACOES: string | null;
  META_TITLE: string | null;
  META_DESCRIPTION: string | null;
};

export type CategoryListItem = RowDataPacket & CategoryBaseColumns;

export type CategoryDetail = RowDataPacket & CategoryBaseColumns;
