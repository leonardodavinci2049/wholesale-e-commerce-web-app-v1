"use client";

import { Eye, Package } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/utils/common-utils";

interface ItemDetailDialogProps {
  item: {
    movementId: number;
    product: string;
    imagePath: string;
    unitValue: string;
    quantity: number;
    totalValue: string;
  };
}

export function ItemDetailDialog({ item }: ItemDetailDialogProps) {
  const [open, setOpen] = useState(false);

  const unitValue = Number(item.unitValue);

  const totalValue = Number(item.totalValue);

  return (
    <>
      <Button
        variant="ghost"
        size="icon-xs"
        className="shrink-0 rounded-full text-muted-foreground hover:bg-primary/10 hover:text-primary"
        onClick={() => setOpen(true)}
      >
        <Eye className="h-3.5 w-3.5" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[92vw] sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base">Detalhe do item</DialogTitle>
            <DialogDescription className="sr-only">
              Visualize a imagem, valores e quantidade do item selecionado.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center gap-4">
            {/* Product image */}
            {item.imagePath ? (
              <div className="relative h-36 w-36 overflow-hidden rounded-xl border border-border/60 bg-muted/50">
                <Image
                  src={item.imagePath}
                  alt={item.product}
                  fill
                  sizes="144px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex h-36 w-36 items-center justify-center rounded-xl bg-muted">
                <Package className="h-10 w-10 text-muted-foreground" />
              </div>
            )}

            {/* Product name */}
            <p className="text-center text-sm font-medium leading-snug">
              {item.product}
            </p>
          </div>

          <Separator />

          {/* Detail rows */}
          <div className="space-y-2.5 text-sm">
            <DetailRow
              label="Valor unitário"
              value={formatCurrency(unitValue)}
            />

            <DetailRow label="Quantidade" value={String(item.quantity)} />
            <Separator />
            <div className="flex items-center justify-between font-semibold">
              <span>Total</span>
              <span>{formatCurrency(totalValue)}</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function DetailRow({
  label,
  value,
  muted,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={muted ? "text-muted-foreground" : ""}>{value}</span>
    </div>
  );
}
