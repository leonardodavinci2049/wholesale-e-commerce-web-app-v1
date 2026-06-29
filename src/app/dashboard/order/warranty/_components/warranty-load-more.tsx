"use client";

import { Loader2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

import { Button } from "@/components/ui/button";

import { WARRANTY_PAGE_SIZE } from "../warranty.constants";

interface WarrantyLoadMoreProps {
  currentLimit: number;
  totalLoaded: number;
}

export function WarrantyLoadMore({
  currentLimit,
  totalLoaded,
}: WarrantyLoadMoreProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleLoadMore = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", String(currentLimit + WARRANTY_PAGE_SIZE));

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }, [searchParams, currentLimit, router, pathname]);

  if (totalLoaded < currentLimit) return null;

  return (
    <div className="flex justify-center rounded-3xl border border-dashed border-border/60 bg-card/50 py-5">
      <Button
        variant="default"
        size="lg"
        className="rounded-full px-8"
        onClick={handleLoadMore}
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Carregando...
          </>
        ) : (
          "Carregar mais garantias"
        )}
      </Button>
    </div>
  );
}
