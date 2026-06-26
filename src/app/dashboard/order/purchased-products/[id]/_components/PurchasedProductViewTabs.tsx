"use client";

import { Eye } from "lucide-react";

import { Badge } from "@/components/ui/badge";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { UIPhysicalProductWarranty } from "@/services/api-main/physical_product";

interface PurchasedProductViewTabsProps {
  warranties: UIPhysicalProductWarranty[];
}

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

function toDateLabel(value: string | null | undefined): string {
  if (!value) return "Data indisponível";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "Data indisponível";

  return dateFormatter.format(parsed);
}

function WarrantyField({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-right text-xs font-medium text-foreground break-words">
        {value}
      </span>
    </div>
  );
}

function WarrantyStatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className="max-w-full">
      <span className="truncate">{status || "Status indisponível"}</span>
    </Badge>
  );
}

function WarrantiesList({
  warranties,
}: {
  warranties: UIPhysicalProductWarranty[];
}) {
  if (warranties.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border/80 bg-muted/20 p-6 text-center">
        <p className="text-sm font-medium text-foreground">
          Produto sem garantia
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-3 md:hidden">
        {warranties.map((warranty) => (
          <Card
            key={warranty.warrantyId}
            size="sm"
            className="rounded-xl border border-border/80 bg-neutral-50 py-0 shadow-sm dark:bg-neutral-900/50"
          >
            <CardContent className="space-y-3 p-3">
              <div className="flex min-w-0 items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className="font-mono text-[12px] text-muted-foreground">
                    Garantia #{warranty.warrantyId}
                  </span>
                  <p className="mt-1 text-sm leading-5 font-semibold text-foreground break-words">
                    {warranty.productName || "-"}
                  </p>
                </div>
                <WarrantyStatusBadge status={warranty.warrantyStatus} />
              </div>

              <div className="space-y-2 rounded-lg bg-background/80 p-3">
                <WarrantyField label="Pedido" value={`#${warranty.orderId}`} />
                <WarrantyField
                  label="Data do pedido"
                  value={toDateLabel(warranty.orderDate)}
                />
                <WarrantyField
                  label="Limite da garantia"
                  value={toDateLabel(warranty.warrantyLimit)}
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs font-medium"
                  title="Ver detalhes da garantia"
                >
                  Detalhes
                  <Eye className="ml-1 size-3" />
                </Button>
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
                <TableHead className="min-w-80 font-semibold">
                  Produto
                </TableHead>
                <TableHead className="font-semibold">Pedido</TableHead>
                <TableHead className="font-semibold">Data do Pedido</TableHead>
                <TableHead className="font-semibold">
                  Limite da Garantia
                </TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="w-28 text-right font-semibold">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {warranties.map((warranty) => (
                <TableRow key={warranty.warrantyId} className="group">
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    #{warranty.warrantyId}
                  </TableCell>
                  <TableCell>
                    <span className="block max-w-[48ch] text-sm break-words whitespace-normal">
                      {warranty.productName || "-"}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm tabular-nums text-muted-foreground">
                    #{warranty.orderId}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {toDateLabel(warranty.orderDate)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {toDateLabel(warranty.warrantyLimit)}
                  </TableCell>
                  <TableCell>
                    <WarrantyStatusBadge status={warranty.warrantyStatus} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-xs font-medium opacity-70 transition-opacity group-hover:opacity-100"
                      title="Ver detalhes da garantia"
                    >
                      Detalhes
                      <Eye className="ml-1 size-3" />
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

export function PurchasedProductViewTabs({
  warranties,
}: PurchasedProductViewTabsProps) {
  return (
    <Tabs defaultValue="warranties" className="w-full">
      <TabsList className="w-full justify-start overflow-x-auto whitespace-nowrap">
        <TabsTrigger value="warranties">Garantias</TabsTrigger>
        <TabsTrigger value="related-products">
          Produtos Relacionados
        </TabsTrigger>
        <TabsTrigger value="seller-data">Dados do vendedor</TabsTrigger>
      </TabsList>

      <TabsContent value="warranties" className="mt-6">
        <WarrantiesList warranties={warranties} />
      </TabsContent>

      <TabsContent value="related-products" className="mt-6" />

      <TabsContent value="seller-data" className="mt-6" />
    </Tabs>
  );
}
