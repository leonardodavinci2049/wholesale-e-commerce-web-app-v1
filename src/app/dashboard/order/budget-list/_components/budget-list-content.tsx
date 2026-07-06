"use client";

import { LoaderCircle } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import type { UIOrderListItem } from "@/services/api-main/order-reports/transformers/transformers";
import {
  type BudgetListFiltersValues,
  type BudgetListSearchParams,
  DEFAULT_BUDGET_LIST_LIMIT,
  normalizeBudgetListFilters,
} from "../budget-list.types";
import { BudgetListFilters } from "./budget-list-filters";
import { BudgetListGrid } from "./budget-list-grid";
import { BudgetLoadMore } from "./budget-load-more";

interface BudgetListContentProps {
  orders: UIOrderListItem[];
  currentFilters: BudgetListSearchParams;
  defaultFilters: BudgetListFiltersValues;
}

function getFiltersFromSearchParams(
  searchParams: ReturnType<typeof useSearchParams>,
  defaultFilters: BudgetListFiltersValues,
): BudgetListFiltersValues {
  return normalizeBudgetListFilters(
    {
      orderId: searchParams.get("orderId") ?? undefined,
      initialDate: searchParams.get("initialDate") ?? undefined,
      finalDate: searchParams.get("finalDate") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
    },
    defaultFilters,
  );
}

function countActiveFilters(
  filters: BudgetListFiltersValues,
  defaultFilters: BudgetListFiltersValues,
): number {
  return [
    filters.orderId !== defaultFilters.orderId ? filters.orderId : "",
    filters.initialDate !== defaultFilters.initialDate
      ? filters.initialDate
      : "",
    filters.finalDate !== defaultFilters.finalDate ? filters.finalDate : "",
    filters.limit !== DEFAULT_BUDGET_LIST_LIMIT ? filters.limit : "",
  ].filter(Boolean).length;
}

export function BudgetListContent({
  orders,
  currentFilters,
  defaultFilters,
}: BudgetListContentProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [filters, setFilters] = useState<BudgetListFiltersValues>(() =>
    normalizeBudgetListFilters(currentFilters, defaultFilters),
  );

  useEffect(() => {
    setFilters(getFiltersFromSearchParams(searchParams, defaultFilters));
  }, [searchParams, defaultFilters]);

  const activeFiltersCount = countActiveFilters(filters, defaultFilters);

  const updateFilters = (nextFilters: BudgetListFiltersValues) => {
    const params = new URLSearchParams();

    if (nextFilters.orderId !== defaultFilters.orderId) {
      params.set("orderId", nextFilters.orderId);
    }

    if (nextFilters.initialDate !== defaultFilters.initialDate) {
      params.set("initialDate", nextFilters.initialDate);
    }

    if (nextFilters.finalDate !== defaultFilters.finalDate) {
      params.set("finalDate", nextFilters.finalDate);
    }

    if (nextFilters.limit !== defaultFilters.limit) {
      params.set("limit", nextFilters.limit);
    }

    const query = params.toString();

    startTransition(() => {
      router.replace(query ? `${pathname}?${query}` : pathname);
    });
  };

  const handleFilterChange = (
    field: keyof BudgetListFiltersValues,
    value: string,
  ) => {
    setFilters((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleApplyFilters = () => {
    updateFilters(filters);
  };

  const handleClearFilters = () => {
    setFilters(defaultFilters);

    startTransition(() => {
      router.replace(pathname);
    });
  };

  return (
    <div className="space-y-6">
      <section className="space-y-2 py-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              Listagem de orçamentos
            </h1>
          </div>

          <div className="shrink-0 whitespace-nowrap rounded-lg border border-border/70 bg-card px-3 py-1.5 text-xs font-medium shadow-sm">
            {orders.length} orçamento{orders.length === 1 ? "" : "s"}
          </div>
        </div>

        {activeFiltersCount > 0 && (
          <div className="flex justify-end">
            <div className="whitespace-nowrap rounded-lg border border-border/70 bg-card px-3 py-1.5 text-xs font-medium shadow-sm">
              {activeFiltersCount} filtro{activeFiltersCount === 1 ? "" : "s"}{" "}
              ativo{activeFiltersCount === 1 ? "" : "s"}
            </div>
          </div>
        )}
      </section>

      <BudgetListFilters
        filters={filters}
        activeFiltersCount={activeFiltersCount}
        isLoading={isPending}
        onFilterChange={handleFilterChange}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
      />

      <section aria-live="polite" className="space-y-4">
        {isPending && (
          <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background/90 px-4 py-3 text-sm shadow-sm">
            <LoaderCircle className="size-4 animate-spin text-primary" />
            Atualizando listagem de orçamentos...
          </div>
        )}

        <div
          className={
            isPending ? "opacity-60 transition-opacity" : "transition-opacity"
          }
        >
          <BudgetListGrid orders={orders} onClearFilters={handleClearFilters} />
        </div>

        <BudgetLoadMore
          currentLimit={Number(filters.limit) || 50}
          totalLoaded={orders.length}
        />
      </section>
    </div>
  );
}
