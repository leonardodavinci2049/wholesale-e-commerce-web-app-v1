"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useRef, useTransition } from "react";

import { Input } from "@/components/ui/input";

const ROUTE = "/dashboard/product/products-on-sale";

interface ProductSearchBarProps {
  defaultValue: string;
  viewToggleButton?: React.ReactNode;
}

export function ProductSearchBar({
  defaultValue,
  viewToggleButton,
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
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute inset-y-0 left-3 my-auto h-4 w-4 text-muted-foreground" />
        <Input
          id="promo-product-search"
          placeholder="Buscar produto em promoção..."
          key={defaultValue}
          defaultValue={defaultValue}
          onChange={(e) => handleSearch(e.target.value)}
          aria-label="Buscar produto em promoção"
          className={isPending ? "pl-10 opacity-60" : "pl-10"}
        />
      </div>
      {viewToggleButton}
    </div>
  );
}
