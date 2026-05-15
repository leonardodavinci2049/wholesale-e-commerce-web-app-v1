"use client";

import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

import { Button } from "@/components/ui/button";

const ROUTE = "/dashboard/order/budget";
const PAGE_SIZE = 50;

interface ProductLoadMoreV2Props {
  currentLimit: number;
  totalLoaded: number;
}

export function ProductLoadMoreV2({
  currentLimit,
  totalLoaded,
}: ProductLoadMoreV2Props) {
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
    <div className="flex justify-center py-2">
      <Button
        variant="default"
        size="sm"
        className="rounded-full px-6 text-xs font-semibold"
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
