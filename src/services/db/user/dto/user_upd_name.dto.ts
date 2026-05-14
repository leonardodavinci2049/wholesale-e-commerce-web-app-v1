export interface UserUpdNameDto {
  PE_ORGANIZATION_ID: string;
  PE_USER_ID: string;
  PE_USER_NAME: string;
}

/**
 * Valida o DTO para atualizar nome do usuário
 */
export function validateUserUpdNameDto(data: unknown): UserUpdNameDto {
  if (data !== undefined && data !== null && typeof data !== "object") {
    throw new Error("Dados inválidos fornecidos");
  }

  const dto = (data as Record<string, unknown>) || {};

  // Validação de PE_ORGANIZATION_ID obrigatório
  if (!dto.PE_ORGANIZATION_ID || typeof dto.PE_ORGANIZATION_ID !== "string") {
    throw new Error("PE_ORGANIZATION_ID é obrigatório e deve ser uma string");
  }
  if (dto.PE_ORGANIZATION_ID.length > 191) {
    throw new Error("PE_ORGANIZATION_ID não pode exceder 191 caracteres");
  }

  // Validação de PE_USER_ID obrigatório
  if (!dto.PE_USER_ID || typeof dto.PE_USER_ID !== "string") {
    throw new Error("PE_USER_ID é obrigatório e deve ser uma string");
  }
  if (dto.PE_USER_ID.length > 200) {
    throw new Error("PE_USER_ID não pode exceder 200 caracteres");
  }

  // Validação de PE_USER_NAME obrigatório
  if (!dto.PE_USER_NAME || typeof dto.PE_USER_NAME !== "string") {
    throw new Error("PE_USER_NAME é obrigatório e deve ser uma string");
  }
  if (dto.PE_USER_NAME.length > 191) {
    throw new Error("PE_USER_NAME não pode exceder 191 caracteres");
  }

  return {
    PE_ORGANIZATION_ID: String(dto.PE_ORGANIZATION_ID).trim(),
    PE_USER_ID: String(dto.PE_USER_ID).trim(),
    PE_USER_NAME: String(dto.PE_USER_NAME).trim(),
  };
}
