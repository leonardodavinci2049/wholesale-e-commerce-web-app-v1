import type { RowDataPacket } from "mysql2/promise";

import type { ProductStatusFilter } from "@/services/db/product/types/product-filter.types";

export type ProductListParams = {
  inativo: ProductStatusFilter;
  search?: string | null;
};

type ProductListBaseColumns = {
  ID_PRODUTO: number;
  SKU: number;
  PRODUTO: string | null;
  ESTOQUE_LOJA: number | null;
  TIPO_VALOR: string;
  VALOR_PRODUTO: number | null;
  VL_ATACADO: number | null;
  VL_CORPORATIVO: number | null;
  VL_VAREJO: number | null;
  DESCRICAO_TAB: string | null;
  ETIQUETA: string | null;
  REF: string | null;
  MODELO: string | null;
  ID_TIPO: number | null;
  TIPO: string | null;
  ID_MARCA: number | null;
  MARCA: string | null;
  PATH_IMAGEM_MARCA: string | null;
  ID_IMAGEM: number | null;
  PATH_IMAGEM: string | null;
  PATH_PAGE: string | null;
  SLUG: string | null;
  TX_PRODUTO_LOJA: number | null;
  OURO: number | null;
  PRATA: number | null;
  BRONZE: number | null;
  DECONTO: number | null;
  TEMPODEGARANTIA_MES: number | null;
  TEMPODEGARANTIA_DIA: number | null;
  DESCRICAO_VENDA: string | null;
  IMPORTADO: number | null;
  PROMOCAO: number | null;
  LANCAMENTO: number | null;
  DATADOCADASTRO: Date | null;
};

export type ProductListItem = RowDataPacket & ProductListBaseColumns;

export type ProductListMetaItem = RowDataPacket & {
  ID_PRODUTO: number;
  SKU: number;
  PRODUTO: string | null;
  DESCRICAO_TAB: string | null;
  ETIQUETA: string | null;
  REF: string | null;
  MODELO: string | null;
  TIPO: string | null;
  MARCA: string | null;
  PATH_PAGE: string | null;
  SLUG: string | null;
  DESCRICAO_VENDA: string | null;
  CATEGORIAS: string | null;
  META_TITLE: string | null;
  META_DESCRIPTION: string | null;
  DATADOCADASTRO: Date | null;
};

export type ProductListDescriptionItem = RowDataPacket & {
  ID_PRODUTO: number;
  SKU: number;
  PRODUTO: string | null;
  REF: string | null;
  MODELO: string | null;
  PATH_PAGE: string | null;
  DESCRICAO_VENDA: string | null;
  DATADOCADASTRO: Date | null;
  CATEGORIAS: string | null;
  ANOTACOES: string | null;
};

export type ProductDetail = RowDataPacket & {
  ID_PRODUTO: number;
  SKU: number;
  PRODUTO: string | null;
  DESCRICAO_TAB: string | null;
  ETIQUETA: string | null;
  REF: string | null;
  MODELO: string | null;
  PATH_IMAGEM: string | null;
  PATH_PAGE: string | null;
  SLUG: string | null;
  ID_TIPO: number | null;
  TIPO: string | null;
  ID_MARCA: number | null;
  MARCA: string | null;
  PATH_IMAGEM_MARCA: string | null;
  VL_ATACADO: number | null;
  VL_CORPORATIVO: number | null;
  VL_VAREJO: number | null;
  OURO: number | null;
  PRATA: number | null;
  BRONZE: number | null;
  ESTOQUE_LOJA: number | null;
  TEMPODEGARANTIA_DIA: number | null;
  PESO_GR: number | null;
  COMPRIMENTO_MM: number | null;
  LARGURA_MM: number | null;
  ALTURA_MM: number | null;
  DIAMETRO_MM: number | null;
  CFOP: string | null;
  CST: string | null;
  EAN: string | null;
  NCM: string | null;
  NBM: string | null;
  PPB: string | null;
  TEMP: string | null;
  DESTAQUE: number | null;
  PROMOCAO: number | null;
  FLAG_SERVICO: number | null;
  IMPORTADO: number | null;
  META_TITLE: string | null;
  META_DESCRIPTION: string | null;
  DT_UPDATE: Date | null;
  DESCRICAO_VENDA: string | null;
  ANOTACOES: string | null;
  DATADOCADASTRO: Date | null;
};
