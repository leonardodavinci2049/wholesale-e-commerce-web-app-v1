import { Package } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { UIProductPdv } from "@/services/api-main/product-pdv/transformers/transformers";
import { formatCurrency } from "@/utils/common-utils";

import { ProductAddButtonV2 } from "./product-add-button-v2";

interface ProductCardV2Props {
  product: UIProductPdv;
  orderId?: number;
}

export function ProductCardV2({ product, orderId }: ProductCardV2Props) {
  const validImage =
    product.imagePath &&
    (product.imagePath.startsWith("/") || product.imagePath.startsWith("http"))
      ? product.imagePath
      : null;

  const inStock = product.storeStock > 0;
  const isOnSale = product.promotion;
  const isLaunch = product.launch;

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card text-card-foreground shadow-xs transition-all hover:shadow-sm dark:bg-zinc-900/80">
      <div className="relative aspect-square w-full bg-white p-2 dark:bg-zinc-100">
        {product.brand && (
          <span className="absolute left-2 top-2 z-10 rounded-md bg-zinc-200/90 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-zinc-700">
            {product.brand}
          </span>
        )}

        {!inStock && (
          <span className="absolute right-2 top-2 z-10 rounded-md bg-red-600 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
            Sem estoque
          </span>
        )}
        {inStock && isOnSale && (
          <span className="absolute right-2 top-2 z-10 rounded-md bg-amber-400 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-950">
            Oferta
          </span>
        )}
        {inStock && !isOnSale && isLaunch && (
          <span className="absolute right-2 top-2 z-10 rounded-md bg-emerald-500 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
            Novo
          </span>
        )}

        <div
          className={cn(
            "relative flex h-full w-full items-center justify-center",
            !inStock && "opacity-45 grayscale",
          )}
        >
          {validImage ? (
            <Image
              src={validImage}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-contain p-2"
            />
          ) : (
            <Package className="h-12 w-12 text-zinc-300" />
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 px-2.5 py-2">
        <p className="line-clamp-2 min-h-9 text-[12px] font-semibold leading-snug text-foreground">
          {product.name}
        </p>

        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
          SKU: {product.sku}
        </p>

        <p
          className={cn(
            "text-sm font-bold",
            inStock ? "text-foreground" : "text-muted-foreground line-through",
          )}
        >
          {formatCurrency(Number(product.wholesalePrice))}
        </p>
      </div>

      <div className="border-t border-border/40 bg-zinc-50/50 px-2 py-2 dark:bg-zinc-900/50">
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
            className="h-9 w-full cursor-not-allowed rounded-md bg-zinc-200/70 text-[11px] font-semibold uppercase tracking-wider text-zinc-600 hover:bg-zinc-200/70 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
            disabled
            aria-label={`${product.name} sem estoque`}
          >
            Sem estoque
          </Button>
        )}
      </div>
    </div>
  );
}
