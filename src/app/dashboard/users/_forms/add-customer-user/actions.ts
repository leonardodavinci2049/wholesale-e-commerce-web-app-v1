"use server";

import type { RowDataPacket } from "mysql2";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import dbService from "@/database/dbConnection";
import { AUTH_TABLES } from "@/database/shared/auth/auth.types";
import { auth } from "@/lib/auth/auth";
import { getAuthContext } from "@/server/auth-context";
import { customerGeneralServiceApi } from "@/services/api-main/customer-general";
import {
  transformCustomerDetail,
  transformCustomerList,
  type UICustomerListItem,
} from "@/services/api-main/customer-general/transformers/transformers";
import { getCustomerUserValidationMessage } from "./customer-user-rules";
import { addCustomerUserSchema } from "./schema";

export type AddCustomerUserState = {
  success: boolean;
  message: string;
};

export type SearchCustomersState = {
  success: boolean;
  message?: string;
  customers: UICustomerListItem[];
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
      `UPDATE ${AUTH_TABLES.USER} SET emailVerified = 1, personId = ?, sellerId = ? WHERE id = ?`,
      [customerId, sellerId, result.user.id],
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
