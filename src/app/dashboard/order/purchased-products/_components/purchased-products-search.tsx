"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useRef, useTransition } from "react";

import { Input } from "@/components/ui/input";

interface PurchasedProductsSearchProps {
  defaultValue: string;
}

export function PurchasedProductsSearch({
  defaultValue,
}: PurchasedProductsSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
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

        const query = params.toString();
        startTransition(() => {
          router.replace(query ? `${pathname}?${query}` : pathname);
        });
      }, 400);
    },
    [searchParams, pathname, router],
  );

  return (
    <div className="relative flex-1">
      <Search className="pointer-events-none absolute inset-y-0 left-3 my-auto h-4 w-4 text-muted-foreground" />
      <Input
        id="purchased-products-search"
        placeholder="Buscar produto comprado..."
        key={defaultValue}
        defaultValue={defaultValue}
        onChange={(e) => handleSearch(e.target.value)}
        aria-label="Buscar produto comprado"
        className={isPending ? "pl-10 opacity-60" : "pl-10"}
      />
    </div>
  );
}
