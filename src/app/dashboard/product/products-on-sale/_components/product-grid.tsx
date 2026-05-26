import { PackageSearch } from "lucide-react";

import type { UIProduct } from "@/services/api-main/product-base/transformers/transformers";

import { ProductCard } from "./product-card";

interface ProductGridProps {
  products: UIProduct[];
  orderId?: number;
}

export function ProductGrid({ products, orderId }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/10 px-6 py-12 text-center">
        <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 text-orange-600 dark:from-amber-900/30 dark:to-orange-900/30 dark:text-orange-400">
          <PackageSearch className="h-7 w-7" />
        </div>
        <p className="text-sm font-semibold text-foreground">
          Nenhum produto em promoção encontrado
        </p>
        <p className="mt-1.5 max-w-sm text-xs text-muted-foreground">
          Tente buscar por outro termo ou aguarde novas promoções.
        </p>
      </div>
    );
  }

  const sorted = [...products].sort((a, b) =>
    a.name.localeCompare(b.name, "pt-BR"),
  );

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 xl:grid-cols-5">
      {sorted.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          orderId={orderId}
          imageLoading={index === 0 ? "eager" : "lazy"}
        />
      ))}
    </div>
  );
}
