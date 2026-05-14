"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

import { cn } from "@/lib/utils";
import type { UIBrand } from "@/services/api-main/brand/transformers/transformers";

interface BrandFilterBarProps {
  brands: UIBrand[];
  selectedBrandId?: number;
}

const ROUTE = "/dashboard/order/new-budget";

export function BrandFilterBar({
  brands,
  selectedBrandId,
}: BrandFilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleSelect = useCallback(
    (brandId?: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (brandId) {
        params.set("brandId", String(brandId));
      } else {
        params.delete("brandId");
      }
      params.delete("limit");
      startTransition(() => {
        router.push(`${ROUTE}?${params.toString()}`, { scroll: false });
      });
    },
    [router, searchParams],
  );

  return (
    <div
      className={cn(
        "flex w-full snap-x snap-mandatory gap-2 overflow-x-auto pb-1",
        isPending && "opacity-60",
      )}
    >
      <button
        type="button"
        onClick={() => handleSelect(undefined)}
        className={cn(
          "shrink-0 snap-start rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors",
          !selectedBrandId
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border/60 bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
        )}
      >
        Todos
      </button>
      {brands.map((brand) => {
        const isActive = selectedBrandId === brand.id;
        return (
          <button
            key={brand.id}
            type="button"
            onClick={() => handleSelect(brand.id)}
            className={cn(
              "shrink-0 snap-start rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors",
              isActive
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border/60 bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
            aria-pressed={isActive}
          >
            {brand.name}
          </button>
        );
      })}
    </div>
  );
}
