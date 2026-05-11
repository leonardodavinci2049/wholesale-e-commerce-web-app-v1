"use server";

import { z } from "zod";
import { auth } from "@/lib/auth/auth";
import AuthService from "@/services/db/auth/auth.service";

type ResendVerificationState = {
  success: boolean;
  message: string;
} | null;

const resendVerificationSchema = z.object({
  email: z
    .string({ message: "Email é obrigatório." })
    .trim()
    .min(1, "Email é obrigatório.")
    .email("Informe um email válido.")
    .max(255, "O email deve ter no máximo 255 caracteres.")
    .transform((email) => email.toLowerCase()),
});

async function resendVerificationAction(
  _prevState: ResendVerificationState,
  formData: FormData,
): Promise<ResendVerificationState> {
  try {
    const rawEmail = formData.get("email");

    const validationResult = resendVerificationSchema.safeParse({
      email: typeof rawEmail === "string" ? rawEmail : "",
    });

    if (!validationResult.success) {
      return {
        success: false,
        message: validationResult.error.issues[0]?.message || "Email inválido.",
      };
    }

    const { email } = validationResult.data;

    const userResult = await AuthService.findUserByEmail({ email });

    if (!userResult.success) {
      return {
        success: false,
        message:
          userResult.error ||
          "Não foi possível validar o email no momento. Tente novamente.",
      };
    }

    if (!userResult.data) {
      return {
        success: false,
        message: "Não encontramos um cadastro para este email.",
      };
    }

    if (userResult.data.emailVerified) {
      return {
        success: true,
        message: "Seu email já foi verificado. Você já pode fazer login.",
      };
    }

    await auth.api.sendVerificationEmail({
      body: {
        email,
      },
    });

    return {
      success: true,
      message:
        "Enviamos um novo email de verificação para sua caixa de entrada.",
    };
  } catch (error) {
    console.error("Erro ao reenviar email de verificação:", error);

    return {
      success: false,
      message:
        "Não foi possível reenviar o email agora. Tente novamente em instantes.",
    };
  }
}

export default resendVerificationAction;
