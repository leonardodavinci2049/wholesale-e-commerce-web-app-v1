"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useRef, useTransition } from "react";

import { Input } from "@/components/ui/input";
import type { UIBrand } from "@/services/api-main/brand/transformers/transformers";

import { BudgetCategoryFilterSheet } from "./budget-category-filter-sheet";
import { BudgetGeneralFilterSheet } from "./budget-general-filter-sheet";

const ROUTE = "/dashboard/order/budget";

interface ProductSearchBarProps {
  defaultValue: string;
  flagStock: number;
  brands: UIBrand[];
  selectedBrandId?: number;
}

export function ProductSearchBar({
  defaultValue,
  flagStock,
  brands,
  selectedBrandId,
}: ProductSearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const buildSearchParams = useCallback(
    (searchValue: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const trimmed = searchValue.trim();

      if (trimmed) {
        params.set("search", trimmed);
      } else {
        params.delete("search");
      }

      params.delete("limit");

      return params;
    },
    [searchParams],
  );

  const handleSearch = useCallback(
    (value: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        const params = buildSearchParams(value);
        startTransition(() => {
          router.push(`${ROUTE}?${params.toString()}`, { scroll: false });
        });
      }, 400);
    },
    [buildSearchParams, router],
  );

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id="product-search-v2"
          placeholder="Digite o modelo para consultar rápido"
          defaultValue={defaultValue}
          onChange={(e) => handleSearch(e.target.value)}
          aria-label="Buscar produto"
          className={isPending ? "pl-10 opacity-60" : "pl-10"}
        />
      </div>

      <div className="hidden gap-2 sm:ml-auto sm:flex">
        <BudgetCategoryFilterSheet />
        <BudgetGeneralFilterSheet
          brands={brands}
          selectedBrandId={selectedBrandId}
          flagStock={flagStock}
        />
      </div>
    </div>
  );
}
