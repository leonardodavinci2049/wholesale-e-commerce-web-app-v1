import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAuthContext } from "@/server/auth-context";
import {
  getOrderStatisticsCustomer,
  type UIOrderStatisticsCustomer,
} from "@/services/api-main/order-b2b";
import { formatCurrency } from "@/utils/common-utils";

export async function SectionCards() {
  const { session, apiContext } = await getAuthContext();
  const customerId = session.user.personId ?? 0;

  let stats: UIOrderStatisticsCustomer | null;
  try {
    stats = await getOrderStatisticsCustomer(customerId, {
      ...apiContext,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro ao buscar estatísticas.";
    return (
      <div className="px-4 lg:px-6">
        <p className="text-sm text-destructive">{message}</p>
      </div>
    );
  }

  const totalOrders = stats?.totalOrders ?? 0;
  const averageTicket = formatCurrency(Number(stats?.averageTicket ?? 0));
  const totalItems = stats?.totalItems ?? "0";
  const totalValue = formatCurrency(Number(stats?.totalValue ?? 0));

  const cards = [
    {
      description: "Qt. Pedidos",
      value: totalOrders.toLocaleString("pt-BR"),
      footer: "Quantidade de pedidos no período",
    },
    {
      description: "Ticket Médio",
      value: averageTicket,
      footer: "Valor médio por pedido no período",
    },
    {
      description: "Qt. Produtos",
      value: totalItems,
      footer: "Quantidade de produtos comprados",
    },
    {
      description: "Total Geral",
      value: totalValue,
      footer: "Valor total gasto em compras",
    },
  ];

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.description} className="@container/card">
          <CardHeader>
            <CardDescription>{card.description}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {card.value}
            </CardTitle>
          </CardHeader>
          <p className="px-6 pb-4 text-sm text-muted-foreground">
            {card.footer}
          </p>
        </Card>
      ))}
    </div>
  );
}
