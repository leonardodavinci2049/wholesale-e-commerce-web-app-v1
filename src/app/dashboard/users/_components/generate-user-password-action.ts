"use server";

import crypto from "node:crypto";
import { hashPassword } from "better-auth/crypto";
import type { RowDataPacket } from "mysql2/promise";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import dbService from "@/database/dbConnection";
import { AUTH_TABLES } from "@/database/shared/auth/auth.types";
import { auth } from "@/lib/auth/auth";

type GenerateUserPasswordResult = {
  success: boolean;
  password: string | null;
  error: string | null;
};

type AccountRow = RowDataPacket & {
  id: string;
};

type UserRow = RowDataPacket & {
  id: string;
};

function generatePassword() {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const randomBytes = crypto.randomBytes(10);

  return Array.from(randomBytes)
    .map((byte) => chars[byte % chars.length])
    .join("");
}

export async function generateUserPasswordAction(
  userId: string,
): Promise<GenerateUserPasswordResult> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session?.user.role !== "admin") {
    return {
      success: false,
      password: null,
      error: "Você não tem permissão para gerar senhas.",
    };
  }

  if (!userId || typeof userId !== "string") {
    return {
      success: false,
      password: null,
      error: "ID do usuário inválido.",
    };
  }

  try {
    const users = await dbService.selectExecute<UserRow>(
      `SELECT id FROM ${AUTH_TABLES.USER} WHERE id = ? LIMIT 1`,
      [userId],
    );

    if (users.length === 0) {
      return {
        success: false,
        password: null,
        error: "Usuário não encontrado.",
      };
    }

    const plainPassword = generatePassword();
    const hashedPassword = await hashPassword(plainPassword);
    const existingAccounts = await dbService.selectExecute<AccountRow>(
      `SELECT id FROM ${AUTH_TABLES.ACCOUNT} WHERE userId = ? AND providerId = 'credential' LIMIT 1`,
      [userId],
    );

    if (existingAccounts.length > 0) {
      await dbService.modifyExecute(
        `UPDATE ${AUTH_TABLES.ACCOUNT} SET password = ?, updatedAt = NOW() WHERE userId = ? AND providerId = 'credential'`,
        [hashedPassword, userId],
      );
    } else {
      const accountId = crypto.randomUUID();

      await dbService.modifyExecute(
        `INSERT INTO ${AUTH_TABLES.ACCOUNT} (id, accountId, providerId, userId, password, createdAt, updatedAt) VALUES (?, ?, 'credential', ?, ?, NOW(), NOW())`,
        [accountId, userId, userId, hashedPassword],
      );
    }

    revalidatePath("/dashboard/users");
    revalidatePath(`/dashboard/users/${userId}`);

    return {
      success: true,
      password: plainPassword,
      error: null,
    };
  } catch (error) {
    console.error("Generate user password error:", error);

    return {
      success: false,
      password: null,
      error: "Falha ao gerar senha.",
    };
  }
}
