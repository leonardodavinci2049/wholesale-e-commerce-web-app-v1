"use client";

import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { UIOrderItemCustomer } from "@/services/api-main/physical_product";

interface PurchasedProductsTableProps {
  items: UIOrderItemCustomer[];
}

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

function toCurrency(value: string): string {
  const parsed = Number(value);
  return currencyFormatter.format(Number.isFinite(parsed) ? parsed : 0);
}

function toDate(value: string | null): string {
  if (!value) return "Data indisponível";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "Data indisponível";

  return dateFormatter.format(parsed);
}

function getItemKey(item: UIOrderItemCustomer): string {
  return `${item.orderId}-${item.movementId}`;
}

export function PurchasedProductsTable({ items }: PurchasedProductsTableProps) {
  if (items.length === 0) return null;

  return (
    <>
      {/* Mobile: Card layout */}
      <div className="grid gap-3 overflow-hidden p-3 sm:p-4 md:hidden">
        {items.map((item) => (
          <Card
            key={getItemKey(item)}
            className="gap-0 overflow-hidden rounded-xl border border-border/80 bg-neutral-50 py-0 shadow-sm dark:bg-neutral-900/50"
          >
            <CardContent className="space-y-2 p-3">
              <div className="flex min-w-0 items-center justify-between gap-2">
                <span className="shrink-0 rounded-full border border-border/40 bg-background px-2 py-0.5 font-mono text-[12px] text-muted-foreground shadow-sm">
                  #{item.productId}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {toDate(item.orderDate)}
                </span>
              </div>

              <p className="max-w-[40ch] text-sm leading-5 font-semibold text-foreground break-words">
                {item.description || "-"}
              </p>

              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                <span className="shrink-0">
                  Qtd:{" "}
                  <span className="font-medium text-foreground">
                    {item.quantity}
                  </span>
                </span>
                <span className="shrink-0 text-border">·</span>
                <span className="shrink-0">
                  Unit.:{" "}
                  <span className="font-medium text-foreground">
                    {toCurrency(item.unitValue)}
                  </span>
                </span>
                <span className="shrink-0 text-border">·</span>
                <span className="shrink-0">
                  Total:{" "}
                  <span className="font-semibold text-foreground">
                    {toCurrency(item.totalValue)}
                  </span>
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="min-w-0 truncate text-[11px] text-muted-foreground">
                  {item.sellerName ? `Vendedor: ${item.sellerName}` : ""}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 shrink-0 text-xs font-medium"
                  title="Ver detalhes da compra"
                >
                  Detalhe
                  <ArrowRight className="ml-1 size-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop: Table layout */}
      <div className="hidden overflow-hidden rounded-xl border border-border/70 bg-card/80 shadow-sm md:block">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="font-semibold">SKU</TableHead>
                <TableHead className="font-semibold">Produto</TableHead>
                <TableHead className="font-semibold text-right">Qtd</TableHead>
                <TableHead className="font-semibold text-right">
                  Valor Unitário
                </TableHead>
                <TableHead className="font-semibold text-right">
                  Valor Total
                </TableHead>
                <TableHead className="font-semibold">Vendedor</TableHead>
                <TableHead className="font-semibold">Data do Pedido</TableHead>
                <TableHead className="w-28 text-right font-semibold">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={getItemKey(item)} className="group">
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    #{item.productId}
                  </TableCell>
                  <TableCell>
                    <span className="block max-w-[40ch] text-sm break-words whitespace-normal">
                      {item.description || "-"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-sm tabular-nums text-muted-foreground">
                    {item.quantity}
                  </TableCell>
                  <TableCell className="text-right text-sm tabular-nums text-muted-foreground">
                    {toCurrency(item.unitValue)}
                  </TableCell>
                  <TableCell className="text-right text-sm font-semibold tabular-nums">
                    {toCurrency(item.totalValue)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {item.sellerName || "-"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {toDate(item.orderDate)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-xs font-medium opacity-70 transition-opacity group-hover:opacity-100"
                      title="Ver detalhes da compra"
                    >
                      Detalhe
                      <ArrowRight className="ml-1 size-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
