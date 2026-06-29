import { connection } from "next/server";

import { SiteHeaderWithBreadcrumb } from "@/components/dashboard/header/site-header-with-breadcrumb";
import { createLogger } from "@/core/logger";
import { getAuthContext } from "@/server/auth-context";
import {
  physicalProductServiceApi,
  transformPhysicalProductWarranties,
  type UIPhysicalProductWarranty,
} from "@/services/api-main/physical_product";

import { WarrantyContent } from "./_components";
import { DEFAULT_WARRANTY_LIMIT } from "./warranty.constants";

interface WarrantyPageProps {
  searchParams: Promise<{
    search?: string;
    limit?: string;
  }>;
}

const logger = createLogger("warranty-page");

function deduplicateWarranties(
  items: UIPhysicalProductWarranty[],
): UIPhysicalProductWarranty[] {
  const seen = new Set<string>();

  return items.filter((item) => {
    const key = `${item.warrantyId}-${item.movementId}`;

    if (seen.has(key)) return false;

    seen.add(key);
    return true;
  });
}

export default async function WarrantyPage(props: WarrantyPageProps) {
  await connection();

  const searchParams = await props.searchParams;
  const { apiContext } = await getAuthContext();

  const search = searchParams.search?.trim() || undefined;
  const limit = Number(searchParams.limit) || DEFAULT_WARRANTY_LIMIT;

  let items: UIPhysicalProductWarranty[] = [];

  try {
    const response = await physicalProductServiceApi.searchWarranties({
      pe_customer_id: apiContext.pe_person_id,
      PE_search: search ?? "",
      pe_limit: limit,
      pe_user_id: apiContext.pe_user_id,
      pe_user_name: apiContext.pe_user_name,
      pe_user_role: apiContext.pe_user_role,
      pe_person_id: apiContext.pe_person_id,
    });

    const entities = physicalProductServiceApi.extractWarrantySearch(response);
    items = deduplicateWarranties(transformPhysicalProductWarranties(entities));
  } catch (error) {
    logger.error("Erro ao carregar garantias do cliente:", error);
  }

  return (
    <>
      <SiteHeaderWithBreadcrumb
        title="Produtos em Garantia"
        breadcrumbItems={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Pedidos", href: "#" },
          { label: "Garantias", isActive: true },
        ]}
      />

      <div className="flex flex-1 flex-col">
        <div className="@container/main mx-auto w-full max-w-[1400px] flex-1 flex-col gap-6 px-4 py-6 lg:px-6">
          <WarrantyContent items={items} search={search ?? ""} />
        </div>
      </div>
    </>
  );
}
