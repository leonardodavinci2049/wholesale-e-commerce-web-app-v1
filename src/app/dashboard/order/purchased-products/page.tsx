import { connection } from "next/server";

import { SiteHeaderWithBreadcrumb } from "@/components/dashboard/header/site-header-with-breadcrumb";
import { createLogger } from "@/core/logger";
import { getAuthContext } from "@/server/auth-context";
import {
  physicalProductServiceApi,
  transformOrderItemsCustomer,
  type UIOrderItemCustomer,
} from "@/services/api-main/physical_product";

import { PurchasedProductsContent } from "./_components";
import { DEFAULT_PURCHASED_PRODUCTS_LIMIT } from "./purchased-products.constants";

interface PurchasedProductsPageProps {
  searchParams: Promise<{
    search?: string;
    limit?: string;
  }>;
}

const logger = createLogger("purchased-products-page");

export default async function PurchasedProductsPage(
  props: PurchasedProductsPageProps,
) {
  await connection();

  const searchParams = await props.searchParams;
  const { apiContext } = await getAuthContext();

  const search = searchParams.search?.trim() || undefined;
  const limit = Number(searchParams.limit) || DEFAULT_PURCHASED_PRODUCTS_LIMIT;

  let items: UIOrderItemCustomer[] = [];

  try {
    const response = await physicalProductServiceApi.findOrderItemsByCustomer({
      pe_customer_id: apiContext.pe_person_id,
      pe_search: search ?? "",
      pe_limit: limit,
      pe_user_id: apiContext.pe_user_id,
      pe_user_name: apiContext.pe_user_name,
      pe_user_role: apiContext.pe_user_role,
      pe_person_id: apiContext.pe_person_id,
    });

    const entities =
      physicalProductServiceApi.extractOrderItemsByCustomer(response);
    items = transformOrderItemsCustomer(entities);
  } catch (error) {
    logger.error("Erro ao carregar produtos comprados pelo cliente:", error);
  }

  return (
    <>
      <SiteHeaderWithBreadcrumb
        title="Produtos Comprados"
        breadcrumbItems={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Pedidos", href: "#" },
          { label: "Produtos Comprados", isActive: true },
        ]}
      />

      <div className="flex flex-1 flex-col">
        <div className="@container/main mx-auto w-full max-w-[1400px] flex-1 flex-col gap-6 px-4 py-6 lg:px-6">
          <PurchasedProductsContent items={items} search={search ?? ""} />
        </div>
      </div>
    </>
  );
}
