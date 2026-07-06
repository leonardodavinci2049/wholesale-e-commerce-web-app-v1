import type { UIOrderListItem } from "@/services/api-main/order-reports/transformers/transformers";
import { BudgetEmptyState } from "./budget-empty-state";
import { BudgetTable } from "./budget-table";

interface BudgetListGridProps {
  orders: UIOrderListItem[];
  onClearFilters?: () => void;
}

export function BudgetListGrid({
  orders,
  onClearFilters,
}: BudgetListGridProps) {
  if (orders.length === 0) {
    return <BudgetEmptyState onClearFilters={onClearFilters} />;
  }

  return <BudgetTable orders={orders} />;
}
