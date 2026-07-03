"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { useBudgetProductSearch } from "@/hooks/use-budget-product-search";
import type { UIBrand } from "@/services/api-main/brand/transformers/transformers";
import type { UITaxonomyMenuItem } from "@/services/api-main/taxonomy-base/transformers/transformers";

import { BudgetCategoryFilterSheet } from "./budget-category-filter-sheet";
import { BudgetGeneralFilterSheet } from "./budget-general-filter-sheet";

interface ProductSearchBarProps {
  defaultValue: string;
  flagStock: number;
  brands: UIBrand[];
  selectedBrandId?: number;
  categories: UITaxonomyMenuItem[];
  selectedTaxonomyId?: number;
  viewToggleButton?: React.ReactNode;
}

export function ProductSearchBar({
  defaultValue,
  flagStock,
  brands,
  selectedBrandId,
  categories,
  selectedTaxonomyId,
  viewToggleButton,
}: ProductSearchBarProps) {
  const {
    value,
    isPending,
    handleChange,
    handleCompositionStart,
    handleCompositionEnd,
    commitSearch,
  } = useBudgetProductSearch({ initialValue: defaultValue });

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex flex-1 gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute inset-y-0 left-3 my-auto h-4 w-4 text-muted-foreground" />
          <Input
            id="product-search-v2"
            type="search"
            placeholder="Digite o termo de pesquisa"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={(e) =>
              handleCompositionEnd(e.currentTarget.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                commitSearch(e.currentTarget.value);
                e.currentTarget.blur();
              }
            }}
            aria-label="Buscar produto"
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect="off"
            enterKeyHint="search"
            spellCheck={false}
            className={isPending ? "pl-10 opacity-60" : "pl-10"}
          />
        </div>
        {viewToggleButton}
      </div>

      <div className="hidden gap-2 sm:ml-auto sm:flex">
        <BudgetCategoryFilterSheet
          categories={categories}
          selectedTaxonomyId={selectedTaxonomyId}
        />
        <BudgetGeneralFilterSheet
          brands={brands}
          selectedBrandId={selectedBrandId}
          flagStock={flagStock}
        />
      </div>
    </div>
  );
}
