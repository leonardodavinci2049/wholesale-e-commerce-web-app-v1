import { Package } from "lucide-react";
import Image from "next/image";

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
  const validImage =
    product.imagePath &&
    (product.imagePath.startsWith("/") || product.imagePath.startsWith("http"))
      ? product.imagePath
      : "/images/product/no-image.jpeg";

  const inStock = product.storeStock > 0;
  const isOnSale = product.promotion;
  const isLaunch = product.launch;

  return (
    <li className="group flex items-start gap-3 border border-border/60 rounded-xl bg-card p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-zinc-200/20 dark:hover:shadow-none hover:border-zinc-300 dark:border-zinc-800/80 dark:bg-zinc-900/80 dark:hover:bg-zinc-900/40 dark:hover:border-zinc-700 sm:gap-4">
      <div className="shrink-0 pt-0.5">
        <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-zinc-200/50 bg-zinc-50 dark:bg-zinc-900 sm:h-16 sm:w-16 dark:border-zinc-800/50">
          <div
            className={cn(
              "relative flex h-full w-full items-center justify-center transition-transform duration-300 group-hover:scale-105",
              !inStock && "opacity-45 grayscale",
            )}
          >
            {validImage ? (
              <Image
                src={validImage}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 3.5rem, 4rem"
                className="object-contain p-1.5"
              />
            ) : (
              <Package className="h-6 w-6 text-zinc-300 dark:text-zinc-700" />
            )}
          </div>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center gap-1.5">
          {!inStock && (
            <span className="rounded-full bg-rose-50 border border-rose-100/50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-rose-600 dark:bg-rose-950/30 dark:border-rose-900/30 dark:text-rose-400">
              Sem estoque
            </span>
          )}
          {inStock && isOnSale && (
            <span className="rounded-full bg-amber-50 border border-amber-100/50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-700 dark:bg-amber-950/30 dark:border-amber-900/30 dark:text-amber-400">
              Oferta
            </span>
          )}
          {inStock && !isOnSale && isLaunch && (
            <span className="rounded-full bg-emerald-50 border border-emerald-100/50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:bg-emerald-950/30 dark:border-emerald-900/30 dark:text-emerald-400">
              Novo
            </span>
          )}
        </div>

        <p
          className={cn(
            "line-clamp-2 text-[14px] font-semibold leading-snug text-zinc-800 dark:text-zinc-150 transition-colors group-hover:text-foreground",
            !inStock && "text-muted-foreground",
          )}
        >
          {product.name}
        </p>

        {(product.brand || product.ref || product.sku) && (
          <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
            {product.brand && (
              <span className="rounded-full bg-blue-50/80 border border-blue-100/40 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-blue-600 dark:bg-blue-950/30 dark:border-blue-900/30 dark:text-blue-400">
                {product.brand}
              </span>
            )}
            {product.ref && (
              <span className="rounded-full bg-zinc-100 border border-zinc-200/30 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-zinc-600 dark:bg-zinc-800 dark:border-zinc-700/30 dark:text-zinc-400">
                REF: {product.ref}
              </span>
            )}
            {product.sku && (
              <span className="rounded-full bg-zinc-100 border border-zinc-200/30 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-zinc-600 dark:bg-zinc-800 dark:border-zinc-700/30 dark:text-zinc-400">
                SKU: {product.sku}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between gap-x-2 mt-2 w-full">
          <p
            className={cn(
              "text-[15px] font-bold tabular-nums tracking-tight text-left sm:text-base",
              inStock
                ? "text-zinc-900 dark:text-zinc-100"
                : "text-muted-foreground line-through",
            )}
          >
            {formatCurrency(Number(product.wholesalePrice))}
          </p>

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
                className="h-8 cursor-not-allowed rounded-full bg-zinc-100 border border-zinc-200/50 px-3 text-[10px] font-bold uppercase tracking-wider text-zinc-400 hover:bg-zinc-100 dark:bg-zinc-800 dark:border-zinc-700/50 dark:text-zinc-500 dark:hover:bg-zinc-800"
                disabled
                aria-label={`${product.name} sem estoque`}
              >
                Indisponível
              </Button>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
