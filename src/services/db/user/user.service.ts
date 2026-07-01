import "server-only";

import { z } from "zod";
import { MESSAGES } from "@/core/constants/globalConstants";
import { createLogger } from "@/core/logger";

import dbService, {
  ErroConexaoBancoDados,
  ErroExecucaoConsulta,
} from "@/database/dbConnection";
import type { User as DbUser } from "@/database/schema";
import {
  AUTH_TABLES,
  type User as AuthUser,
  AuthValidationError,
  mapUserEntityToDto,
  type ServiceResponse,
  type UserEntity,
} from "@/database/shared/auth/auth.types";
import { processProcedureResultMutation } from "@/database/utils/process-procedure-result.mutation";
import { processProcedureResultQuery } from "@/database/utils/process-procedure-result.query";
import { ResultModel } from "@/database/utils/result.model";
import { validateUserFindAllDto } from "./dto/user_find_all.dto";
import { validateUserFindIdDto } from "./dto/user_find_id.dto";
import { validateUserUpdNameDto } from "./dto/user_upd_name.dto";
import { UserFindAllQuery } from "./query/user_find_all.query";
import { UserFindIdQuery } from "./query/user_find_id.query";
import { UserUpdNameQuery } from "./query/user_upd_name.query";
import type {
  SpResultRecordFindByIdType,
  SpResultRecordFindType,
  SpResultRecordUpdateType,
  TblUserFindAll,
  TblUserFindById,
} from "./types/user.type";

const logger = createLogger("UserService");

export class UserService {
  async execUserFindIdQuery(dataJsonDto: unknown): Promise<ResultModel> {
    try {
      const validatedDto = validateUserFindIdDto(dataJsonDto);

      const queryString = await UserFindIdQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordFindByIdType;

      return processProcedureResultQuery<TblUserFindById>(
        resultData as unknown[],
        "User not found",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, "", []);
    }
  }

  async execUserFindAllQuery(dataJsonDto: unknown): Promise<ResultModel> {
    try {
      const validatedDto = validateUserFindAllDto(dataJsonDto);

      const queryString = await UserFindAllQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordFindType;

      return processProcedureResultQuery<TblUserFindAll>(
        resultData as unknown[],
        "Users not found",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, "", []);
    }
  }

  async execUserUpdNameQuery(dataJsonDto: unknown): Promise<ResultModel> {
    try {
      const validatedDto = validateUserUpdNameDto(dataJsonDto);

      const queryString = await UserUpdNameQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordUpdateType;

      return processProcedureResultMutation(
        resultData as unknown[],
        "User name update failed",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, "", []);
    }
  }
}

const userService = new UserService();
export default userService;

// ============================================================================
// Auth User Methods (migrated from auth.service.ts)
// ============================================================================

const IdSchema = z
  .string()
  .min(1, "ID é obrigatório")
  .max(128, "ID muito longo");
const IdArraySchema = z.array(IdSchema);

function validateId(id: string, fieldName: string): void {
  const result = IdSchema.safeParse(id);
  if (!result.success) {
    throw new AuthValidationError(
      `${fieldName}: ${result.error.issues[0].message}`,
      fieldName,
    );
  }
}

function validateIdArray(ids: string[], fieldName: string): void {
  const result = IdArraySchema.safeParse(ids);
  if (!result.success) {
    throw new AuthValidationError(
      `${fieldName}: ${result.error.issues[0].message}`,
      fieldName,
    );
  }
}

function handleError<T>(error: unknown, operation: string): ServiceResponse<T> {
  console.error(`[UserAuthService] Erro em ${operation}:`, error);

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

async function findUserById(params: {
  userId: string;
}): Promise<ServiceResponse<AuthUser>> {
  try {
    validateId(params.userId, "userId");

    const query = `
      SELECT 
        id,personId,  sellerId, name, email, emailVerified, image, 
        createdAt, updatedAt, twoFactorEnabled, 
        role, banned, banReason, banExpires
      FROM ${AUTH_TABLES.USER}
      WHERE id = ?
      LIMIT 1
    `;

    const results = await dbService.selectExecute<UserEntity>(query, [
      params.userId,
    ]);

    if (results.length === 0) {
      return { success: true, data: null, error: null };
    }

    return {
      success: true,
      data: mapUserEntityToDto(results[0]),
      error: null,
    };
  } catch (error) {
    return handleError<AuthUser>(error, "findUserById");
  }
}

async function findUsersExcludingIds(params: {
  excludeUserIds: string[];
}): Promise<ServiceResponse<AuthUser[]>> {
  try {
    validateIdArray(params.excludeUserIds, "excludeUserIds");

    if (params.excludeUserIds.length === 0) {
      const query = `
        SELECT 
          id, name, email, emailVerified, image, 
          createdAt, updatedAt, twoFactorEnabled, 
          role, banned, banReason, banExpires
        FROM ${AUTH_TABLES.USER}
        ORDER BY name ASC
      `;

      const results = await dbService.selectExecute<UserEntity>(query);
      return {
        success: true,
        data: results.map(mapUserEntityToDto),
        error: null,
      };
    }

    const placeholders = params.excludeUserIds.map(() => "?").join(", ");

    const query = `
      SELECT 
        id, name, email, emailVerified, image, 
        createdAt, updatedAt, twoFactorEnabled, 
        role, banned, banReason, banExpires
      FROM ${AUTH_TABLES.USER}
      WHERE id NOT IN (${placeholders})
      ORDER BY name ASC
    `;

    const results = await dbService.selectExecute<UserEntity>(
      query,
      params.excludeUserIds,
    );

    return {
      success: true,
      data: results.map(mapUserEntityToDto),
      error: null,
    };
  } catch (error) {
    return handleError<AuthUser[]>(error, "findUsersExcludingIds");
  }
}

async function findNonMemberUsers(params: {
  organizationId: string;
}): Promise<ServiceResponse<AuthUser[]>> {
  try {
    validateId(params.organizationId, "organizationId");

    const query = `
      SELECT 
        u.id, u.name, u.email, u.emailVerified, u.image, 
        u.createdAt, u.updatedAt, u.twoFactorEnabled, 
        u.role, u.banned, u.banReason, u.banExpires
      FROM ${AUTH_TABLES.USER} u
      WHERE u.id NOT IN (
        SELECT m.userId 
        FROM ${AUTH_TABLES.MEMBER} m 
        WHERE m.organizationId = ?
      )
      ORDER BY u.name ASC
    `;

    const results = await dbService.selectExecute<UserEntity>(query, [
      params.organizationId,
    ]);

    return {
      success: true,
      data: results.map(mapUserEntityToDto),
      error: null,
    };
  } catch (error) {
    return handleError<AuthUser[]>(error, "findNonMemberUsers");
  }
}

async function findUsersWithoutAnyOrganization(): Promise<
  ServiceResponse<AuthUser[]>
> {
  try {
    const query = `
      SELECT 
        u.id, u.name, u.email, u.emailVerified, u.image, 
        u.createdAt, u.updatedAt, u.twoFactorEnabled, 
        u.role, u.banned, u.banReason, u.banExpires
      FROM ${AUTH_TABLES.USER} u
      WHERE u.id NOT IN (
        SELECT DISTINCT m.userId 
        FROM ${AUTH_TABLES.MEMBER} m
      )
      ORDER BY u.name ASC
    `;

    const results = await dbService.selectExecute<UserEntity>(query);

    return {
      success: true,
      data: results.map(mapUserEntityToDto),
      error: null,
    };
  } catch (error) {
    return handleError<AuthUser[]>(error, "findUsersWithoutAnyOrganization");
  }
}

export const UserAuthService = {
  findUserById,
  findUsersExcludingIds,
  findNonMemberUsers,
  findUsersWithoutAnyOrganization,
} as const;

export type UserListItem = DbUser;
export type UserDetail = DbUser;

function transformUser(user: TblUserFindById | TblUserFindAll): DbUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    emailVerified: "emailVerified" in user ? user.emailVerified === 1 : false,
    image: user.image || null,
    twoFactorEnabled:
      "twoFactorEnabled" in user ? user.twoFactorEnabled === 1 : false,
    role: user.role,
    banned: "banned" in user ? user.banned === 1 : false,
    banReason: "banReason" in user ? user.banReason || null : null,
    banExpires: "banExpires" in user ? user.banExpires || null : null,
    createdAt: user.createdAt,
    updatedAt: "updatedAt" in user ? user.updatedAt : user.createdAt,
  };
}

export async function getUserById(userId: string): Promise<UserDetail | null> {
  try {
    const response = await userService.execUserFindIdQuery({
      PE_USER_ID: userId,
    });

    if (response.statusCode !== 100200 || !response.data) {
      logger.warn(`User not found: ${userId}`);
      return null;
    }

    const rawUser = Array.isArray(response.data)
      ? response.data[0]
      : response.data;

    return transformUser(rawUser);
  } catch (error) {
    logger.error(`Failed to fetch user by ID ${userId}:`, error);
    return null;
  }
}

export async function getAllUsers(
  organizationId?: string,
  searchTerm?: string,
  flagMemberOff?: number,
  qtRegistros?: number,
  paginaId?: number,
  colunaId?: number,
  ordemId?: number,
): Promise<UserListItem[]> {
  try {
    const response = await userService.execUserFindAllQuery({
      PE_ORGANIZATION_ID: organizationId,
      PE_SEARCH_USER: searchTerm,
      PE_FLAG_MEMBER_OFF: flagMemberOff,
      PE_QT_REGISTROS: qtRegistros,
      PE_PAGINA_ID: paginaId,
      PE_COLUNA_ID: colunaId,
      PE_ORDEM_ID: ordemId,
    });

    if (response.statusCode !== 100200 || !response.data) {
      logger.error("Error loading users:", response.message);
      return [];
    }

    const rawUsers = Array.isArray(response.data) ? response.data : [];

    return rawUsers.map(transformUser);
  } catch (error) {
    logger.error("Failed to fetch users:", error);
    return [];
  }
}

export async function getAuthUserById(
  userId: string,
): Promise<AuthUser | null> {
  try {
    const response = await UserAuthService.findUserById({ userId });

    if (!response.success) {
      logger.warn(`Auth user not found: ${userId}`);
      return null;
    }

    return response.data;
  } catch (error) {
    logger.error(`Failed to fetch auth user by ID ${userId}:`, error);
    return null;
  }
}

export async function getNonMemberUsers(
  organizationId: string,
): Promise<AuthUser[]> {
  try {
    const response = await UserAuthService.findNonMemberUsers({
      organizationId,
    });

    if (!response.success || !response.data) {
      logger.error("Error loading non-member users:", response.error);
      return [];
    }

    return response.data;
  } catch (error) {
    logger.error(
      `Failed to fetch non-member users for org ${organizationId}:`,
      error,
    );
    return [];
  }
}

export async function getUsersExcludingIds(
  excludeUserIds: string[],
): Promise<AuthUser[]> {
  try {
    const response = await UserAuthService.findUsersExcludingIds({
      excludeUserIds,
    });

    if (!response.success || !response.data) {
      logger.error("Error loading users excluding IDs:", response.error);
      return [];
    }

    return response.data;
  } catch (error) {
    logger.error("Failed to fetch users excluding IDs:", error);
    return [];
  }
}

export async function getUsersWithoutAnyOrganization(): Promise<AuthUser[]> {
  try {
    const response = await UserAuthService.findUsersWithoutAnyOrganization();

    if (!response.success || !response.data) {
      logger.error("Error loading users without organization:", response.error);
      return [];
    }

    return response.data;
  } catch (error) {
    logger.error("Failed to fetch users without any organization:", error);
    return [];
  }
}

export type {
  ServiceResponse,
  User,
} from "@/database/shared/auth/auth.types";
