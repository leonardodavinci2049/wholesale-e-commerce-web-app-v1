"use server";

import { serverEnvs } from "@/core/config/envs.server";
import { createLogger } from "@/core/logger";
import {
  ApiValidationError,
  isApiAvailabilityError,
} from "@/lib/axios/base-api-service";
import {
  type CustomerCreateRequest,
  CustomerError,
  customerGeneralServiceApi,
} from "@/services/api-main/customer-general";
import { PERSON_TYPE_ID, registerLeadSchema } from "../schema";

const logger = createLogger("SubmitRegisterLead");

export type RegisterLeadState =
  | { status: "success"; message: string; customerId?: number }
  | {
      status: "error";
      message: string;
      errors?: Record<string, string>;
      values?: Record<string, string>;
      isDuplicate?: boolean;
    }
  | null;

const SUCCESS_MESSAGE =
  "Pré-cadastro recebido com sucesso. Vamos analisar suas informações e retornar pelo WhatsApp ou e-mail informado.";

/** Termos (pt/en) que indicam duplicidade de cadastro retornada pela API. */
const DUPLICATE_KEYWORDS = [
  "já cadastrado",
  "ja cadastrado",
  "duplicado",
  "duplicate",
  "already exists",
  "existente",
  "existe",
];

function onlyDigits(value: string | undefined | null): string | undefined {
  if (value === undefined || value === null) return undefined;
  const digits = value.replace(/\D/g, "");
  return digits || undefined;
}

function formDataToStrings(formData: FormData): Record<string, string> {
  const values: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    values[key] = typeof value === "string" ? value : "";
  }
  return values;
}

function zodIssuesToErrors(error: unknown): Record<string, string> {
  if (error && typeof error === "object" && "issues" in error) {
    const issues = (
      error as { issues: Array<{ path: PropertyKey[]; message: string }> }
    ).issues;
    const errors: Record<string, string> = {};
    for (const issue of issues) {
      const field = String(issue.path[0] ?? "_form");
      if (!errors[field]) errors[field] = issue.message;
    }
    return errors;
  }
  return {};
}

/**
 * Server Action para o pré-cadastro de novos clientes B2B.
 *
 * - Aplica honeypot anti-bot.
 * - Normaliza campos (dígitos, lower-case de e-mail).
 * - Valida com Zod (schema específico da landing).
 * - Mapeia para `CustomerGeneralServiceApi.createCustomer`.
 * - Trata duplicidade, indisponibilidade e erros genéricos.
 * - Preserva os valores digitados (com máscara) para reexibição em caso de erro.
 */
export async function submitRegisterLead(
  _prevState: RegisterLeadState,
  formData: FormData,
): Promise<RegisterLeadState> {
  const rawValues = formDataToStrings(formData);

  // Honeypot: preenchido => assume-se bot. Responde como sucesso sem chamar a API.
  if (rawValues.website && rawValues.website.trim() !== "") {
    logger.warn("Honeypot preenchido — possível submissão automática ignorada");
    return { status: "success", message: SUCCESS_MESSAGE };
  }

  const normalized = {
    ...rawValues,
    email: (rawValues.email ?? "").trim().toLowerCase(),
    cnpj: onlyDigits(rawValues.cnpj),
    cpf: onlyDigits(rawValues.cpf),
    phone: onlyDigits(rawValues.phone),
    whatsapp: onlyDigits(rawValues.whatsapp),
    zipCode: onlyDigits(rawValues.zipCode),
  };

  const parsed = registerLeadSchema.safeParse(normalized);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Revise os campos destacados antes de enviar.",
      errors: zodIssuesToErrors(parsed.error),
      values: rawValues,
    };
  }

  const data = parsed.data;
  const isPJ = data.personType === "PJ";
  const personTypeId = isPJ ? PERSON_TYPE_ID.PJ : PERSON_TYPE_ID.PF;

  const payload: CustomerCreateRequest = {
    // Contexto fixo para submissões públicas, sem usuário logado.
    pe_user_id: serverEnvs.USER_ID,
    pe_user_name: serverEnvs.USER_NAME,
    pe_user_role: serverEnvs.USER_ROLE,
    pe_person_id: serverEnvs.PERSON_ID,
    pe_name: data.name,
    pe_email: data.email,
    pe_person_type_id: personTypeId,
    ...(isPJ
      ? { pe_cnpj: data.cnpj, pe_company_name: data.companyName, pe_cpf: "" }
      : { pe_cpf: data.cpf }),
    pe_phone: data.phone || undefined,
    pe_whatsapp: data.whatsapp,
    pe_image: "",
    pe_zip_code: data.zipCode,
    pe_address: data.address,
    pe_address_number: data.addressNumber,
    pe_complement: data.complement || undefined,
    pe_neighborhood: data.neighborhood,
    pe_city: data.city,
    pe_state: data.state.toUpperCase(),
    pe_notes: data.notes || undefined,
  };

  try {
    const response = await customerGeneralServiceApi.createCustomer(payload);
    const customerId = response.data?.[0]?.sp_return_id || response.recordId;

    return {
      status: "success",
      message: SUCCESS_MESSAGE,
      customerId: customerId > 0 ? customerId : undefined,
    };
  } catch (error) {
    const apiMessage =
      error instanceof Error ? error.message.toLowerCase() : "";

    const isDuplicate =
      error instanceof CustomerError &&
      DUPLICATE_KEYWORDS.some((keyword) => apiMessage.includes(keyword));

    if (isDuplicate) {
      return {
        status: "error",
        isDuplicate: true,
        message:
          "Encontramos um cadastro com esses dados. Se você já é cliente, acesse o login ou fale com nossa equipe pelo WhatsApp.",
        values: rawValues,
      };
    }

    logger.error("Erro ao criar pré-cadastro de cliente", error);

    if (isApiAvailabilityError(error)) {
      return {
        status: "error",
        message:
          "Não conseguimos concluir agora. Revise sua conexão e tente novamente.",
        values: rawValues,
      };
    }

    if (error instanceof ApiValidationError) {
      return {
        status: "error",
        message:
          "Não foi possível enviar seu pré-cadastro neste momento. Verifique os dados e tente novamente, ou fale com nossa equipe pelo WhatsApp.",
        values: rawValues,
      };
    }

    return {
      status: "error",
      message:
        "Não foi possível enviar agora. Tente novamente ou fale com nossa equipe pelo WhatsApp.",
      values: rawValues,
    };
  }
}
