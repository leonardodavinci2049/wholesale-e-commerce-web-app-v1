"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useRef, useTransition } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const ROUTE = "/dashboard/order/new-budget-v2";

interface ProductSearchBarProps {
  defaultValue: string;
  flagStock: number;
}

export function ProductSearchBar({
  defaultValue,
  flagStock,
}: ProductSearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const buildParams = useCallback(
    (overrides: { search?: string; flagStock?: number }) => {
      const params = new URLSearchParams(searchParams.toString());

      if (overrides.search !== undefined) {
        const trimmed = overrides.search.trim();
        if (trimmed) {
          params.set("search", trimmed);
        } else {
          params.delete("search");
        }
        params.delete("limit");
      }

      if (overrides.flagStock !== undefined) {
        if (overrides.flagStock === 0) {
          params.set("flagStock", "0");
        } else {
          params.delete("flagStock");
        }
      }

      return params;
    },
    [searchParams],
  );

  const handleSearch = useCallback(
    (value: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        const params = buildParams({ search: value });
        startTransition(() => {
          router.push(`${ROUTE}?${params.toString()}`, { scroll: false });
        });
      }, 400);
    },
    [buildParams, router],
  );

  const handleStockToggle = useCallback(
    (checked: boolean) => {
      const params = buildParams({ flagStock: checked ? 1 : 0 });
      startTransition(() => {
        router.push(`${ROUTE}?${params.toString()}`, { scroll: false });
      });
    },
    [buildParams, router],
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

      <div className="flex items-center gap-2 sm:ml-auto">
        <Switch
          id="stock-filter-v2"
          size="sm"
          checked={flagStock === 1}
          onCheckedChange={handleStockToggle}
        />
        <Label
          htmlFor="stock-filter-v2"
          className="cursor-pointer text-xs whitespace-nowrap text-muted-foreground"
        >
          Apenas em estoque
        </Label>
      </div>
    </div>
  );
}
