"use client";

import { RotateCcw } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

import { Button } from "@/components/ui/button";
import type { UIBrand } from "@/services/api-main/brand/transformers/transformers";

import { BrandFilterBar } from "./brand-filter-bar";
import { BudgetStockFilterPanel } from "./budget-stock-filter-panel";

const ROUTE = "/dashboard/order/budget";

interface BudgetFilterPanelProps {
  brands: UIBrand[];
  selectedBrandId?: number;
  flagStock: number;
  stockSwitchId?: string;
}

export function BudgetGeneralFilterPanel({
  brands,
  selectedBrandId,
  flagStock,
  stockSwitchId,
}: BudgetFilterPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const hasActiveFilters = selectedBrandId !== undefined || flagStock === 1;

  const handleClearFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("brandId");
    params.delete("flagStock");
    params.delete("limit");

    startTransition(() => {
      router.push(`${ROUTE}?${params.toString()}`, { scroll: false });
    });
  }, [router, searchParams]);

  return (
    <div className="flex min-h-full flex-col gap-4">
      <div className="space-y-4">
        <BudgetStockFilterPanel
          flagStock={flagStock}
          switchId={stockSwitchId}
        />
        <BrandFilterBar brands={brands} selectedBrandId={selectedBrandId} />
      </div>

      <div className="sticky bottom-0 mt-auto border-t border-border/60 bg-background/95 pt-4 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm">
        <Button
          type="button"
          variant="outline"
          className="h-11 w-full rounded-xl"
          onClick={handleClearFilters}
          disabled={isPending || !hasActiveFilters}
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          Limpar filtros
        </Button>
      </div>
    </div>
  );
}
