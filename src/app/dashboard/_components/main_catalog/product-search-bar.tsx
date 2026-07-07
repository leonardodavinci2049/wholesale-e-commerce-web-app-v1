"use client";

import { Filter, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useProductSearch } from "@/hooks/use-product-search";
import type { UIBrand } from "@/services/api-main/brand/transformers/transformers";
import type { UITaxonomyMenuItem } from "@/services/api-main/taxonomy-base/transformers/transformers";

import { BudgetGeneralFilterPanel } from "./budget-general-filter-panel";
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
  } = useProductSearch({ initialValue: defaultValue });

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex flex-1 items-center gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute inset-y-0 left-3 my-auto h-4 w-4 text-muted-foreground" />
          <Input
            id="product-search-v2"
            type="search"
            placeholder="Digite o termo de pesquis"
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
        <Sheet>
          <SheetTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0 rounded-full hover:bg-muted/60 xl:hidden"
              aria-label="Abrir filtros"
            >
              <Filter className="h-5 w-5 text-muted-foreground transition-colors hover:text-foreground" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            aria-describedby={undefined}
            className="flex w-[92vw] max-w-md flex-col gap-0 p-0"
          >
            <SheetHeader className="border-b border-border/60 p-4">
              <SheetTitle className="text-base">Filtros</SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-4">
              <BudgetGeneralFilterPanel
                flagStock={flagStock}
                stockSwitchId="mobile-search-stock-filter"
                brands={brands}
                selectedBrandId={selectedBrandId}
                categories={categories}
                selectedTaxonomyId={selectedTaxonomyId}
              />
            </div>
          </SheetContent>
        </Sheet>
        {viewToggleButton}
      </div>

      <div className="hidden gap-2 sm:ml-auto sm:flex">
        <BudgetGeneralFilterSheet
          flagStock={flagStock}
          brands={brands}
          selectedBrandId={selectedBrandId}
          categories={categories}
          selectedTaxonomyId={selectedTaxonomyId}
        />
      </div>
    </div>
  );
}
