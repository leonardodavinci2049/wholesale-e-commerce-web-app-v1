"use server";

import { getAuthContext } from "@/server/auth-context";
import { customerGeneralServiceApi } from "@/services/api-main/customer-general";
import { transformCustomerList } from "@/services/api-main/customer-general/transformers/transformers";

export interface CustomerSearchResult {
  customerId: number;
  name: string;
  cpf: string;
  cnpj: string;
  customerType: string;
  personType: string;
}

export async function searchCustomersAction(
  search: string,
): Promise<CustomerSearchResult[]> {
  if (!search || search.trim().length < 3) {
    return [];
  }

  const { apiContext } = await getAuthContext();

  const response = await customerGeneralServiceApi.findAllCustomers({
    pe_search: search.trim(),
    pe_qt_registros: 20,
    ...apiContext,
  });
  const customers = transformCustomerList(
    customerGeneralServiceApi.extractCustomers(response),
  );

  return customers.map((c) => ({
    customerId: c.customerId,
    name: c.name,
    cpf: c.cpf,
    cnpj: c.cnpj,
    customerType: c.customerType,
    personType: c.personType,
  }));
}
