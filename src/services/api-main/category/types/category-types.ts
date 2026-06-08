/**
 * Tipos e interfaces utilizados pelo CategoryServiceApi
 * Baseado nos endpoints taxonomy web menu e taxonomy find id
 */

/**
 * Estrutura base para requisições que exigem contexto de tenant
 */
interface CategoryBaseRequest {
  pe_app_id?: number;
  pe_system_client_id?: number;
  pe_store_id?: number;
  pe_organization_id?: string;
  pe_member_id?: string;
  pe_user_id?: string;
  pe_person_id?: number;
}

/**
 * Estrutura padrão de resposta com metadados do MySQL
 */
export interface MySQLMetadata {
  fieldCount: number;
  affectedRows: number;
  insertId: number;
  info: string;
  serverStatus: number;
  warningStatus: number;
  changedRows: number;
}

/**
 * Estrutura padrão de retorno das stored procedures
 */
export interface StoredProcedureResponse {
  sp_return_id: number;
  sp_message: string;
  sp_error_id: number;
}

/**
 * Nó da árvore de taxonomia/categoria retornado pelo endpoint taxonomy-find-menu
 */
export interface TblTaxonomyWebMenu {
  ID_TAXONOMY?: number;
  PARENT_ID?: number;
  TAXONOMIA?: string;
  PATH_IMAGEM?: string | null;
  SLUG?: string | null;
  LEVEL?: number;
  ORDEM?: number;
  ID_IMAGEM?: number | null;
  QT_RECORDS?: number | null;
  children?: TblTaxonomyWebMenu[];
}

/**
 * Requisição para taxonomy-find-menu
 */
export interface TaxonomyWebMenuRequest extends CategoryBaseRequest {
  pe_id_tipo: number;
  pe_parent_id?: number;
}

/**
 * Registro de taxonomia retornado pelo endpoint taxonomy-find-id
 */
export interface TblTaxonomyFindById {
  ID_TAXONOMY?: number;
  PARENT_ID?: number;
  TAXONOMIA?: string;
  PARENT_CATEGORY?: string | null;
  PATH_IMAGEM?: string | null;
  SLUG?: string | null;
  LEVEL?: number | null;
  ORDEM?: number;
  ID_IMAGEM?: number | null;
  QT_RECORDS?: number | null;
  INATIVO?: number;
  META_TITLE?: string | null;
  META_DESCRIPTION?: string | null;
  ANOTACOES?: string | null;
  CREATEDAT?: string | null;
  UPDATEDAT?: string | null;
}

/**
 * Registro de taxonomia relacionada retornado pelo endpoint taxonomy-find-id
 */
export interface TblTaxonomyRelated {
  ID_TAXONOMY?: number;
  TAXONOMIA?: string;
  PATH_IMAGEM?: string | null;
  SLUG?: string | null;
  LEVEL?: number | null;
  ORDEM?: number;
}

/**
 * Requisição para taxonomy-find-id
 */
export interface TaxonomyFindIdRequest extends CategoryBaseRequest {
  pe_taxonomy_id?: number;
  pe_id_taxonomy?: number;
}

/**
 * Estrutura de dados retornada pelo endpoint taxonomy-find-menu
 * [0]: Array hierárquico de taxonomias com propriedade children
 * [1]: Feedback da stored procedure
 * [2]: Metadados da operação MySQL
 */
export type SpResultTaxonomyWebMenuData = [
  TblTaxonomyWebMenu[],
  [StoredProcedureResponse],
  MySQLMetadata,
];

/**
 * Estrutura de dados retornada pelo endpoint taxonomy-find-id
 */
export interface TaxonomyFindIdData {
  "Taxonomy find Id": TblTaxonomyFindById[];
  "Taxonomy related": TblTaxonomyRelated[];
}

export type SpResultTaxonomyFindIdData = TaxonomyFindIdData;

/**
 * Resposta do endpoint taxonomy-find-menu
 */
export interface TaxonomyWebMenuResponse {
  statusCode: number;
  message: string;
  recordId: number;
  data: SpResultTaxonomyWebMenuData;
  quantity: number;
  info1: string;
}

/**
 * Resposta do endpoint taxonomy-find-id
 */
export interface TaxonomyFindIdResponse {
  statusCode: number;
  message: string;
  recordId: number;
  data: TaxonomyFindIdData;
  quantity: number;
  errorId?: number;
  info1: string;
}

/**
 * Erro base para operações de Category
 */
export class CategoryError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly statusCode?: number,
  ) {
    super(message);
    this.name = "CategoryError";
    Object.setPrototypeOf(this, CategoryError.prototype);
  }
}

/**
 * Erro específico quando uma categoria não é encontrada
 */
export class CategoryNotFoundError extends CategoryError {
  constructor(params?: Record<string, unknown>) {
    const message = params
      ? `Categoria não encontrada com os parâmetros: ${JSON.stringify(params)}`
      : "Categoria não encontrada";
    super(message, "CATEGORY_NOT_FOUND", 100404);
    this.name = "CategoryNotFoundError";
    Object.setPrototypeOf(this, CategoryNotFoundError.prototype);
  }
}

/**
 * Erro específico para falhas de validação
 */
export class CategoryValidationError extends CategoryError {
  constructor(
    message: string,
    public readonly validationErrors?: Record<string, string[]>,
  ) {
    super(message, "CATEGORY_VALIDATION_ERROR", 100400);
    this.name = "CategoryValidationError";
    Object.setPrototypeOf(this, CategoryValidationError.prototype);
  }
}
