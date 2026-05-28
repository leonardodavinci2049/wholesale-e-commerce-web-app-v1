export function parseMonetaryValue(value: string | null | undefined): number {
  if (!value) return 0;
  const cleaned = String(value).replace(/[R$\s]/g, "");
  if (!cleaned) return 0;
  if (cleaned.includes(",")) {
    const normalized = cleaned.replace(/\./g, "").replace(",", ".");
    const num = Number(normalized);
    return Number.isNaN(num) ? 0 : num;
  }
  const num = Number(cleaned);
  return Number.isNaN(num) ? 0 : num;
}

export function formatCurrency(value: number | null | undefined): string {
  // Handle null, undefined, or invalid numbers
  const numericValue =
    typeof value === "number" && !Number.isNaN(value) ? value : 0;

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numericValue);
}

export function debounce<T extends (...args: never[]) => unknown>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
