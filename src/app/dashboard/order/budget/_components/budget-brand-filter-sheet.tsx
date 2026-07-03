"use client";

import { Tags } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { UIBrand } from "@/services/api-main/brand/transformers/transformers";

import { BudgetBrandFilterPanel } from "./budget-brand-filter-panel";

interface BudgetBrandFilterSheetProps {
  brands: UIBrand[];
  selectedBrandId?: number;
}

export function BudgetBrandFilterSheet({
  brands,
  selectedBrandId,
}: BudgetBrandFilterSheetProps) {
  const isActive = selectedBrandId !== undefined;
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant={isActive ? "default" : "outline"}
          className="hidden gap-2 xl:inline-flex"
          aria-label="Abrir marcas"
        >
          <Tags className="size-4" aria-hidden="true" />
          <span>Marcas</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        aria-describedby={undefined}
        className="flex w-[92vw] max-w-md flex-col gap-0 p-0"
      >
        <SheetHeader className="border-b border-border/60 p-4">
          <SheetTitle className="text-base">Marcas</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-4">
          <BudgetBrandFilterPanel
            brands={brands}
            selectedBrandId={selectedBrandId}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
