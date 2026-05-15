"use client";

import { LayoutGrid } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { BudgetCategoryFilterPanel } from "./budget-category-filter-panel";

export function BudgetCategoryFilterSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="hidden gap-2 xl:inline-flex"
          aria-label="Abrir categorias"
        >
          <LayoutGrid className="size-4" aria-hidden="true" />
          <span>Categorias</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        aria-describedby={undefined}
        className="flex w-[92vw] max-w-md flex-col gap-0 p-0"
      >
        <SheetHeader className="border-b border-border/60 p-4">
          <SheetTitle className="text-base">Categorias</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-4">
          <BudgetCategoryFilterPanel />
        </div>
      </SheetContent>
    </Sheet>
  );
}
