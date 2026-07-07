"use client";

import { Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { UIBrand } from "@/services/api-main/brand/transformers/transformers";
import type { UITaxonomyMenuItem } from "@/services/api-main/taxonomy-base/transformers/transformers";

import { BudgetGeneralFilterPanel } from "./budget-general-filter-panel";

interface BudgetGeneralFilterSheetProps {
  flagStock: number;
  brands: UIBrand[];
  selectedBrandId?: number;
  categories: UITaxonomyMenuItem[];
  selectedTaxonomyId?: number;
}

export function BudgetGeneralFilterSheet({
  flagStock,
  brands,
  selectedBrandId,
  categories,
  selectedTaxonomyId,
}: BudgetGeneralFilterSheetProps) {
  const isActive =
    flagStock === 1 ||
    selectedBrandId !== undefined ||
    selectedTaxonomyId !== undefined;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant={isActive ? "default" : "outline"}
          className="hidden gap-2 xl:inline-flex"
          aria-label="Abrir filtros"
        >
          <Filter className="size-4" aria-hidden="true" />
          <span>Filtros</span>
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
            brands={brands}
            selectedBrandId={selectedBrandId}
            categories={categories}
            selectedTaxonomyId={selectedTaxonomyId}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
