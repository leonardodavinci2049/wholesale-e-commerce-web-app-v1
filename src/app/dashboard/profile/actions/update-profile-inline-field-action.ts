"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { createLogger } from "@/core/logger";
import { CACHE_TAGS } from "@/lib/cache-config";
import { getAuthContext } from "@/server/auth-context";
import {
  CustomerInlineError,
  customerInlineServiceApi,
} from "@/services/api-main/customer-inline";

const logger = createLogger("profile-update-inline-field-action");

const PROFILE_EDITABLE_FIELDS = {
  customerName: {
    apiField: "NOME",
    label: "Nome",
    fieldType: 1 as const,
    normalizeValue: (value: string) => value.trim(),
  },
  phone: {
    apiField: "FONE1",
    label: "Telefone",
    fieldType: 1 as const,
    normalizeValue: (value: string) => value.replace(/\D/g, ""),
  },
  whatsapp: {
    apiField: "WHATAPP1",
    label: "WhatsApp",
    fieldType: 1 as const,
    normalizeValue: (value: string) => value.replace(/\D/g, ""),
  },
  email: {
    apiField: "EMAIL_DE_LOGIN",
    label: "E-mail",
    fieldType: 1 as const,
    normalizeValue: (value: string) => value.trim(),
  },
  companyName: {
    apiField: "RAZAO_SOCIAL",
    label: "Razão Social",
    fieldType: 1 as const,
    normalizeValue: (value: string) => value.trim(),
  },
  tradeName: {
    apiField: "NOME_FANTASIA",
    label: "Nome Fantasia",
    fieldType: 1 as const,
    normalizeValue: (value: string) => value.trim(),
  },
  birthDate: {
    apiField: "DATADONASCIMENTO",
    label: "Data de Nascimento",
    fieldType: 4 as const,
    normalizeValue: (value: string) => value.trim(),
  },
  sellerId: {
    apiField: "ID_VENDEDOR",
    label: "Vendedor Vinculado",
    fieldType: 2 as const,
    normalizeValue: (value: string) => value.replace(/\D/g, ""),
  },
} as const;

const profileEditableFieldKeys = Object.keys(PROFILE_EDITABLE_FIELDS) as [
  keyof typeof PROFILE_EDITABLE_FIELDS,
  ...(keyof typeof PROFILE_EDITABLE_FIELDS)[],
];

type ProfileEditableFieldKey = keyof typeof PROFILE_EDITABLE_FIELDS;

const UpdateProfileInlineFieldSchema = z.object({
  customerId: z.number().int().positive(),
  field: z.enum(profileEditableFieldKeys),
  value: z.string().max(200),
});

type UpdateProfileInlineFieldActionResult = {
  success: boolean;
  message: string;
};

function normalizeFieldValue(
  field: ProfileEditableFieldKey,
  value: string,
): string {
  return PROFILE_EDITABLE_FIELDS[field].normalizeValue(value);
}

function getTodayDateInputValue(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export async function updateProfileInlineFieldAction(
  customerId: number,
  field: ProfileEditableFieldKey,
  value: string,
): Promise<UpdateProfileInlineFieldActionResult> {
  try {
    const validated = UpdateProfileInlineFieldSchema.parse({
      customerId,
      field,
      value,
    });

    const { apiContext } = await getAuthContext();
    const fieldConfig = PROFILE_EDITABLE_FIELDS[validated.field];
    const normalizedValue = normalizeFieldValue(
      validated.field,
      validated.value,
    );

    if (
      validated.field === "birthDate" &&
      normalizedValue > getTodayDateInputValue()
    ) {
      return {
        success: false,
        message: "Data de nascimento não pode ser futura",
      };
    }

    await customerInlineServiceApi.updateField({
      ...apiContext,
      pe_register_id: validated.customerId,
      pe_field_type: fieldConfig.fieldType,
      pe_field: fieldConfig.apiField,
      pe_value_str: fieldConfig.fieldType === 1 ? normalizedValue : "",
      pe_value_int:
        fieldConfig.fieldType === 2
          ? Number.parseInt(normalizedValue, 10) || 0
          : 0,
      pe_value_numeric: 0,
      pe_value_date:
        fieldConfig.fieldType === 4 ? normalizedValue || null : null,
    });

    revalidateTag(CACHE_TAGS.customer(String(validated.customerId)), "seconds");
    revalidateTag(CACHE_TAGS.customers, "seconds");
    revalidatePath("/dashboard/profile");

    return {
      success: true,
      message: `${fieldConfig.label} atualizado com sucesso`,
    };
  } catch (error) {
    logger.error("Erro ao atualizar campo inline do perfil", error);

    if (error instanceof CustomerInlineError) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: false,
      message: "Erro inesperado ao atualizar campo do perfil",
    };
  }
}
