export interface UserUpdPersonIdDto {
  PE_ORGANIZATION_ID: string;
  PE_USER_ID: string;
  PE_PERSON_ID: string;
}

/**
 * Valida o DTO para atualizar person_id do usuário
 */
export function validateUserUpdPersonIdDto(data: unknown): UserUpdPersonIdDto {
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

  // Validação de PE_PERSON_ID obrigatório
  if (!dto.PE_PERSON_ID || typeof dto.PE_PERSON_ID !== "string") {
    throw new Error("PE_PERSON_ID é obrigatório e deve ser uma string");
  }
  if (dto.PE_PERSON_ID.length > 191) {
    throw new Error("PE_PERSON_ID não pode exceder 191 caracteres");
  }

  return {
    PE_ORGANIZATION_ID: String(dto.PE_ORGANIZATION_ID).trim(),
    PE_USER_ID: String(dto.PE_USER_ID).trim(),
    PE_PERSON_ID: String(dto.PE_PERSON_ID).trim(),
  };
}
