"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";

export type DeleteUserActionState = {
  success: boolean;
  message: string;
  errors?: {
    userId?: string[];
  };
};

export async function deleteUserAction(
  _prevState: DeleteUserActionState,
  formData: FormData,
): Promise<DeleteUserActionState> {
  const userId = formData.get("userId");
  const requestHeaders = await headers();

  const session = await auth.api.getSession({ headers: requestHeaders });

  if (!session) {
    return {
      success: false,
      message: "Não autenticado",
    };
  }

  if (typeof userId !== "string") {
    return {
      success: false,
      message: "User ID is required",
      errors: { userId: ["User ID is required"] },
    };
  }

  if (userId === session.user.id) {
    return {
      success: false,
      message: "Você não pode excluir o usuário logado.",
    };
  }

  let deletedUser: unknown;

  try {
    deletedUser = await auth.api.removeUser({
      body: { userId },
      headers: requestHeaders,
    });
  } catch (error) {
    const e = error as Error;
    return {
      success: false,
      message: e.message || "Failed to delete user",
    };
  }

  if (!deletedUser) {
    return {
      success: false,
      message: "Failed to delete user",
    };
  }

  revalidatePath("/dashboard/users");
  redirect("/dashboard/users");
}
