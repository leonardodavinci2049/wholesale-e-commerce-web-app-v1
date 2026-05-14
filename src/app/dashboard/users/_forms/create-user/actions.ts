"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import dbService from "@/database/dbConnection";
import { AUTH_TABLES } from "@/database/shared/auth/auth.types";
import { auth } from "@/lib/auth/auth";
import { createUserSchema } from "./schema";

export type CreateUserState = {
  success: boolean;
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    role?: string[];
  };
};

export async function createUserAction(
  _prevState: CreateUserState,
  formData: FormData,
): Promise<CreateUserState> {
  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  };

  const validatedFields = createUserSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Falha na validação",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, password, role } = validatedFields.data;

  try {
    const result = await auth.api.createUser({
      headers: await headers(),
      body: {
        name,
        email,
        password,
        role,
      },
    });

    const updateFields: string[] = ["emailVerified = 1"];
    const updateParams: (string | number)[] = [];

    updateParams.push(result.user.id);

    await dbService.modifyExecute(
      `UPDATE ${AUTH_TABLES.USER} SET ${updateFields.join(", ")} WHERE id = ?`,
      updateParams,
    );

    revalidatePath("/dashboard/users");

    return {
      success: true,
      message: "Usuário criado com sucesso",
    };
  } catch (error) {
    const e = error as Error;
    return {
      success: false,
      message: e.message || "Falha ao criar usuário",
    };
  }
}
