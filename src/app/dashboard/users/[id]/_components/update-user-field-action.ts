"use server";

import type { RowDataPacket } from "mysql2/promise";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import dbService from "@/database/dbConnection";
import { AUTH_TABLES } from "@/database/shared/auth/auth.types";
import { auth } from "@/lib/auth/auth";

const UserFieldSchema = z.enum([
  "name",
  "email",
  "role",
  "personId",
  "sellerId",
]);
const UserRoleSchema = z.enum(["admin", "user"]);
const UserIdSchema = z.string().min(1, "ID do usuário é obrigatório");

type UserField = z.infer<typeof UserFieldSchema>;

interface UserIdRecord extends RowDataPacket {
  id: string;
}

type UpdateUserFieldInput = {
  userId: string;
  field: UserField;
  value: unknown;
};

type UpdateUserFieldResult =
  | { success: true; message: string; value: string | number | null }
  | { success: false; message: string };

function parseNumericId(value: unknown, label: string): number | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const numericValue = Number(value);

  if (!Number.isInteger(numericValue) || numericValue < 0) {
    throw new Error(`${label} deve ser um número inteiro válido`);
  }

  return numericValue;
}

function parseUpdateInput(input: UpdateUserFieldInput): {
  userId: string;
  field: UserField;
  column: string;
  value: string | number | null;
} {
  const userId = UserIdSchema.parse(input.userId);
  const field = UserFieldSchema.parse(input.field);

  switch (field) {
    case "name": {
      const value = z
        .string()
        .trim()
        .min(1, "Nome é obrigatório")
        .max(255, "Nome muito longo")
        .parse(input.value);
      return { userId, field, column: "name", value };
    }
    case "email": {
      const value = z
        .string()
        .trim()
        .email("E-mail inválido")
        .max(255, "E-mail muito longo")
        .parse(input.value);
      return { userId, field, column: "email", value };
    }
    case "role": {
      const value = UserRoleSchema.parse(input.value);
      return { userId, field, column: "role", value };
    }
    case "personId": {
      return {
        userId,
        field,
        column: "personId",
        value: parseNumericId(input.value, "ID Cliente"),
      };
    }
    case "sellerId": {
      return {
        userId,
        field,
        column: "sellerId",
        value: parseNumericId(input.value, "ID Vendedor"),
      };
    }
  }
}

export async function updateUserFieldAction(
  input: UpdateUserFieldInput,
): Promise<UpdateUserFieldResult> {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });

  if (!session) {
    return { success: false, message: "Não autenticado" };
  }

  const hasAccess = await auth.api.userHasPermission({
    headers: requestHeaders,
    body: { permissions: { user: ["update"] } },
  });

  if (!hasAccess.success) {
    return { success: false, message: "Sem permissão para editar usuários" };
  }

  try {
    const { userId, field, column, value } = parseUpdateInput(input);

    if (field === "email") {
      const existingUsers = await dbService.selectExecute<UserIdRecord>(
        `SELECT id FROM ${AUTH_TABLES.USER} WHERE email = ? AND id <> ? LIMIT 1`,
        [value, userId],
      );

      if (existingUsers.length > 0) {
        return { success: false, message: "Este e-mail já está em uso" };
      }
    }

    await dbService.modifyExecute(
      `UPDATE ${AUTH_TABLES.USER} SET ${column} = ?, updatedAt = NOW() WHERE id = ?`,
      [value, userId],
    );

    revalidatePath(`/dashboard/users/${userId}`);
    revalidatePath("/dashboard/users");

    return {
      success: true,
      message: "Cadastro do usuário atualizado com sucesso",
      value,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.issues[0]?.message ?? "Dados inválidos",
      };
    }

    const message =
      error instanceof Error ? error.message : "Falha ao atualizar usuário";
    return { success: false, message };
  }
}
