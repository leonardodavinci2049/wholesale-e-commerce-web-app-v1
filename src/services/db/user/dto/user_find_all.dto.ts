export interface UserFindAllDto {
  PE_USER_ID?: string;
  PE_ORGANIZATION_ID?: string;
  PE_SEARCH_USER?: string;
  PE_FLAG_MEMBER_OFF?: number;
  PE_QT_REGISTROS?: number;
  PE_PAGINA_ID?: number;
  PE_COLUNA_ID?: number;
  PE_ORDEM_ID?: number;
}

/**
 * Valida o DTO para selecionar todos os usuários
 */
export function validateUserFindAllDto(data: unknown): UserFindAllDto {
  if (data !== undefined && data !== null && typeof data !== "object") {
    throw new Error("Dados inválidos fornecidos");
  }

  const dto = (data as Record<string, unknown>) || {};

  // Validação de campos numéricos (INT)
  const numericFields = [
    "PE_FLAG_MEMBER_OFF",
    "PE_QT_REGISTROS",
    "PE_PAGINA_ID",
    "PE_COLUNA_ID",
    "PE_ORDEM_ID",
  ];

  for (const field of numericFields) {
    if (dto[field] !== undefined && dto[field] !== null) {
      if (typeof dto[field] !== "number") {
        throw new Error(`${field} deve ser um número`);
      }
    }
  }

  // Campos opcionais de string
  if (dto.PE_USER_ID !== undefined && dto.PE_USER_ID !== null) {
    if (typeof dto.PE_USER_ID !== "string") {
      throw new Error("PE_USER_ID deve ser uma string");
    }
    if (dto.PE_USER_ID.length > 191) {
      throw new Error("PE_USER_ID não pode exceder 191 caracteres");
    }
  }

  if (dto.PE_ORGANIZATION_ID !== undefined && dto.PE_ORGANIZATION_ID !== null) {
    if (typeof dto.PE_ORGANIZATION_ID !== "string") {
      throw new Error("PE_ORGANIZATION_ID deve ser uma string");
    }
    if (dto.PE_ORGANIZATION_ID.length > 191) {
      throw new Error("PE_ORGANIZATION_ID não pode exceder 191 caracteres");
    }
  }

  if (dto.PE_SEARCH_USER !== undefined && dto.PE_SEARCH_USER !== null) {
    if (typeof dto.PE_SEARCH_USER !== "string") {
      throw new Error("PE_SEARCH_USER deve ser uma string");
    }
    if (dto.PE_SEARCH_USER.length > 191) {
      throw new Error("PE_SEARCH_USER não pode exceder 191 caracteres");
    }
  }

  return {
    PE_USER_ID:
      typeof dto.PE_USER_ID === "string" ? dto.PE_USER_ID.trim() : undefined,
    PE_ORGANIZATION_ID:
      typeof dto.PE_ORGANIZATION_ID === "string"
        ? dto.PE_ORGANIZATION_ID.trim()
        : undefined,
    PE_SEARCH_USER:
      typeof dto.PE_SEARCH_USER === "string"
        ? dto.PE_SEARCH_USER.trim()
        : undefined,
    PE_FLAG_MEMBER_OFF:
      dto.PE_FLAG_MEMBER_OFF !== undefined && dto.PE_FLAG_MEMBER_OFF !== null
        ? Number(dto.PE_FLAG_MEMBER_OFF)
        : undefined,
    PE_QT_REGISTROS:
      dto.PE_QT_REGISTROS !== undefined && dto.PE_QT_REGISTROS !== null
        ? Number(dto.PE_QT_REGISTROS)
        : undefined,
    PE_PAGINA_ID:
      dto.PE_PAGINA_ID !== undefined && dto.PE_PAGINA_ID !== null
        ? Number(dto.PE_PAGINA_ID)
        : undefined,
    PE_COLUNA_ID:
      dto.PE_COLUNA_ID !== undefined && dto.PE_COLUNA_ID !== null
        ? Number(dto.PE_COLUNA_ID)
        : undefined,
    PE_ORDEM_ID:
      dto.PE_ORDEM_ID !== undefined && dto.PE_ORDEM_ID !== null
        ? Number(dto.PE_ORDEM_ID)
        : undefined,
  };
}
