export interface UserFindIdDto {
  PE_USER_ID: string;
}

/**
 * Valida o DTO para buscar usuário por ID
 */
export function validateUserFindIdDto(data: unknown): UserFindIdDto {
  if (data !== undefined && data !== null && typeof data !== "object") {
    throw new Error("Dados inválidos fornecidos");
  }

  const dto = (data as Record<string, unknown>) || {};

  // Validação de PE_USER_ID obrigatório
  if (!dto.PE_USER_ID || typeof dto.PE_USER_ID !== "string") {
    throw new Error("PE_USER_ID é obrigatório e deve ser uma string");
  }
  if (dto.PE_USER_ID.length > 191) {
    throw new Error("PE_USER_ID não pode exceder 191 caracteres");
  }

  return {
    PE_USER_ID: String(dto.PE_USER_ID).trim(),
  };
}
