"use client";

import { Loader2, Minus, Plus, Send } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { addItemAction } from "@/app/dashboard/order/new-budget/actions/add-item-action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ROUTE = "/dashboard/order/new-budget-v2";
const ADD_ITEM_SUCCESS_TOAST_DURATION_MS = 1000;

interface ProductAddButtonV2Props {
  productId: number;
  productName: string;
  storeStock: number;
  orderId?: number;
}

export function ProductAddButtonV2({
  productId,
  productName,
  storeStock,
  orderId,
}: ProductAddButtonV2Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [quantity, setQuantity] = useState("1");
  const [state, formAction, isPending] = useActionState(addItemAction, null);
  const prevStateRef = useRef(state);

  const parsedQuantity = Number(quantity);
  const safeQuantity = Number.isFinite(parsedQuantity)
    ? Math.min(Math.max(parsedQuantity, 1), Math.max(storeStock, 1))
    : 1;

  function handleDecrement() {
    setQuantity(String(Math.max(safeQuantity - 1, 1)));
  }

  function handleIncrement() {
    if (safeQuantity >= storeStock) {
      toast.warning("Estoque insuficiente", {
        description: `${productName} possui no máximo ${storeStock} unidade(s) disponíveis.`,
      });
      return;
    }
    setQuantity(String(safeQuantity + 1));
  }

  useEffect(() => {
    if (state === prevStateRef.current) return;
    prevStateRef.current = state;

    if (state?.success) {
      toast.success(state.message, {
        duration: ADD_ITEM_SUCCESS_TOAST_DURATION_MS,
      });
      setQuantity("1");

      const nextOrderId = Number(state.data?.orderId);
      if (nextOrderId && nextOrderId !== orderId) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("orderId", String(nextOrderId));
        router.replace(`${ROUTE}?${params.toString()}`, { scroll: false });
      } else {
        router.refresh();
      }
    } else if (state?.success === false) {
      toast.error(state.message);
    }
  }, [state, searchParams, router, orderId]);

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5 rounded-md border border-border/60 bg-background/70 px-0.5">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="h-7 w-6 rounded-sm"
          disabled={isPending || safeQuantity <= 1}
          onClick={handleDecrement}
          aria-label={`Diminuir quantidade de ${productName}`}
        >
          <Minus className="h-3 w-3" strokeWidth={2.5} />
        </Button>
        <Input
          type="number"
          inputMode="numeric"
          min="1"
          max={Math.max(storeStock, 1)}
          value={quantity}
          aria-label={`Quantidade de ${productName}`}
          onBlur={() => setQuantity(String(safeQuantity))}
          onChange={(event) => setQuantity(event.target.value)}
          className="h-7 w-8 border-0 bg-transparent px-0 text-center text-xs shadow-none focus-visible:ring-0"
          disabled={isPending}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="h-7 w-6 rounded-sm"
          disabled={isPending || safeQuantity >= storeStock}
          onClick={handleIncrement}
          aria-label={`Aumentar quantidade de ${productName}`}
        >
          <Plus className="h-3 w-3" strokeWidth={2.5} />
        </Button>
      </div>

      <form action={formAction} className="flex-1">
        <input type="hidden" name="orderId" value={orderId ?? ""} />
        <input type="hidden" name="productId" value={productId} />
        <input type="hidden" name="quantity" value={safeQuantity} />
        <Button
          type="submit"
          size="sm"
          className="h-7 w-full gap-1 rounded-md bg-blue-600 px-2 text-[11px] font-semibold uppercase tracking-wider text-white hover:bg-blue-700"
          disabled={isPending || storeStock < 1}
          aria-label={`Adicionar ${safeQuantity} unidade(s) de ${productName} ao carrinho`}
        >
          {isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <>
              <Plus className="h-3 w-3" strokeWidth={3} />
              Adicionar
              <Send className="ml-0.5 h-3 w-3" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
