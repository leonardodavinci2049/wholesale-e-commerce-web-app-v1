export const BUDGET_FLOW_STEPS = {
  cart: 1,
  payment: 2,
  summary: 3,
} as const;

export function normalizeBudgetStep(step?: number) {
  if (!step || Number.isNaN(step)) {
    return BUDGET_FLOW_STEPS.cart;
  }

  if (step < BUDGET_FLOW_STEPS.cart || step > BUDGET_FLOW_STEPS.summary) {
    return BUDGET_FLOW_STEPS.cart;
  }

  return step;
}
