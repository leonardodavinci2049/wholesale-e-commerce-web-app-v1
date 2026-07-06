import { AlertTriangle, PackageSearch } from "lucide-react";

import type { UIProductPdv } from "@/services/api-main/product-pdv/transformers/transformers";

import { ProductCardV2 } from "./product-card-v2";

interface ProductGridProps {
  products: UIProductPdv[];
  orderId?: number;
  isApiUnavailable?: boolean;
}

export function ProductGrid({
  products,
  orderId,
  isApiUnavailable = false,
}: ProductGridProps) {
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
