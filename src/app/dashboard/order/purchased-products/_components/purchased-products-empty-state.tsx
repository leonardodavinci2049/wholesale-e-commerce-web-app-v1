import { PackageSearch } from "lucide-react";

interface PurchasedProductsEmptyStateProps {
  hasSearch: boolean;
}

export function PurchasedProductsEmptyState({
  hasSearch,
}: PurchasedProductsEmptyStateProps) {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center rounded-3xl border border-dashed border-border/70 bg-muted/20 px-6 py-10 text-center">
      <div className="mb-4 rounded-full border border-border/70 bg-background p-4 shadow-sm">
        <PackageSearch className="size-8 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold tracking-tight">
        {hasSearch ? "Nenhum produto encontrado" : "Nenhum produto comprado"}
      </h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {hasSearch
          ? "Não encontramos produtos comprados para o termo informado. Tente ajustar a busca."
          : "Você ainda não possui produtos comprados. Suas compras aparecerão aqui."}
      </p>
    </div>
  );
}
