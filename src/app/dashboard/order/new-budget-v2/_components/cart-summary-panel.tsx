import { ShoppingCart } from "lucide-react";

import { PaymentMethodSelect } from "@/app/dashboard/order/new-budget/_components/payment-method-select";
import { Separator } from "@/components/ui/separator";
import type {
  UIOrderDashboardItem,
  UIOrderSalesSummary,
} from "@/services/api-main/order-sales/transformers/transformers";
import { formatCurrency } from "@/utils/common-utils";

import { CartItemsListV2 } from "./cart-items-list-v2";
import { ViewBudgetButton } from "./view-budget-button";

interface CartSummaryPanelProps {
  items: UIOrderDashboardItem[];
  summary: UIOrderSalesSummary | null | undefined;
  orderId?: number;
  selectedPaymentId?: number;
}

export function CartSummaryPanel({
  items,
  summary,
  orderId,
  selectedPaymentId,
}: CartSummaryPanelProps) {
  const itemCount = items.length;
  const itemLabel = itemCount === 1 ? "item" : "itens";

  return (
    <div className="flex max-h-[calc(100vh-2rem)] flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/95 shadow-xs">
      <header className="flex items-center justify-between gap-2 border-b border-border/50 px-4 py-3">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Seu pedido
            </span>
            <span className="text-sm font-semibold text-foreground">
              Carrinho
            </span>
          </div>
        </div>
        {itemCount > 0 && (
          <span className="rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-semibold text-white">
            {itemCount} {itemLabel}
          </span>
        )}
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-3">
        <CartItemsListV2 items={items} />

        {summary && itemCount > 0 && (
          <div className="mt-4 space-y-2 text-sm">
            {Number(summary.discountValue) > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Desconto</span>
                <span>-{formatCurrency(Number(summary.discountValue))}</span>
              </div>
            )}
            {Number(summary.freightValue) > 0 && (
              <div className="flex justify-between text-muted-foreground">
                <span>Frete</span>
                <span>{formatCurrency(Number(summary.freightValue))}</span>
              </div>
            )}
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold">Total</span>
              <span className="text-base font-bold">
                {formatCurrency(Number(summary.totalOrderValue))}
              </span>
            </div>
            <p className="text-[10px] leading-snug text-muted-foreground">
              Valores exclusivos para revendas e assistências cadastradas.
              Pedido sujeito a confirmação de estoque.
            </p>
          </div>
        )}
      </div>

      <footer className="space-y-3 border-t border-border/50 bg-background/50 px-4 py-3">
        {orderId && (
          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Pagamento
            </p>
            <PaymentMethodSelect
              orderId={orderId}
              defaultValue={selectedPaymentId ? String(selectedPaymentId) : "2"}
            />
          </div>
        )}

        <ViewBudgetButton orderId={orderId} disabled={itemCount === 0} />
      </footer>
    </div>
  );
}
