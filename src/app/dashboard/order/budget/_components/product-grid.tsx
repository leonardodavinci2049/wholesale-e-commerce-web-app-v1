import { PackageSearch } from "lucide-react";

import type { UIProductPdv } from "@/services/api-main/product-pdv/transformers/transformers";

import { ProductCardV2 } from "./product-card-v2";

interface ProductGridProps {
  products: UIProductPdv[];
  orderId?: number;
}

export function ProductGrid({ products, orderId }: ProductGridProps) {
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
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 xl:grid-cols-5">
      {sorted.map((product, index) => (
        <ProductCardV2
          key={product.id}
          product={product}
          orderId={orderId}
          imageLoading={index === 0 ? "eager" : "lazy"}
        />
      ))}
    </div>
  );
}
