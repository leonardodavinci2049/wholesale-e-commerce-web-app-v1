"use client";

import { useSearchParams } from "next/navigation";

import type { UIPhysicalProductWarranty } from "@/services/api-main/physical_product";

import { DEFAULT_WARRANTY_LIMIT } from "../warranty.constants";
import { WarrantyEmptyState } from "./warranty-empty-state";
import { WarrantyLoadMore } from "./warranty-load-more";
import { WarrantySearch } from "./warranty-search";
import { WarrantyTable } from "./warranty-table";

interface WarrantyContentProps {
  items: UIPhysicalProductWarranty[];
  search: string;
}

export function WarrantyContent({ items, search }: WarrantyContentProps) {
  const searchParams = useSearchParams();
  const currentLimit =
    Number(searchParams.get("limit")) || DEFAULT_WARRANTY_LIMIT;

  return (
    <div className="space-y-6">
      <section className="space-y-2 py-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              Produtos em Garantia
            </h1>
            <p className="text-sm text-muted-foreground">
              Produtos comprados por você que ainda possuem garantia vigente.
            </p>
          </div>
          <div className="shrink-0 whitespace-nowrap rounded-lg border border-border/70 bg-card px-3 py-1.5 text-xs font-medium shadow-sm">
            {items.length} {items.length === 1 ? "garantia" : "garantias"}
          </div>
        </div>
      </section>

      <WarrantySearch defaultValue={search} />

      <section aria-live="polite" className="space-y-4">
        {items.length > 0 ? (
          <WarrantyTable items={items} />
        ) : (
          <WarrantyEmptyState hasSearch={search.length > 0} />
        )}

        <WarrantyLoadMore
          currentLimit={currentLimit}
          totalLoaded={items.length}
        />
      </section>
    </div>
  );
}
