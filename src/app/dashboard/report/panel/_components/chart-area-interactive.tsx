"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useIsMobile } from "@/hooks/use-mobile";
import type { UIOrderFindLatest } from "@/services/api-main/order-b2b";
import { formatCurrency } from "@/utils/common-utils";

type OrderChartDatum = {
  date: string;
  orderId: number;
  totalValue: number;
  itemCount: number;
};

function toChartData(orders: UIOrderFindLatest[]): OrderChartDatum[] {
  return orders
    .map((order) => ({
      date: order.orderDate,
      orderId: order.orderId,
      totalValue: Number(order.totalValue) || 0,
      itemCount: order.itemCount,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

const chartConfig = {
  totalValue: {
    label: "Valor do pedido",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

type ChartAreaInteractiveProps = {
  orders: UIOrderFindLatest[];
};

export function ChartAreaInteractive({ orders }: ChartAreaInteractiveProps) {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("90d");

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const chartData = React.useMemo(() => toChartData(orders), [orders]);

  const referenceDate = React.useMemo(() => {
    if (chartData.length === 0) return new Date();
    const maxDate = chartData[chartData.length - 1].date;
    return new Date(maxDate);
  }, [chartData]);

  const filteredData = React.useMemo(() => {
    return chartData.filter((item) => {
      const date = new Date(item.date);
      let daysToSubtract = 90;
      if (timeRange === "30d") {
        daysToSubtract = 30;
      } else if (timeRange === "7d") {
        daysToSubtract = 7;
      }
      const startDate = new Date(referenceDate);
      startDate.setDate(startDate.getDate() - daysToSubtract);
      return date >= startDate;
    });
  }, [chartData, timeRange, referenceDate]);

  const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
  });

  if (filteredData.length === 0) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Valor dos pedidos</CardTitle>
          <CardDescription>
            <span className="hidden @[540px]/card:block">
              Total por pedido nos últimos 3 meses
            </span>
            <span className="@[540px]/card:hidden">Últimos 3 meses</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex h-[250px] items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Nenhum pedido encontrado no período.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Valor dos pedidos</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total por pedido nos últimos 3 meses
          </span>
          <span className="@[540px]/card:hidden">Últimos 3 meses</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Últimos 3 meses</ToggleGroupItem>
            <ToggleGroupItem value="30d">Últimos 30 dias</ToggleGroupItem>
            <ToggleGroupItem value="7d">Últimos 7 dias</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Selecionar período"
            >
              <SelectValue placeholder="Últimos 3 meses" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Últimos 3 meses
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Últimos 30 dias
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Últimos 7 dias
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart data={filteredData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                try {
                  return dateFormatter.format(new Date(value));
                } catch {
                  return value;
                }
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              width={80}
              tickFormatter={(value) => formatCurrency(value)}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    try {
                      return new Intl.DateTimeFormat("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }).format(new Date(value));
                    } catch {
                      return value;
                    }
                  }}
                  formatter={(_value, _name, item) => {
                    const order = item.payload as OrderChartDatum;
                    return (
                      <div className="flex flex-col gap-0.5 text-xs">
                        <span>
                          Pedido #{order.orderId} — {order.itemCount}{" "}
                          {order.itemCount === 1 ? "item" : "itens"}
                        </span>
                        <span className="font-medium">
                          {formatCurrency(order.totalValue)}
                        </span>
                      </div>
                    );
                  }}
                  indicator="dot"
                />
              }
            />
            <Bar
              dataKey="totalValue"
              fill="var(--color-totalValue)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
