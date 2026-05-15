import { PackageSearch } from "lucide-react";

import type { UIProductPdv } from "@/services/api-main/product-pdv/transformers/transformers";

import { ProductListItem } from "./product-list-item";

interface ProductListProps {
  products: UIProductPdv[];
  orderId?: number;
}

export function ProductList({ products, orderId }: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-muted/15 px-6 py-10 text-center">
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <PackageSearch className="h-6 w-6" />
        </div>
        <p className="text-sm font-semibold text-foreground">
          Nenhum produto encontrado
        </p>
        <p className="mt-1 max-w-md text-xs text-muted-foreground">
          Ajuste o filtro de marca ou o termo da busca para visualizar os
          produtos disponíveis.
        </p>
      </div>
    );
  }

  const sorted = [...products].sort((a, b) =>
    a.name.localeCompare(b.name, "pt-BR"),
  );

  return (
    <ul className="overflow-hidden rounded-xl border border-border/60 bg-card text-card-foreground shadow-xs dark:bg-zinc-900/80">
      {sorted.map((product) => (
        <ProductListItem key={product.id} product={product} orderId={orderId} />
      ))}
    </ul>
  );
}
