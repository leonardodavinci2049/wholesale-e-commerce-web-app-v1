import "server-only";

import { z } from "zod";
import dbService, {
  ErroConexaoBancoDados,
  ErroExecucaoConsulta,
} from "@/database/dbConnection";

import {
  type Account,
  type AccountEntity,
  AUTH_TABLES,
  AuthValidationError,
  type ModifyResponse,
  mapAccountEntityToDto,
  type ServiceResponse,
} from "@/database/shared/auth/auth.types";

const IdSchema = z
  .string()
  .min(1, "ID é obrigatório")
  .max(128, "ID muito longo");

function validateId(id: string, fieldName: string): void {
  const result = IdSchema.safeParse(id);
  if (!result.success) {
    throw new AuthValidationError(
      `${fieldName}: ${result.error.issues[0].message}`,
      fieldName,
    );
  }
}

function handleError<T>(error: unknown, operation: string): ServiceResponse<T> {
  console.error(`[AccountService] Erro em ${operation}:`, error);

  if (error instanceof AuthValidationError) {
    return { success: false, data: null, error: error.message };
  }

  if (error instanceof ErroConexaoBancoDados) {
    return {
      success: false,
      data: null,
      error: "Erro de conexão com o banco de dados",
    };
  }

  if (error instanceof ErroExecucaoConsulta) {
    return {
      success: false,
      data: null,
      error: "Erro ao processar a consulta no banco de dados",
    };
  }

  return {
    success: false,
    data: null,
    error: "Ocorreu um erro interno inesperado",
  };
}

function handleModifyError(error: unknown, operation: string): ModifyResponse {
  console.error(`[AccountService] Erro em ${operation}:`, error);

  if (error instanceof AuthValidationError) {
    return { success: false, affectedRows: 0, error: error.message };
  }

  return {
    success: false,
    affectedRows: 0,
    error: "Erro ao realizar operação de modificação",
  };
}

async function findAccountsByUserId(params: {
  userId: string;
}): Promise<ServiceResponse<Account[]>> {
  try {
    validateId(params.userId, "userId");

    const query = `
      SELECT 
        id, accountId, providerId, userId, accessToken, refreshToken, 
        idToken, accessTokenExpiresAt, refreshTokenExpiresAt, scope, 
        password, createdAt, updatedAt
      FROM ${AUTH_TABLES.ACCOUNT}
      WHERE userId = ?
      ORDER BY createdAt DESC
    `;

    const results = await dbService.selectExecute<AccountEntity>(query, [
      params.userId,
    ]);

    return {
      success: true,
      data: results.map(mapAccountEntityToDto),
      error: null,
    };
  } catch (error) {
    return handleError<Account[]>(error, "findAccountsByUserId");
  }
}

async function deleteAccount(params: {
  accountId: string;
}): Promise<ModifyResponse> {
  try {
    validateId(params.accountId, "accountId");

    const query = `
      DELETE FROM ${AUTH_TABLES.ACCOUNT}
      WHERE id = ?
    `;

    const result = await dbService.modifyExecute(query, [params.accountId]);

    return {
      success: result.affectedRows > 0,
      affectedRows: result.affectedRows,
      error:
        result.affectedRows === 0
          ? "Conta não encontrada ou já deletada"
          : null,
    };
  } catch (error) {
    return handleModifyError(error, "deleteAccount");
  }
}

export const AccountService = {
  findAccountsByUserId,
  deleteAccount,
} as const;

export default AccountService;

export type {
  Account,
  ModifyResponse,
  ServiceResponse,
} from "@/database/shared/auth/auth.types";
