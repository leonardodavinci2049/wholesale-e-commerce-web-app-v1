function formatDateForInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getTomorrow(referenceDate: Date): Date {
  const tomorrow = new Date(referenceDate);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return tomorrow;
}

function getOneYearBefore(referenceDate: Date): Date {
  const date = new Date(referenceDate);
  date.setFullYear(date.getFullYear() - 1);

  return date;
}

export const BUDGET_ORDER_STATUS_ID = "22";

export interface BudgetListSearchParams {
  orderId?: string;
  initialDate?: string;
  finalDate?: string;
  limit?: string;
}

export interface BudgetListFiltersValues {
  orderId: string;
  initialDate: string;
  finalDate: string;
  limit: string;
}

export interface BudgetListStatusOption {
  value: string;
  label: string;
}

export const DEFAULT_BUDGET_LIST_ID = "0";
export const DEFAULT_BUDGET_LIST_LIMIT = "50";

export function getDefaultBudgetListFilters(
  referenceDate: Date = new Date(),
): BudgetListFiltersValues {
  const tomorrow = getTomorrow(referenceDate);

  return {
    orderId: "",
    initialDate: formatDateForInput(getOneYearBefore(tomorrow)),
    finalDate: formatDateForInput(tomorrow),
    limit: DEFAULT_BUDGET_LIST_LIMIT,
  };
}

export function normalizeBudgetListFilters(
  filters: Partial<BudgetListSearchParams> = {},
  defaults: BudgetListFiltersValues = getDefaultBudgetListFilters(),
): BudgetListFiltersValues {
  return {
    orderId: filters.orderId ?? defaults.orderId,
    initialDate: filters.initialDate ?? defaults.initialDate,
    finalDate: filters.finalDate ?? defaults.finalDate,
    limit: filters.limit ?? defaults.limit,
  };
}
