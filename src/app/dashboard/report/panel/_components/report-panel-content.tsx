import { getAuthContext } from "@/server/auth-context";
import { orderB2bServiceApi } from "@/services/api-main/order-b2b";
import {
  transformFindLatestEntity,
  type UIOrderFindLatest,
} from "@/services/api-main/order-b2b/transformers/transformers";
import { ChartAreaInteractive } from "./chart-area-interactive";
import { DataTable } from "./data-table";

export async function ReportPanelContent() {
  const { session, apiContext } = await getAuthContext();
  const customerId = session.user.personId ?? 0;

  let orders: UIOrderFindLatest[];
  try {
    const response = await orderB2bServiceApi.findLatest({
      pe_customer_id: customerId,
      ...apiContext,
    });
    orders = orderB2bServiceApi
      .extractFindLatest(response)
      .map(transformFindLatestEntity);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Erro ao buscar pedidos recentes.";
    return (
      <div className="overflow-hidden rounded-lg border">
        <p className="p-4 text-sm text-destructive">{message}</p>
      </div>
    );
  }

  return (
    <>
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive orders={orders} />
      </div>
      <DataTable orders={orders} />
    </>
  );
}
