"use client";

import { Tags } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

import { cn } from "@/lib/utils";
import type { UIBrand } from "@/services/api-main/brand/transformers/transformers";

interface BrandFilterBarProps {
  brands: UIBrand[];
  selectedBrandId?: number;
}

const ROUTE = "/dashboard/order/budget";

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
    <section
      className={cn(
        "rounded-2xl border border-border/60 bg-card p-4 transition-opacity",
        isPending && "opacity-60",
      )}
    >
      <div className="mb-4 flex items-center gap-2 text-foreground">
        <Tags className="size-4" aria-hidden="true" />
        <h3 className="text-base font-semibold tracking-tight">
          Filtro por marcas
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => handleSelect(undefined)}
          className={cn(
            "flex h-11 min-w-0 items-center gap-2 rounded-full border px-3 text-left text-xs font-semibold uppercase tracking-wide transition-colors",
            !selectedBrandId
              ? "border-primary bg-primary/5 text-primary shadow-xs"
              : "border-border bg-background text-foreground hover:border-primary/50 hover:text-primary",
          )}
          aria-pressed={!selectedBrandId}
        >
          <span className="size-1.5 shrink-0 rounded-full bg-sky-400" />
          <span className="truncate">Todas</span>
        </button>

        {brands.map((brand) => {
          const isActive = selectedBrandId === brand.id;

          return (
            <button
              key={brand.id}
              type="button"
              onClick={() => handleSelect(brand.id)}
              className={cn(
                "flex h-11 min-w-0 items-center gap-2 rounded-full border px-3 text-left text-xs font-semibold uppercase tracking-wide transition-colors",
                isActive
                  ? "border-primary bg-primary/5 text-primary shadow-xs"
                  : "border-border bg-background text-foreground hover:border-primary/50 hover:text-primary",
              )}
              aria-pressed={isActive}
            >
              <span className="size-1.5 shrink-0 rounded-full bg-sky-400" />
              <span className="truncate">{brand.name}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
