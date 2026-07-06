"use client";

import { RotateCcw } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";
import type { UIBrand } from "@/services/api-main/brand/transformers/transformers";

import { BrandFilterBar } from "./brand-filter-bar";

const ROUTE = "/dashboard";

interface BudgetBrandFilterPanelProps {
  brands: UIBrand[];
  selectedBrandId?: number;
}

export function BudgetBrandFilterPanel({
  brands,
  selectedBrandId,
}: BudgetBrandFilterPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleClear = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("brandId");
    params.delete("limit");
    const qs = params.toString();
    startTransition(() => {
      router.push(qs ? `${ROUTE}?${qs}` : ROUTE, { scroll: false });
    });
    window.scrollTo(0, 0);
  }, [router, searchParams]);

  return (
    <div className="flex min-h-full flex-col gap-4">
      <BrandFilterBar brands={brands} selectedBrandId={selectedBrandId} />

      <div className="sticky bottom-0 mt-auto border-t border-border/60 bg-background/95 pt-4 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm">
        <SheetClose asChild>
          <Button
            type="button"
            variant="outline"
            className="h-11 w-full rounded-xl"
            onClick={handleClear}
            disabled={isPending || selectedBrandId === undefined}
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Limpar filtro
          </Button>
        </SheetClose>
      </div>
    </div>
  );
}
