"use client";

import { X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useTransition } from "react";

import { Button } from "@/components/ui/button";
import type { UIBrand } from "@/services/api-main/brand/transformers/transformers";
import type { UITaxonomyMenuItem } from "@/services/api-main/taxonomy-base/transformers/transformers";

const ROUTE = "/dashboard/order/budget";

interface ProductActiveFiltersPanelProps {
  brands: UIBrand[];
  selectedBrandId?: number;
  categories: UITaxonomyMenuItem[];
  selectedTaxonomyId?: number;
}

export function ProductActiveFiltersPanel({
  brands,
  selectedBrandId,
  categories,
  selectedTaxonomyId,
}: ProductActiveFiltersPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const selectedBrand = useMemo(
    () => brands.find((brand) => brand.id === selectedBrandId),
    [brands, selectedBrandId],
  );
  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === selectedTaxonomyId),
    [categories, selectedTaxonomyId],
  );

  const activeFilters = [
    selectedCategory ? `Categoria: ${selectedCategory.name}` : null,
    selectedBrand ? `Marca: ${selectedBrand.name}` : null,
  ].filter(Boolean);

  if (activeFilters.length === 0) {
    return null;
  }

  function clearProductFilters() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("brandId");
    params.delete("taxonomyId");
    params.delete("limit");

    const queryString = params.toString();
    const href = queryString ? `${ROUTE}?${queryString}` : ROUTE;

    startTransition(() => {
      router.replace(href, { scroll: false });
    });
  }

  return (
    <div
      className="flex min-h-11 items-center gap-2 overflow-hidden rounded-xl border border-border/70 bg-muted/20 px-3 py-2 text-sm sm:px-4"
      aria-live="polite"
    >
      <div className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap text-muted-foreground">
        <span className="font-medium text-foreground">Filtros ativos:</span>{" "}
        {activeFilters.join(" • ")}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-8 shrink-0 gap-1 rounded-lg px-2 text-xs sm:px-3"
        onClick={clearProductFilters}
        disabled={isPending}
      >
        <X className="size-3.5" aria-hidden="true" />
        Limpar
      </Button>
    </div>
  );
}
