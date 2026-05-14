"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import dbService from "@/database/dbConnection";
import { AUTH_TABLES } from "@/database/shared/auth/auth.types";
import { auth } from "@/lib/auth/auth";

export async function updatePersonIdAction(
  userId: string,
  organizationId: string,
  personId: number | null,
) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return { success: false, message: "Não autenticado" };
  }

  const hasAccess = await auth.api.userHasPermission({
    headers: await headers(),
    body: { permissions: { user: ["update"] } },
  });

  if (!hasAccess.success) {
    return { success: false, message: "Sem permissão para editar usuários" };
  }

  if (personId != null && (!Number.isInteger(personId) || personId < 0)) {
    return {
      success: false,
      message: "Person ID deve ser um número inteiro válido",
    };
  }

  try {
    await dbService.modifyExecute(
      `UPDATE ${AUTH_TABLES.MEMBER} SET personId = ? WHERE userId = ? AND organizationId = ?`,
      [personId, userId, organizationId],
    );

    revalidatePath(`/dashboard/users/${userId}`);
    revalidatePath("/dashboard/users");

    return { success: true, message: "Person ID atualizado com sucesso" };
  } catch (error) {
    const e = error as Error;
    return {
      success: false,
      message: e.message || "Falha ao atualizar Person ID",
    };
  }
}
