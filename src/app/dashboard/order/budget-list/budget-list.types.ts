function formatDateForInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getPreviousMonthStart(referenceDate: Date): Date {
  return new Date(referenceDate.getFullYear(), referenceDate.getMonth() - 1, 1);
}

function getTomorrow(referenceDate: Date): Date {
  const tomorrow = new Date(referenceDate);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return tomorrow;
}

export const BUDGET_ORDER_STATUS_ID = "22";

export interface BudgetListSearchParams {
  orderId?: string;
  customerId?: string;
  financialStatusId?: string;
  locationId?: string;
  initialDate?: string;
  finalDate?: string;
  limit?: string;
}

export interface BudgetListFiltersValues {
  orderId: string;
  customerId: string;
  financialStatusId: string;
  locationId: string;
  initialDate: string;
  finalDate: string;
  limit: string;
}

export interface BudgetListStatusOption {
  value: string;
  label: string;
}

export const DEFAULT_BUDGET_LIST_ID = "0";
export const DEFAULT_BUDGET_LIST_LIMIT = "20";

export function getDefaultBudgetListFilters(
  referenceDate: Date = new Date(),
): BudgetListFiltersValues {
  return {
    orderId: "",
    customerId: "",
    financialStatusId: "-1",
    locationId: DEFAULT_BUDGET_LIST_ID,
    initialDate: formatDateForInput(getPreviousMonthStart(referenceDate)),
    finalDate: formatDateForInput(getTomorrow(referenceDate)),
    limit: DEFAULT_BUDGET_LIST_LIMIT,
  };
}

export function normalizeBudgetListFilters(
  filters: Partial<BudgetListSearchParams> = {},
  defaults: BudgetListFiltersValues = getDefaultBudgetListFilters(),
): BudgetListFiltersValues {
  return {
    orderId: filters.orderId ?? defaults.orderId,
    customerId: filters.customerId ?? defaults.customerId,
    financialStatusId: filters.financialStatusId ?? defaults.financialStatusId,
    locationId: filters.locationId ?? defaults.locationId,
    initialDate: filters.initialDate ?? defaults.initialDate,
    finalDate: filters.finalDate ?? defaults.finalDate,
    limit: filters.limit ?? defaults.limit,
  };
}
