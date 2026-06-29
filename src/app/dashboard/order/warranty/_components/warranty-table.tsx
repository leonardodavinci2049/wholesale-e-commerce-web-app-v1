"use client";

import { ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

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
import { cn } from "@/lib/utils";
import type { UIPhysicalProductWarranty } from "@/services/api-main/physical_product";

interface WarrantyTableProps {
  items: UIPhysicalProductWarranty[];
}

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

function toDate(value: string | null): string {
  if (!value) return "Data indisponível";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "Data indisponível";

  return dateFormatter.format(parsed);
}

function getItemKey(item: UIPhysicalProductWarranty): string {
  return `${item.warrantyId}-${item.movementId}`;
}

function getProductId(item: UIPhysicalProductWarranty): string {
  return item.productId ? `#${item.productId}` : "-";
}

function getStatusClassName(status: string): string {
  const normalized = status
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  if (normalized.includes("venc") || normalized.includes("expir")) {
    return "border-destructive/25 bg-destructive/10 text-destructive";
  }

  return "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
}

function WarrantyStatus({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
        getStatusClassName(status),
      )}
    >
      <ShieldCheck className="size-3 shrink-0" />
      <span className="truncate">{status || "Indisponível"}</span>
    </span>
  );
}

function DetailButton({ warrantyId }: { warrantyId: number }) {
  return (
    <Button
      asChild
      type="button"
      variant="ghost"
      size="sm"
      className="h-8 shrink-0 text-xs font-medium"
      title="Ver detalhes da garantia"
    >
      <Link href={`/dashboard/lacre?lacreId=${warrantyId}`}>
        Detalhe
        <ArrowRight className="ml-1 size-3" />
      </Link>
    </Button>
  );
}

export function WarrantyTable({ items }: WarrantyTableProps) {
  if (items.length === 0) return null;

  return (
    <>
      <div className="grid gap-3 overflow-hidden p-3 sm:p-4 md:hidden">
        {items.map((item) => (
          <Card
            key={getItemKey(item)}
            className="gap-0 overflow-hidden rounded-xl border border-border/80 bg-neutral-50 py-0 shadow-sm dark:bg-neutral-900/50"
          >
            <CardContent className="space-y-3 p-3">
              <div className="flex min-w-0 items-center justify-between gap-2">
                <span className="shrink-0 rounded-full border border-border/40 bg-background px-2 py-0.5 font-mono text-[12px] text-muted-foreground shadow-sm">
                  Garantia #{item.warrantyId}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {toDate(item.warrantyLimit)}
                </span>
              </div>

              <div className="min-w-0 space-y-1">
                <p className="max-w-[42ch] text-sm leading-5 font-semibold text-foreground break-words">
                  {item.productName || "-"}
                </p>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                  <span className="shrink-0 font-mono">
                    SKU:{" "}
                    <span className="font-medium text-foreground">
                      {getProductId(item)}
                    </span>
                  </span>
                  <span className="shrink-0 text-border">·</span>
                  <span className="shrink-0">
                    Pedido:{" "}
                    <span className="font-medium text-foreground">
                      #{item.orderId}
                    </span>
                  </span>
                  <span className="shrink-0 text-border">·</span>
                  <span className="shrink-0">
                    Data:{" "}
                    <span className="font-medium text-foreground">
                      {toDate(item.orderDate)}
                    </span>
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <WarrantyStatus status={item.warrantyStatus} />
                <DetailButton warrantyId={item.warrantyId} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-xl border border-border/70 bg-card/80 shadow-sm md:block">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="font-semibold">Garantia</TableHead>
                <TableHead className="font-semibold">SKU</TableHead>
                <TableHead className="min-w-64 font-semibold">
                  Produto
                </TableHead>
                <TableHead className="font-semibold">Pedido</TableHead>
                <TableHead className="font-semibold">Data Pedido</TableHead>
                <TableHead className="font-semibold">
                  Limite da Garantia
                </TableHead>
                <TableHead className="font-semibold">
                  Status da Garantia
                </TableHead>
                <TableHead className="w-28 text-right font-semibold">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={getItemKey(item)} className="group">
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    #{item.warrantyId}
                  </TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {getProductId(item)}
                  </TableCell>
                  <TableCell>
                    <span className="block max-w-[42ch] text-sm break-words whitespace-normal">
                      {item.productName || "-"}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    #{item.orderId}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {toDate(item.orderDate)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {toDate(item.warrantyLimit)}
                  </TableCell>
                  <TableCell>
                    <WarrantyStatus status={item.warrantyStatus} />
                  </TableCell>
                  <TableCell className="text-right">
                    <DetailButton warrantyId={item.warrantyId} />
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
