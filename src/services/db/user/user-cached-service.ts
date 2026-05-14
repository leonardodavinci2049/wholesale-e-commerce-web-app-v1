import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { createLogger } from "@/core/logger";
import type { User } from "@/database/schema";
import type { User as AuthUser } from "@/database/shared/auth/auth.types";
import { CACHE_TAGS } from "@/lib/cache-config";
import type { TblUserFindAll, TblUserFindById } from "./types/user.type";
import userService, { UserAuthService } from "./user.service";

const logger = createLogger("UserCachedService");

export type UserListItem = User;
export type UserDetail = User;

function transformUser(user: TblUserFindById | TblUserFindAll): User {
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
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.user(userId), CACHE_TAGS.users);

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
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.users);

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
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.user(userId), CACHE_TAGS.users);

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
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.users, CACHE_TAGS.members);

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
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.users);

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
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.users, CACHE_TAGS.members);

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
