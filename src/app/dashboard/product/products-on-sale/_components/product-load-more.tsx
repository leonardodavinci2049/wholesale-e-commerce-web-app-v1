"use client";

import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

import { Button } from "@/components/ui/button";

const ROUTE = "/dashboard/product/products-on-sale";
const PAGE_SIZE = 20;

interface ProductLoadMoreProps {
  currentLimit: number;
  totalLoaded: number;
}

export function ProductLoadMore({
  currentLimit,
  totalLoaded,
}: ProductLoadMoreProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleLoadMore = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", String(currentLimit + PAGE_SIZE));
    startTransition(() => {
      router.push(`${ROUTE}?${params.toString()}`, { scroll: false });
    });
  }, [searchParams, currentLimit, router]);

  if (totalLoaded < currentLimit) return null;

  return (
    <div className="flex justify-center py-3">
      <Button
        variant="default"
        size="sm"
        className="rounded-full px-6 text-xs font-semibold shadow-sm"
        onClick={handleLoadMore}
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Carregando...
          </>
        ) : (
          "Carregar mais produtos"
        )}
      </Button>
    </div>
  );
}
