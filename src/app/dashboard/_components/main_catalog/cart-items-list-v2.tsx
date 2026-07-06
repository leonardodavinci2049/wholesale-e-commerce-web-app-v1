import type { UIOrderDashboardItem } from "@/services/api-main/order-sales/transformers/transformers";

import { CartItemRowV2 } from "./cart-item-row-v2";

interface CartItemsListV2Props {
  items: UIOrderDashboardItem[];
  emptyMessage?: string;
}

export function CartItemsListV2({
  items,
  emptyMessage = "Nenhum item adicionado ao carrinho.",
}: CartItemsListV2Props) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border/60 bg-muted/15 px-4 py-8 text-center">
        <p className="text-xs text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <CartItemRowV2 key={item.movementId} item={item} />
      ))}
    </div>
  );
}
