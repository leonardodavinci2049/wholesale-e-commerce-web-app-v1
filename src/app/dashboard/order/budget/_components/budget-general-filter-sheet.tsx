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
import { BudgetGeneralFilterPanel } from "./budget-general-filter-panel";

interface BudgetGeneralFilterSheetProps {
  flagStock: number;
  brands: UIBrand[];
  selectedBrandId?: number;
}

export function BudgetGeneralFilterSheet({
  flagStock,
  brands,
  selectedBrandId,
}: BudgetGeneralFilterSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="hidden gap-2 xl:inline-flex"
          aria-label="Abrir filtro geral"
        >
          <Filter className="size-4" aria-hidden="true" />
          <span>Filtro geral</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        aria-describedby={undefined}
        className="flex w-[92vw] max-w-md flex-col gap-0 p-0"
      >
        <SheetHeader className="border-b border-border/60 p-4">
          <SheetTitle className="text-base">Filtro geral</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-4">
          <BudgetGeneralFilterPanel
            brands={brands}
            selectedBrandId={selectedBrandId}
            flagStock={flagStock}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
