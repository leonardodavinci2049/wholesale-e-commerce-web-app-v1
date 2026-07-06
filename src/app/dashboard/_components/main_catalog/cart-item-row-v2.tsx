import { Package } from "lucide-react";
import Image from "next/image";

import type { UIOrderDashboardItem } from "@/services/api-main/order-sales/transformers/transformers";
import { formatCurrency } from "@/utils/common-utils";

import { CartItemActions } from "./cart-item-actions";

interface CartItemRowV2Props {
  item: UIOrderDashboardItem;
}

export function CartItemRowV2({ item }: CartItemRowV2Props) {
  return (
    <div className="flex gap-3 border-b border-border/40 pb-3 last:border-b-0 last:pb-0">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border border-border/40 bg-muted/20">
        {item.imagePath ? (
          <Image
            src={item.imagePath}
            alt={item.product}
            fill
            sizes="56px"
            className="object-contain p-1"
          />
        ) : (
          <Package className="absolute inset-0 m-auto h-6 w-6 text-muted-foreground/50" />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="line-clamp-2 text-xs font-semibold leading-tight text-foreground">
          {item.product}
        </p>

        <div className="flex items-center justify-between gap-2">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Unit.:{" "}
            <span className="font-semibold text-foreground">
              {formatCurrency(Number(item.unitValue))}
            </span>
          </p>
          <p className="shrink-0 text-sm font-bold text-foreground">
            {formatCurrency(Number(item.totalValue))}
          </p>
        </div>

        <div className="mt-1 flex items-center justify-between gap-2">
          <CartItemActions
            movementId={item.movementId}
            orderId={item.orderId}
            productName={item.product}
            quantity={item.quantity}
            storeStock={item.storeStock}
            showDeleteButton={false}
          />
          <CartItemActions
            movementId={item.movementId}
            orderId={item.orderId}
            productName={item.product}
            quantity={item.quantity}
            storeStock={item.storeStock}
            showQuantityControls={false}
          />
        </div>
      </div>
    </div>
  );
}
