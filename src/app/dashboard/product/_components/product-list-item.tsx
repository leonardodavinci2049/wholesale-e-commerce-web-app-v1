import { Package } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { UIProduct } from "@/services/api-main/product-base/transformers/transformers";
import { formatCurrency } from "@/utils/common-utils";

import { ProductAddButton } from "./product-add-button";

interface ProductListItemProps {
  product: UIProduct;
  orderId?: number;
  imageLoading?: "eager" | "lazy";
}

export function ProductListItem({
  product,
  orderId,
  imageLoading = "lazy",
}: ProductListItemProps) {
  const validImage =
    product.imagePath &&
    (product.imagePath.startsWith("/") || product.imagePath.startsWith("http"))
      ? product.imagePath
      : "/images/product/no-image.jpeg";

  const inStock = product.stock > 0;
  const hasDiscount = Number(product.discount) > 0;

  return (
    <li className="group flex items-start gap-3 rounded-2xl border border-border/50 bg-card p-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-border/80 dark:bg-zinc-900/70 sm:gap-4">
      <div className="shrink-0 pt-0.5">
        <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-border/40 bg-zinc-50 dark:bg-zinc-900 sm:h-16 sm:w-16">
          <div
            className={cn(
              "relative flex h-full w-full items-center justify-center transition-transform duration-300 group-hover:scale-105",
              !inStock && "opacity-40 grayscale",
            )}
          >
            {validImage ? (
              <Image
                src={validImage}
                alt={product.name}
                fill
                loading={imageLoading}
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
          {inStock && hasDiscount && (
            <span className="rounded-full bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100/50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-orange-700 dark:from-amber-950/30 dark:to-orange-950/30 dark:border-amber-900/30 dark:text-orange-400">
              Promoção
            </span>
          )}
        </div>

        <p
          className={cn(
            "line-clamp-2 text-[13px] font-semibold leading-snug transition-colors group-hover:text-foreground",
            !inStock && "text-muted-foreground",
          )}
        >
          {product.name}
        </p>

        <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
          {product.brandName && (
            <span className="rounded-full bg-blue-50/80 border border-blue-100/40 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-blue-600 dark:bg-blue-950/30 dark:border-blue-900/30 dark:text-blue-400">
              {product.brandName}
            </span>
          )}
          {product.ref && (
            <span className="rounded-md bg-muted/60 px-1.5 py-0.5 text-[9px] font-semibold text-muted-foreground">
              REF {product.ref}
            </span>
          )}
          {product.sku ? (
            <span className="rounded-md bg-muted/60 px-1.5 py-0.5 text-[9px] font-semibold text-muted-foreground">
              SKU {product.sku}
            </span>
          ) : null}
        </div>

        <div className="flex items-center justify-between gap-x-2 mt-2 w-full">
          <div>
            <p
              className={cn(
                "text-[15px] font-bold tabular-nums tracking-tight sm:text-base",
                inStock
                  ? "text-zinc-900 dark:text-zinc-100"
                  : "text-muted-foreground line-through",
              )}
            >
              {formatCurrency(Number(product.wholesalePrice))}
            </p>
            {hasDiscount && inStock && (
              <p className="text-[10px] font-medium text-orange-600 dark:text-orange-400">
                -{formatCurrency(Number(product.discount))} desconto
              </p>
            )}
          </div>

          <div className="shrink-0">
            {inStock ? (
              <ProductAddButton
                productId={product.id}
                productName={product.name}
                storeStock={product.stock}
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
