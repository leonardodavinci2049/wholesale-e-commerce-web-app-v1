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

export interface OrderListSearchParams {
  orderId?: string;
  orderStatusId?: string;
  financialStatusId?: string;
  initialDate?: string;
  finalDate?: string;
  limit?: string;
}

export interface OrderListFiltersValues {
  orderId: string;
  orderStatusId: string;
  financialStatusId: string;
  initialDate: string;
  finalDate: string;
  limit: string;
}

export interface OrderListStatusOption {
  value: string;
  label: string;
}

export const DEFAULT_ORDER_LIST_ID = "0";
export const DEFAULT_ORDER_LIST_LIMIT = "50";

export function getDefaultOrderListFilters(
  referenceDate: Date = new Date(),
): OrderListFiltersValues {
  const tomorrow = getTomorrow(referenceDate);

  return {
    orderId: "",
    orderStatusId: DEFAULT_ORDER_LIST_ID,
    financialStatusId: "-1",
    initialDate: formatDateForInput(getOneYearBefore(tomorrow)),
    finalDate: formatDateForInput(tomorrow),
    limit: DEFAULT_ORDER_LIST_LIMIT,
  };
}

export function normalizeOrderListFilters(
  filters: Partial<OrderListSearchParams> = {},
  defaults: OrderListFiltersValues = getDefaultOrderListFilters(),
): OrderListFiltersValues {
  return {
    orderId: filters.orderId ?? defaults.orderId,
    orderStatusId: filters.orderStatusId ?? defaults.orderStatusId,
    financialStatusId: filters.financialStatusId ?? defaults.financialStatusId,
    initialDate: filters.initialDate ?? defaults.initialDate,
    finalDate: filters.finalDate ?? defaults.finalDate,
    limit: filters.limit ?? defaults.limit,
  };
}
