"use client";

import { RotateCcw } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { type ReactNode, useCallback, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";
import type { UIBrand } from "@/services/api-main/brand/transformers/transformers";
import type { UITaxonomyMenuItem } from "@/services/api-main/taxonomy-base/transformers/transformers";

import { BrandFilterBar } from "./brand-filter-bar";
import { BudgetCategoryFilterPanel } from "./budget-category-filter-panel";
import { BudgetStockFilterPanel } from "./budget-stock-filter-panel";

const ROUTE = "/dashboard";

interface BudgetFilterPanelProps {
  flagStock: number;
  stockSwitchId?: string;
  brands: UIBrand[];
  selectedBrandId?: number;
  categories: UITaxonomyMenuItem[];
  selectedTaxonomyId?: number;
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-sm font-semibold tracking-tight text-foreground">
      {children}
    </h3>
  );
}

export function BudgetGeneralFilterPanel({
  flagStock,
  stockSwitchId,
  brands,
  selectedBrandId,
  categories,
  selectedTaxonomyId,
}: BudgetFilterPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const hasActiveFilters =
    flagStock === 1 ||
    selectedBrandId !== undefined ||
    selectedTaxonomyId !== undefined;

  const handleClearFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("flagStock");
    params.delete("brandId");
    params.delete("taxonomyId");
    params.delete("limit");
    const qs = params.toString();
    startTransition(() => {
      router.push(qs ? `${ROUTE}?${qs}` : ROUTE, { scroll: false });
    });
  }, [router, searchParams]);

  return (
    <div className="flex min-h-full flex-col gap-4">
      <section className="space-y-2">
        <SectionTitle>Estoque</SectionTitle>
        <BudgetStockFilterPanel
          flagStock={flagStock}
          switchId={stockSwitchId}
        />
      </section>

      <section className="space-y-2">
        <SectionTitle>Categorias</SectionTitle>
        <div className="rounded-lg border border-border/60 bg-card p-3">
          <BudgetCategoryFilterPanel
            categories={categories}
            selectedTaxonomyId={selectedTaxonomyId}
          />
        </div>
      </section>

      <section className="space-y-2">
        <SectionTitle>Marcas</SectionTitle>
        <BrandFilterBar brands={brands} selectedBrandId={selectedBrandId} />
      </section>

      <div className="sticky bottom-0 mt-auto border-t border-border/60 bg-background/95 pt-3 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm">
        <SheetClose asChild>
          <Button
            type="button"
            variant="outline"
            className="h-10 w-full rounded-lg"
            onClick={handleClearFilters}
            disabled={isPending || !hasActiveFilters}
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Limpar todos os filtros
          </Button>
        </SheetClose>
      </div>
    </div>
  );
}
