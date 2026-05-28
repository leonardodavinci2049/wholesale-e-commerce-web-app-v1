import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAuthContext } from "@/server/auth-context";
import {
  getOrderFindLatest,
  type UIOrderFindLatest,
} from "@/services/api-main/order-b2b";
import { formatCurrency } from "@/utils/common-utils";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

function formatDate(dateString: string): string {
  try {
    return dateFormatter.format(new Date(dateString));
  } catch {
    return dateString;
  }
}

export async function DataTable() {
  const { session, apiContext } = await getAuthContext();
  const customerId = session.user.personId ?? 0;

  let orders: UIOrderFindLatest[];
  try {
    orders = await getOrderFindLatest(customerId, { ...apiContext });
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
    <div className="overflow-hidden rounded-lg border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
            <TableRow>
              <TableHead className="whitespace-nowrap">Data Pedido</TableHead>
              <TableHead>ID Pedido</TableHead>
              <TableHead>Status Pedido</TableHead>
              <TableHead>Status Financeiro</TableHead>
              <TableHead>Status Entrega</TableHead>
              <TableHead className="text-right">Qt Itens</TableHead>
              <TableHead className="text-right whitespace-nowrap">
                Vl Frete
              </TableHead>
              <TableHead className="text-right whitespace-nowrap">
                Vl Desconto
              </TableHead>
              <TableHead className="text-right whitespace-nowrap">
                Vl Total
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  Nenhum pedido encontrado.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.orderId}>
                  <TableCell className="whitespace-nowrap">
                    {formatDate(order.orderDate)}
                  </TableCell>
                  <TableCell>{order.orderId}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {order.orderStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {order.financialStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {order.deliveryStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {order.itemCount}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-right">
                    {formatCurrency(Number(order.freightValue))}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-right">
                    {formatCurrency(Number(order.discountValue))}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-right font-medium">
                    {formatCurrency(Number(order.totalValue))}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
