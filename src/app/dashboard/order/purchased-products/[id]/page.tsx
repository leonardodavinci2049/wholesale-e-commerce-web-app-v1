import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { z } from "zod";

import { SiteHeaderWithBreadcrumb } from "@/components/dashboard/header/site-header-with-breadcrumb";
import { createLogger } from "@/core/logger";
import { getAuthContext } from "@/server/auth-context";
import {
  physicalProductServiceApi,
  transformOrderItemCustomer,
} from "@/services/api-main/physical_product";

import { PurchasedProductNotFound } from "./_components/PurchasedProductNotFound";
import {
  PurchasedProductViewLayout,
  PurchasedProductViewLayoutSkeleton,
} from "./_components/PurchasedProductViewLayout";

const logger = createLogger("PurchasedProductDetailsPage");

// Schema for validating the dynamic route parameter (movement ID)
const MovementPageParamsSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "ID deve ser um número válido")
    .transform(Number),
});

interface PurchasedProductDetailsPageProps {
  params: Promise<{ id: string }>;
}

// Server Component - Fetch data directly
async function PurchasedProductDetailsContent({
  movementId,
}: {
  movementId: number;
}) {
  await connection();
  const { apiContext } = await getAuthContext();

  let entity = null;

  try {
    const response = await physicalProductServiceApi.findOrderItemByCustomer({
      pe_customer_id: apiContext.pe_person_id,
      pe_movement_id: movementId,
      pe_user_id: apiContext.pe_user_id,
      pe_user_name: apiContext.pe_user_name,
      pe_user_role: apiContext.pe_user_role,
      pe_person_id: apiContext.pe_person_id,
    });

    entity = physicalProductServiceApi.extractOrderItemByCustomer(response);
  } catch (error) {
    logger.error(
      `Erro ao buscar detalhes da movimentação ${movementId}:`,
      error,
    );
  }

  if (!entity) {
    return <PurchasedProductNotFound movementId={movementId} />;
  }

  const item = transformOrderItemCustomer(entity);

  return <PurchasedProductViewLayout item={item} />;
}

export default async function PurchasedProductDetailsPage({
  params,
}: PurchasedProductDetailsPageProps) {
  // Await params as it's a Promise in Next.js 15
  const routeParams = await params;

  // Validate and extract movement ID from route params
  let movementId: number;

  try {
    const validatedParams = MovementPageParamsSchema.parse({
      id: routeParams.id,
    });
    movementId = validatedParams.id;
  } catch (error) {
    logger.error("Parâmetro de ID de movimento inválido:", error);
    notFound();
  }

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    {
      label: "Produtos Comprados",
      href: "/dashboard/order/purchased-products",
    },
    { label: "Detalhes", isActive: true },
  ];

  return (
    <>
      <SiteHeaderWithBreadcrumb
        title="Detalhes da Compra"
        breadcrumbItems={breadcrumbItems}
      />

      <Suspense
        fallback={
          <div className="mx-auto flex w-full max-w-350 flex-1 flex-col">
            <div className="@container/main flex flex-col gap-6">
              <div className="flex flex-col gap-6 py-6">
                <div className="px-4 lg:px-6">
                  <PurchasedProductViewLayoutSkeleton />
                </div>
              </div>
            </div>
          </div>
        }
      >
        <div className="mx-auto flex w-full max-w-350 flex-1 flex-col">
          <div className="@container/main flex flex-col gap-6">
            <div className="flex flex-col gap-6 py-6">
              <div className="px-4 lg:px-6">
                <PurchasedProductDetailsContent movementId={movementId} />
              </div>
            </div>
          </div>
        </div>
      </Suspense>
    </>
  );
}
