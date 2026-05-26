import { Package } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { UIProduct } from "@/services/api-main/product-base/transformers/transformers";
import { formatCurrency } from "@/utils/common-utils";

import { ProductAddButton } from "./product-add-button";

interface ProductCardProps {
  product: UIProduct;
  orderId?: number;
  imageLoading?: "eager" | "lazy";
}

export function ProductCard({
  product,
  orderId,
  imageLoading = "lazy",
}: ProductCardProps) {
  const validImage =
    product.imagePath &&
    (product.imagePath.startsWith("/") || product.imagePath.startsWith("http"))
      ? product.imagePath
      : "/images/product/no-image.jpeg";

  const inStock = product.stock > 0;
  const hasDiscount = Number(product.discount) > 0;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card text-card-foreground shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 dark:bg-zinc-900/70">
      <div className="relative aspect-square w-full bg-white p-2 dark:bg-zinc-100">
        {product.brandName && (
          <span className="absolute left-2 top-2 z-10 rounded-lg bg-white/90 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-zinc-600 shadow-sm backdrop-blur-sm dark:bg-zinc-800/90 dark:text-zinc-300">
            {product.brandName}
          </span>
        )}
        {!inStock && (
          <span className="absolute right-2 top-2 z-10 rounded-lg bg-red-500/90 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
            Sem estoque
          </span>
        )}
        {inStock && hasDiscount && (
          <span className="absolute right-2 top-2 z-10 rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-white shadow-sm">
            Promoção
          </span>
        )}

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
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-contain p-2"
            />
          ) : (
            <Package className="h-12 w-12 text-zinc-300" />
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 px-3 py-2.5">
        <p className="line-clamp-2 min-h-10 text-[13px] font-semibold leading-snug text-foreground">
          {product.name}
        </p>

        <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
          {product.sku ? (
            <span className="rounded-md bg-muted/60 px-1.5 py-0.5 text-[9px] font-semibold text-muted-foreground">
              SKU {product.sku}
            </span>
          ) : null}
          {product.ref && (
            <span className="rounded-md bg-muted/60 px-1.5 py-0.5 text-[9px] font-semibold text-muted-foreground">
              REF {product.ref}
            </span>
          )}
        </div>

        <div className="mt-1">
          <p
            className={cn(
              "text-sm font-bold",
              inStock
                ? "text-foreground"
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
      </div>

      <div className="border-t border-border/30 bg-zinc-50/40 px-2.5 py-2 dark:bg-zinc-900/40">
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
            className="h-9 w-full cursor-not-allowed rounded-xl bg-zinc-200/70 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 hover:bg-zinc-200/70 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800"
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
