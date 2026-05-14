import "server-only";

import { z } from "zod";
import dbService, {
  ErroConexaoBancoDados,
  ErroExecucaoConsulta,
} from "@/database/dbConnection";

import {
  AUTH_TABLES,
  AuthValidationError,
  type ModifyResponse,
  mapSessionEntityToDto,
  type ServiceResponse,
  type Session,
  type SessionEntity,
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
  console.error(`[SessionService] Erro em ${operation}:`, error);

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
  console.error(`[SessionService] Erro em ${operation}:`, error);

  if (error instanceof AuthValidationError) {
    return { success: false, affectedRows: 0, error: error.message };
  }

  return {
    success: false,
    affectedRows: 0,
    error: "Erro ao realizar operação de modificação",
  };
}

async function findSessionsByUserId(params: {
  userId: string;
}): Promise<ServiceResponse<Session[]>> {
  try {
    validateId(params.userId, "userId");

    const query = `
      SELECT 
        id, expiresAt, token, createdAt, updatedAt, 
        ipAddress, userAgent, userId, impersonatedBy, 
        activeOrganizationId, activeTeamId
      FROM ${AUTH_TABLES.SESSION}
      WHERE userId = ?
      ORDER BY createdAt DESC
    `;

    const results = await dbService.selectExecute<SessionEntity>(query, [
      params.userId,
    ]);

    return {
      success: true,
      data: results.map(mapSessionEntityToDto),
      error: null,
    };
  } catch (error) {
    return handleError<Session[]>(error, "findSessionsByUserId");
  }
}

async function deleteSession(params: {
  sessionId: string;
}): Promise<ModifyResponse> {
  try {
    validateId(params.sessionId, "sessionId");

    const query = `
      DELETE FROM ${AUTH_TABLES.SESSION}
      WHERE id = ?
    `;

    const result = await dbService.modifyExecute(query, [params.sessionId]);

    return {
      success: result.affectedRows > 0,
      affectedRows: result.affectedRows,
      error:
        result.affectedRows === 0
          ? "Sessão não encontrada ou já deletada"
          : null,
    };
  } catch (error) {
    return handleModifyError(error, "deleteSession");
  }
}

export const SessionService = {
  findSessionsByUserId,
  deleteSession,
} as const;

export default SessionService;

export type {
  ModifyResponse,
  ServiceResponse,
  Session,
} from "@/database/shared/auth/auth.types";
