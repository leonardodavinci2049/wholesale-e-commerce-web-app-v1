"use client";

import { useSearchParams } from "next/navigation";

import type { UIOrderItemCustomer } from "@/services/api-main/physical_product";

import { DEFAULT_PURCHASED_PRODUCTS_LIMIT } from "../purchased-products.constants";
import { PurchasedProductsEmptyState } from "./purchased-products-empty-state";
import { PurchasedProductsLoadMore } from "./purchased-products-load-more";
import { PurchasedProductsSearch } from "./purchased-products-search";
import { PurchasedProductsTable } from "./purchased-products-table";

interface PurchasedProductsContentProps {
  items: UIOrderItemCustomer[];
  search: string;
}

export function PurchasedProductsContent({
  items,
  search,
}: PurchasedProductsContentProps) {
  const searchParams = useSearchParams();
  const currentLimit =
    Number(searchParams.get("limit")) || DEFAULT_PURCHASED_PRODUCTS_LIMIT;

  return (
    <div className="space-y-6">
      <section className="space-y-2 py-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              Produtos Comprados
            </h1>
            <p className="text-sm text-muted-foreground">
              Histórico de produtos adquiridos por você.
            </p>
          </div>
          <div className="shrink-0 whitespace-nowrap rounded-lg border border-border/70 bg-card px-3 py-1.5 text-xs font-medium shadow-sm">
            {items.length} {items.length === 1 ? "produto" : "produtos"}
          </div>
        </div>
      </section>

      <PurchasedProductsSearch defaultValue={search} />

      <section aria-live="polite" className="space-y-4">
        {items.length > 0 ? (
          <PurchasedProductsTable items={items} />
        ) : (
          <PurchasedProductsEmptyState hasSearch={search.length > 0} />
        )}

        <PurchasedProductsLoadMore
          currentLimit={currentLimit}
          totalLoaded={items.length}
        />
      </section>
    </div>
  );
}
