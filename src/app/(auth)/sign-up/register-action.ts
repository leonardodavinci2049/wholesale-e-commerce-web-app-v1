"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import {
  errorMessages,
  validateRegisterWithConfirmData,
} from "../_common-validations/validation";

// Definir o tipo do estado do formulário
type RegisterState = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string>;
} | null;

/**
 * Server Action para registro de novo usuário
 */
async function registerAction(
  _prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  try {
    // Extrair dados do FormData
    const rawData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    };

    // Validar dados com Zod
    const validationResult = validateRegisterWithConfirmData(rawData);

    if (!validationResult.success) {
      return {
        success: false,
        message: "Dados inválidos. Verifique os campos e tente novamente.",
        fieldErrors: validationResult.errors || {},
      };
    }

    // Garantir que os dados validados existem
    if (!validationResult.data) {
      return {
        success: false,
        message: "Erro na validação dos dados.",
      };
    }

    const { email, name, password } = validationResult.data;

    // Criar usuário usando Better-Auth
    await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    });

    // Se chegou até aqui, o registro foi bem-sucedido
    // Redirecionar para a página que orienta a verificar o email
    redirect(
      `/sign-up/success?success=true&email=${encodeURIComponent(email)}`,
    );
  } catch (error) {
    // Tratar erro de redirect (esperado após registro bem-sucedido)
    if (isRedirectError(error)) {
      throw error;
    }

    console.error("Erro no registro:", error);

    // Tratar erros específicos do Better-Auth
    if (typeof error === "object" && error !== null) {
      // Verificar se é erro de email duplicado (caso não detectado na verificação prévia)
      if ("message" in error) {
        const errorMessage = (error as { message?: string }).message || "";

        if (
          errorMessage.includes("already exists") ||
          errorMessage.includes("duplicate") ||
          errorMessage.includes("unique constraint")
        ) {
          return {
            success: false,
            message: errorMessages.emailExists,
          };
        }

        if (errorMessage.includes("validation")) {
          return {
            success: false,
            message: "Dados inválidos. Verifique os campos e tente novamente.",
          };
        }
      }

      // Verificar se é erro com statusCode
      if ("statusCode" in error) {
        const statusCode = (error as { statusCode?: number }).statusCode;

        if (statusCode === 400) {
          return {
            success: false,
            message: "Dados inválidos. Verifique os campos e tente novamente.",
          };
        }

        if (statusCode === 409) {
          return {
            success: false,
            message: errorMessages.emailExists,
          };
        }
      }
    }

    // Erro genérico
    return {
      success: false,
      message: errorMessages.serverError,
    };
  }
}

export default registerAction;
