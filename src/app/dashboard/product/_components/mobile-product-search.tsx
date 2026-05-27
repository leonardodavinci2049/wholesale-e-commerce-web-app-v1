"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useRef, useTransition } from "react";

import { Input } from "@/components/ui/input";

const ROUTE = "/dashboard/product/products-on-sale";

interface MobileProductSearchProps {
  defaultValue: string;
}

export function MobileProductSearch({
  defaultValue,
}: MobileProductSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = useCallback(
    (value: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        const params = new URLSearchParams(searchParams.toString());
        const trimmed = value.trim();
        if (trimmed) {
          params.set("search", trimmed);
        } else {
          params.delete("search");
        }
        params.delete("limit");
        startTransition(() => {
          router.push(`${ROUTE}?${params.toString()}`, { scroll: false });
        });
      }, 400);
    },
    [searchParams, router],
  );

  return (
    <div className="relative">
      <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Buscar produto em promoção..."
        key={defaultValue}
        defaultValue={defaultValue}
        onChange={(e) => handleSearch(e.target.value)}
        aria-label="Buscar produto em promoção"
        className={isPending ? "pl-10 opacity-60" : "pl-10"}
      />
    </div>
  );
}
