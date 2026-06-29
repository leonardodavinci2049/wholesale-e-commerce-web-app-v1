import { ShieldCheck } from "lucide-react";

interface WarrantyEmptyStateProps {
  hasSearch: boolean;
}

export function WarrantyEmptyState({ hasSearch }: WarrantyEmptyStateProps) {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center rounded-3xl border border-dashed border-border/70 bg-muted/20 px-6 py-10 text-center">
      <div className="mb-4 rounded-full border border-border/70 bg-background p-4 shadow-sm">
        <ShieldCheck className="size-8 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold tracking-tight">
        {hasSearch
          ? "Nenhuma garantia encontrada"
          : "Nenhum produto em garantia"}
      </h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {hasSearch
          ? "Não encontramos garantias para o termo informado. Tente buscar por produto, garantia ou SKU."
          : "Produtos comprados que ainda possuem garantia aparecerão aqui."}
      </p>
    </div>
  );
}
