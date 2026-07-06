import { AlertTriangle, PackageSearch } from "lucide-react";

import type { UIProductPdv } from "@/services/api-main/product-pdv/transformers/transformers";

import { ProductListItem } from "./product-list-item";

interface ProductListProps {
  products: UIProductPdv[];
  orderId?: number;
  isApiUnavailable?: boolean;
}

export function ProductList({
  products,
  orderId,
  isApiUnavailable = false,
}: ProductListProps) {
  if (products.length === 0) {
    const Icon = isApiUnavailable ? AlertTriangle : PackageSearch;
    const title = isApiUnavailable
      ? "Não foi possível conectar ao serviço de API"
      : "Nenhum produto encontrado";
    const description = isApiUnavailable
      ? "Recarregue a página em alguns instantes ou contacte o suporte técnico."
      : "Ajuste o filtro de marca ou o termo da busca para visualizar os produtos disponíveis.";

    return (
      <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-muted/15 px-6 py-10 text-center">
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Icon className="h-6 w-6" />
        </div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="mt-1 max-w-md text-xs text-muted-foreground">
          {description}
        </p>
      </div>
    );
  }

  const sorted = [...products].sort((a, b) =>
    a.name.localeCompare(b.name, "pt-BR"),
  );

  return (
    <ul className="flex flex-col gap-2 sm:gap-3">
      {sorted.map((product, index) => (
        <ProductListItem
          key={product.id}
          product={product}
          orderId={orderId}
          imageLoading={index === 0 ? "eager" : "lazy"}
        />
      ))}
    </ul>
  );
}
