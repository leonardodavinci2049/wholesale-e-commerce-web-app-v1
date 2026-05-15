import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { UIProductPdv } from "@/services/api-main/product-pdv/transformers/transformers";
import { formatCurrency } from "@/utils/common-utils";

import { ProductAddButtonV2 } from "./product-add-button-v2";

interface ProductListItemProps {
  product: UIProductPdv;
  orderId?: number;
}

export function ProductListItem({ product, orderId }: ProductListItemProps) {
  const inStock = product.storeStock > 0;
  const isOnSale = product.promotion;
  const isLaunch = product.launch;

  return (
    <li className="flex items-center gap-3 border-b border-border/50 px-2 py-2 last:border-b-0 sm:gap-4 sm:px-3">
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-center gap-1.5">
          {product.brand && (
            <span className="rounded bg-zinc-200/80 px-1 py-px text-[9px] font-bold uppercase tracking-wider text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              {product.brand}
            </span>
          )}
          {!inStock && (
            <span className="rounded bg-red-600 px-1 py-px text-[9px] font-bold uppercase tracking-wider text-white">
              Sem estoque
            </span>
          )}
          {inStock && isOnSale && (
            <span className="rounded bg-amber-400 px-1 py-px text-[9px] font-bold uppercase tracking-wider text-amber-950">
              Oferta
            </span>
          )}
          {inStock && !isOnSale && isLaunch && (
            <span className="rounded bg-emerald-500 px-1 py-px text-[9px] font-bold uppercase tracking-wider text-white">
              Novo
            </span>
          )}
        </div>

        <p
          className={cn(
            "line-clamp-2 text-[13px] font-semibold leading-snug text-foreground sm:text-sm",
            !inStock && "text-muted-foreground",
          )}
        >
          {product.name}
        </p>

        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <p
            className={cn(
              "text-sm font-bold sm:text-base",
              inStock
                ? "text-foreground"
                : "text-muted-foreground line-through",
            )}
          >
            {formatCurrency(Number(product.wholesalePrice))}
          </p>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            SKU: {product.sku}
          </p>
        </div>
      </div>

      <div className="shrink-0">
        {inStock ? (
          <ProductAddButtonV2
            productId={product.id}
            productName={product.name}
            storeStock={product.storeStock}
            orderId={orderId}
          />
        ) : (
          <Button
            type="button"
            size="sm"
            className="h-9 cursor-not-allowed rounded-md bg-zinc-200/70 px-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-600 hover:bg-zinc-200/70 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
            disabled
            aria-label={`${product.name} sem estoque`}
          >
            Indisponível
          </Button>
        )}
      </div>
    </li>
  );
}
