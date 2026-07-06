"use client";

import { Loader2, Minus, Plus, ShoppingCart } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { addItemAction } from "../../_actions/add-item-action";

const ROUTE = "/dashboard";
const ADD_ITEM_SUCCESS_TOAST_DURATION_MS = 1000;

interface ProductAddButtonV2Props {
  productId: number;
  productName: string;
  storeStock: number;
  orderId?: number;
  hideQuantityOnMobile?: boolean;
}

export function ProductAddButtonV2({
  productId,
  productName,
  storeStock,
  orderId,
  hideQuantityOnMobile,
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
    <div className="flex items-center justify-between gap-2">
      <div
        className={cn(
          "flex shrink-0 items-center gap-0.5 rounded-full bg-zinc-100/80 p-0.5 dark:bg-zinc-800/60",
          hideQuantityOnMobile ? "hidden sm:flex" : "flex",
        )}
      >
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="h-7 w-7 rounded-full hover:bg-zinc-200/60 dark:hover:bg-zinc-700/60 transition-colors"
          disabled={isPending || safeQuantity <= 1}
          onClick={handleDecrement}
          aria-label={`Diminuir quantidade de ${productName}`}
        >
          <Minus
            className="h-3.5 w-3.5 text-zinc-600 dark:text-zinc-400"
            strokeWidth={2.5}
          />
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
          className="h-7 w-8 border-0 bg-transparent p-0 text-center text-xs font-semibold shadow-none focus-visible:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          disabled={isPending}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="h-7 w-7 rounded-full hover:bg-zinc-200/60 dark:hover:bg-zinc-700/60 transition-colors"
          disabled={isPending || safeQuantity >= storeStock}
          onClick={handleIncrement}
          aria-label={`Aumentar quantidade de ${productName}`}
        >
          <Plus
            className="h-3.5 w-3.5 text-zinc-600 dark:text-zinc-400"
            strokeWidth={2.5}
          />
        </Button>
      </div>

      <form action={formAction} className="shrink-0">
        <input type="hidden" name="orderId" value={orderId ?? ""} />
        <input type="hidden" name="productId" value={productId} />
        <input type="hidden" name="quantity" value={safeQuantity} />
        <Button
          type="submit"
          size="icon-sm"
          className="h-8 w-8 rounded-full bg-blue-600 text-white shadow-sm shadow-blue-500/10 transition-all hover:bg-blue-500 hover:shadow-md hover:shadow-blue-500/25 active:scale-90 dark:bg-blue-600 dark:hover:bg-blue-500"
          disabled={isPending || storeStock < 1}
          aria-label={`Adicionar ${safeQuantity} unidade(s) de ${productName} ao carrinho`}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin text-white" />
          ) : (
            <ShoppingCart className="h-4 w-4 text-white" />
          )}
        </Button>
      </form>
    </div>
  );
}
