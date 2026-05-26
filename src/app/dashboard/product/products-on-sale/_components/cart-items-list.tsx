import type { UIOrderDashboardItem } from "@/services/api-main/order-sales/transformers/transformers";

import { CartItemRow } from "./cart-item-row";

interface CartItemsListProps {
  items: UIOrderDashboardItem[];
  emptyMessage?: string;
}

export function CartItemsList({
  items,
  emptyMessage = "Nenhum item adicionado ao carrinho.",
}: CartItemsListProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border/50 bg-muted/10 px-4 py-8 text-center">
        <p className="text-xs text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <CartItemRow key={item.movementId} item={item} />
      ))}
    </div>
  );
}
