"use server";

import type { RowDataPacket } from "mysql2";
import { revalidatePath, revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { createLogger } from "@/core/logger";
import dbService from "@/database/dbConnection";
import { AUTH_TABLES } from "@/database/shared/auth/auth.types";
import { auth } from "@/lib/auth/auth";
import { CACHE_TAGS } from "@/lib/cache-config";
import { getAuthContext } from "@/server/auth-context";
import { customerGeneralServiceApi } from "@/services/api-main/customer-general";
import {
  transformCustomerDetail,
  transformCustomerList,
  type UICustomerListItem,
} from "@/services/api-main/customer-general/transformers/transformers";
import {
  CustomerInlineError,
  customerInlineServiceApi,
} from "@/services/api-main/customer-inline";
import { getCustomerUserValidationMessage } from "./customer-user-rules";
import { addCustomerUserSchema } from "./schema";

const logger = createLogger("add-customer-user-actions");

export type AddCustomerUserState = {
  success: boolean;
  message: string;
};

export type SearchCustomersState = {
  success: boolean;
  message?: string;
  customers: UICustomerListItem[];
};

export type ConvertCustomerToWholesaleState = {
  success: boolean;
  message: string;
};

interface ExistingUserRow extends RowDataPacket {
  id: string;
  email: string;
  personId: number | null;
}

export async function searchCustomersAction(
  search: string,
): Promise<SearchCustomersState> {
  try {
    const { apiContext } = await getAuthContext();

    const response = await customerGeneralServiceApi.findAllCustomers({
      pe_search: search.trim() || undefined,
      pe_qt_registros: 50,
      pe_user_id: apiContext.pe_user_id,
      pe_user_name: apiContext.pe_user_name,
      pe_user_role: apiContext.pe_user_role,
      pe_person_id: apiContext.pe_person_id,
    });
    const customers = transformCustomerList(
      customerGeneralServiceApi.extractCustomers(response),
    );

    return { success: true, customers };
  } catch (error) {
    const e = error as Error;
    return {
      success: false,
      message: e.message || "Falha ao buscar clientes",
      customers: [],
    };
  }
}

export async function convertCustomerToWholesaleAction(
  customerId: number,
): Promise<ConvertCustomerToWholesaleState> {
  const parsed = addCustomerUserSchema.safeParse({ customerId });

  if (!parsed.success) {
    return { success: false, message: "ID de cliente inválido" };
  }

  try {
    const { apiContext, session } = await getAuthContext();

    if (session.user.role !== "admin") {
      return {
        success: false,
        message: "Você não tem permissão para converter clientes.",
      };
    }

    await customerInlineServiceApi.updateTypeCustomer({
      ...apiContext,
      pe_customer_id: parsed.data.customerId,
      pe_customer_type_id: 1,
    });

    revalidateTag(
      CACHE_TAGS.customer(String(parsed.data.customerId)),
      "seconds",
    );
    revalidateTag(CACHE_TAGS.customers, "seconds");

    return {
      success: true,
      message: "Cliente convertido para ATACADO com sucesso",
    };
  } catch (error) {
    logger.error("Erro ao converter cliente para atacado", error);

    if (error instanceof CustomerInlineError) {
      return { success: false, message: error.message };
    }

    return {
      success: false,
      message: "Falha ao converter cliente para ATACADO",
    };
  }
}

export async function addCustomerAsUserAction(
  _prevState: AddCustomerUserState,
  formData: FormData,
): Promise<AddCustomerUserState> {
  const parsed = addCustomerUserSchema.safeParse({
    customerId: formData.get("customerId"),
  });

  if (!parsed.success) {
    return { success: false, message: "ID de cliente inválido" };
  }

  const { customerId } = parsed.data;

  try {
    const { apiContext } = await getAuthContext();

    const response = await customerGeneralServiceApi.findCustomerById({
      pe_customer_id: customerId,
      pe_user_id: apiContext.pe_user_id,
      pe_user_name: apiContext.pe_user_name,
      pe_user_role: apiContext.pe_user_role,
      pe_person_id: customerId,
    });
    const customerEntity =
      customerGeneralServiceApi.extractCustomerById(response);

    if (!customerEntity) {
      return { success: false, message: "Cliente não encontrado" };
    }

    const customer = transformCustomerDetail(customerEntity);
    const name = (customer.name || "").trim();
    const email = (customer.email || "").trim().toLowerCase();
    const whatsapp = customer.whatsapp.trim() || customer.phone.trim() || null;

    if (!name) {
      return { success: false, message: "Cliente sem nome cadastrado" };
    }

    const validationMessage = getCustomerUserValidationMessage({
      customerTypeId: customer.customerTypeId,
      email,
    });

    if (validationMessage) {
      return { success: false, message: validationMessage };
    }

    const existing = await dbService.selectExecute<ExistingUserRow>(
      `SELECT id, email, personId FROM ${AUTH_TABLES.USER} WHERE personId = ? OR email = ? LIMIT 1`,
      [customerId, email],
    );

    if (existing.length > 0) {
      return {
        success: false,
        message: "Este cliente já está cadastrado como usuário",
      };
    }

    const sellerId =
      customer.sellerId && customer.sellerId > 0 ? customer.sellerId : 1;

    const password = `Tmp${Date.now()}!${Math.random().toString(36).slice(2, 8)}`;

    const result = await auth.api.createUser({
      headers: await headers(),
      body: {
        name,
        email,
        password,
        role: "user",
      },
    });

    await dbService.modifyExecute(
      `UPDATE ${AUTH_TABLES.USER} SET emailVerified = 1, personId = ?, sellerId = ?, whatsapp = ? WHERE id = ?`,
      [customerId, sellerId, whatsapp, result.user.id],
    );

    revalidatePath("/dashboard/users");

    return {
      success: true,
      message: `Usuário ${name} adicionado com sucesso`,
    };
  } catch (error) {
    const e = error as Error;
    return {
      success: false,
      message: e.message || "Falha ao adicionar usuário a partir do cliente",
    };
  }
}
