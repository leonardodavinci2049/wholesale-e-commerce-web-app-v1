"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { createLogger } from "@/core/logger";
import { CACHE_TAGS } from "@/lib/cache-config";
import { getAuthContext } from "@/server/auth-context";
import {
  CustomerUpdError,
  customerUpdServiceApi,
} from "@/services/api-main/customer-upd";

const logger = createLogger("profile-update-customer-address-action");

const UpdateProfileCustomerAddressSchema = z.object({
  customerId: z.number().int().positive(),
  zipCode: z.string().max(100),
  address: z.string().max(300),
  addressNumber: z.string().max(100),
  complement: z.string().max(100),
  neighborhood: z.string().max(300),
  city: z.string().max(300),
  state: z.string().max(100),
  municipalityCode: z.string().max(100),
  stateCode: z.string().max(100),
});

type UpdateProfileCustomerAddressActionResult = {
  success: boolean;
  message: string;
};

function normalizeFieldValue(value: string): string {
  return value.trim();
}

export async function updateProfileCustomerAddressAction(
  customerId: number,
  values: {
    zipCode: string;
    address: string;
    addressNumber: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    municipalityCode: string;
    stateCode: string;
  },
): Promise<UpdateProfileCustomerAddressActionResult> {
  try {
    const validated = UpdateProfileCustomerAddressSchema.parse({
      customerId,
      ...values,
    });
    const { apiContext, session } = await getAuthContext();

    if (session.user.personId !== validated.customerId) {
      return {
        success: false,
        message: "Não foi possível validar o cliente do perfil.",
      };
    }

    await customerUpdServiceApi.updateAddress({
      ...apiContext,
      pe_customer_id: validated.customerId,
      pe_zip_code: normalizeFieldValue(validated.zipCode),
      pe_address: normalizeFieldValue(validated.address),
      pe_address_number: normalizeFieldValue(validated.addressNumber),
      pe_complement: normalizeFieldValue(validated.complement),
      pe_neighborhood: normalizeFieldValue(validated.neighborhood),
      pe_city: normalizeFieldValue(validated.city),
      pe_state: normalizeFieldValue(validated.state),
      pe_city_code: normalizeFieldValue(validated.municipalityCode),
      pe_state_code: normalizeFieldValue(validated.stateCode),
    });

    revalidateTag(CACHE_TAGS.customer(String(validated.customerId)), "seconds");
    revalidateTag(CACHE_TAGS.customers, "seconds");
    revalidatePath("/dashboard/profile");

    return {
      success: true,
      message: "Endereço atualizado com sucesso.",
    };
  } catch (error) {
    logger.error("Erro ao atualizar endereço do perfil", error);

    if (error instanceof CustomerUpdError) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: false,
      message: "Erro inesperado ao atualizar endereço.",
    };
  }
}
