"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

import { Label } from "@/components/ui/label";
import { SheetClose } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const ROUTE = "/dashboard/order/budget";

interface BudgetStockFilterPanelProps {
  flagStock: number;
  switchId?: string;
}

export function BudgetStockFilterPanel({
  flagStock,
  switchId = "stock-filter-v2",
}: BudgetStockFilterPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleStockToggle = useCallback(
    (checked: boolean) => {
      const params = new URLSearchParams(searchParams.toString());

      if (checked) {
        params.set("flagStock", "1");
      } else {
        params.delete("flagStock");
      }

      startTransition(() => {
        router.push(`${ROUTE}?${params.toString()}`, { scroll: false });
      });
    },
    [router, searchParams],
  );

  return (
    <div
      className={cn(
        "rounded-lg border border-border/60 bg-card p-4 transition-opacity",
        isPending && "opacity-60",
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <Label
          htmlFor={switchId}
          className="cursor-pointer text-sm text-foreground"
        >
          Apenas em estoque
        </Label>
        <SheetClose asChild>
          <Switch
            id={switchId}
            checked={flagStock === 1}
            onCheckedChange={handleStockToggle}
            disabled={isPending}
          />
        </SheetClose>
      </div>
    </div>
  );
}
