import { PackageSearch } from "lucide-react";

import type { UIProduct } from "@/services/api-main/product-base/transformers/transformers";

import { ProductListItem } from "./product-list-item";

interface ProductListProps {
  products: UIProduct[];
  orderId?: number;
}

export function ProductList({ products, orderId }: ProductListProps) {
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
    <ul className="flex flex-col gap-2 sm:gap-3">
      {sorted.map((product) => (
        <ProductListItem key={product.id} product={product} orderId={orderId} />
      ))}
    </ul>
  );
}
