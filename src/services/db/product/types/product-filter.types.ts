export const DEFAULT_PRODUCT_STATUS_FILTER = "2" as const;

export type ProductStatusFilter = "1" | "2" | "all";

export function parseProductStatusFilter(value?: string): ProductStatusFilter {
  if (value === "1" || value === "all") {
    return value;
  }

  return DEFAULT_PRODUCT_STATUS_FILTER;
}
