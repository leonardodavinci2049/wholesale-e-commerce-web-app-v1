"use client";

import { Info, X } from "lucide-react";
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
  flagStock: number;
}

export function ProductActiveFiltersPanel({
  brands,
  selectedBrandId,
  categories,
  selectedTaxonomyId,
  flagStock,
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
    selectedCategory
      ? { label: "Categoria", value: selectedCategory.name }
      : null,
    selectedBrand ? { label: "Marca", value: selectedBrand.name } : null,
    flagStock === 1 ? { label: "Geral", value: "Apenas em estoque" } : null,
  ].filter((filter) => filter !== null);

  if (activeFilters.length === 0) {
    return null;
  }

  function clearProductFilters() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("brandId");
    params.delete("taxonomyId");
    params.delete("flagStock");
    params.delete("limit");

    const queryString = params.toString();
    const href = queryString ? `${ROUTE}?${queryString}` : ROUTE;

    startTransition(() => {
      router.replace(href, { scroll: false });
    });
  }

  return (
    <div
      className="flex items-start gap-2 rounded-lg border border-yellow-200/80 bg-yellow-50/80 px-2.5 py-2 text-xs text-yellow-950 shadow-xs dark:border-yellow-900/60 dark:bg-yellow-950/20 dark:text-yellow-100 sm:items-center sm:px-3 sm:text-sm"
      aria-live="polite"
    >
      <Info
        className="mt-0.5 size-4 shrink-0 text-yellow-700 dark:text-yellow-300 sm:mt-0"
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1">
        <span className="font-medium">Filtros ativos:</span>
        <ul className="mt-0.5 space-y-0.5 sm:mt-0 sm:inline-flex sm:flex-wrap sm:items-center sm:gap-x-2 sm:gap-y-1 sm:space-y-0">
          {activeFilters.map((filter) => (
            <li
              className="min-w-0 leading-tight sm:inline-flex"
              key={filter.label}
            >
              <span className="font-medium">{filter.label}:</span>{" "}
              <span className="break-words">{filter.value}</span>
            </li>
          ))}
        </ul>
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-7 shrink-0 gap-1 rounded-md border-yellow-300 bg-background/80 px-2 text-xs text-yellow-950 hover:bg-yellow-100 dark:border-yellow-800 dark:text-yellow-100 dark:hover:bg-yellow-950/50"
        onClick={clearProductFilters}
        disabled={isPending}
      >
        <X className="size-3.5" aria-hidden="true" />
        Limpar
      </Button>
    </div>
  );
}
