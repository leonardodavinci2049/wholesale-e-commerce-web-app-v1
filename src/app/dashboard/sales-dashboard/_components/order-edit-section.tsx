import { Card } from "@/components/ui/card";
import type { UIOrderDashboardDetails } from "@/services/api-main/order-sales/transformers/transformers";
import { OrderEditInlineFields } from "./order-edit-inline-fields";

interface OrderEditSectionProps {
  details: UIOrderDashboardDetails | null;
}

export function OrderEditSection({ details }: OrderEditSectionProps) {
  return (
    <Card className="overflow-hidden rounded-[28px] border-border/70 bg-linear-to-b from-card via-card to-muted/40 p-0 shadow-xl shadow-black/10 dark:shadow-black/30">
      <OrderEditInlineFields details={details} />
    </Card>
  );
}
