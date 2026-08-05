"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { trackPurchase } from "@/components/analytics";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  UIOrderDashboardItem,
  UIOrderSalesSummary,
} from "@/services/api-main/order-sales/transformers/transformers";
import { closeOrderAction } from "../actions/close-order-action";

interface FinalizeSaleButtonProps {
  orderId: number;
  orderStatusId: number;
  items: UIOrderDashboardItem[];
  summary: UIOrderSalesSummary | null;
  disabled?: boolean;
}

const CLOSEABLE_ORDER_STATUS_ID = 22;

export function FinalizeSaleButton({
  orderId,
  orderStatusId,
  items,
  summary,
  disabled = false,
}: FinalizeSaleButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const canFinalize =
    !disabled && orderId > 0 && orderStatusId === CLOSEABLE_ORDER_STATUS_ID;

  const handleConfirm = () => {
    startTransition(async () => {
      try {
        const result = await closeOrderAction(orderId);

        if (result.success) {
          if (summary) {
            trackPurchase(
              String(orderId),
              items.map((item) => ({
                item_id: item.sku || String(item.productId),
                item_name: item.product,
                price:
                  item.quantity > 0
                    ? Number(item.totalValue) / item.quantity
                    : Number(item.unitValue),
                quantity: item.quantity,
                discount:
                  item.quantity > 0
                    ? Number(item.totalDiscountValue) / item.quantity
                    : 0,
              })),
              Number(summary.totalOrderValue),
              Number(summary.freightValue),
            );
          }
          toast.success(result.message);
          setOpen(false);
          router.refresh();
          return;
        }

        toast.error(result.message);
      } catch (_error) {
        toast.error("Erro inesperado ao finalizar pedido");
      }
    });
  };

  const buttonClassName = cn(
    "h-12 w-full rounded-2xl bg-primary text-sm font-semibold text-primary-foreground shadow-lg shadow-black/10 hover:bg-primary/90",
    !canFinalize && "opacity-60",
  );

  if (!canFinalize) {
    return (
      <div className="cursor-not-allowed">
        <Button type="button" size="lg" disabled className={buttonClassName}>
          Finalizar Pedido
        </Button>
      </div>
    );
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!isPending) {
          setOpen(nextOpen);
        }
      }}
    >
      <AlertDialogTrigger asChild>
        <Button type="button" size="lg" className={buttonClassName}>
          Finalizar Pedido
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar finalização do Pedido</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja finalizar este pedido? Esta ação não pode ser
            desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={(event) => {
              event.preventDefault();
              handleConfirm();
            }}
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Finalizando...
              </>
            ) : (
              "Confirmar"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
