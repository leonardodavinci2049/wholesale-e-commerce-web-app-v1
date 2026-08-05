"use client";

import { Truck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { OrderTipoFreteEntity } from "@/services/api-main/order-sales";
import { formatCurrency } from "@/utils/common-utils";
import { updateDeliveryMethodAction } from "../actions/update-delivery-method-action";

const DEFAULT_DELIVERY_METHOD_ID = 1;
const EDITABLE_ORDER_STATUS_ID = 22;

interface DeliveryMethodsSectionProps {
  deliveryMethods: OrderTipoFreteEntity[];
  hasFreeShipping: boolean;
  orderId: number;
  orderStatusId: number;
}

export function DeliveryMethodsSection({
  deliveryMethods,
  hasFreeShipping,
  orderId,
  orderStatusId,
}: DeliveryMethodsSectionProps) {
  const router = useRouter();
  const [selectedMethodId, setSelectedMethodId] = useState(
    String(DEFAULT_DELIVERY_METHOD_ID),
  );
  const [isPending, startTransition] = useTransition();
  const currentMethod =
    deliveryMethods.find(
      (method) => String(method.ID_TIPO_FRETE) === selectedMethodId,
    ) ?? deliveryMethods[0];
  const canUpdate =
    orderId > 0 &&
    orderStatusId === EDITABLE_ORDER_STATUS_ID &&
    deliveryMethods.length > 0;

  function handleDeliveryMethodChange(nextMethodId: string) {
    if (nextMethodId === selectedMethodId || !canUpdate) {
      return;
    }

    const previousMethodId = selectedMethodId;
    const parsedMethodId = Number(nextMethodId);
    setSelectedMethodId(nextMethodId);

    startTransition(async () => {
      const result = await updateDeliveryMethodAction(orderId, parsedMethodId);

      if (!result.success) {
        setSelectedMethodId(previousMethodId);
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.refresh();
    });
  }

  return (
    <Accordion type="single" collapsible defaultValue="">
      <AccordionItem value="delivery" className="border-0">
        <AccordionTrigger
          className="py-0 hover:no-underline"
          disabled={deliveryMethods.length === 0}
        >
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
              <Truck className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="text-left">
              <p className="text-xs text-muted-foreground">Entrega</p>
              <p className="text-sm font-semibold text-foreground">
                {currentMethod?.TIPO_FRETE ?? "Nenhuma forma disponível"}
              </p>
            </div>
          </div>
        </AccordionTrigger>

        <AccordionContent className="pb-0 pt-3">
          <div className="grid grid-cols-2 gap-2">
            {deliveryMethods.map((method) => (
              <Button
                key={method.ID_TIPO_FRETE}
                type="button"
                variant="ghost"
                aria-pressed={selectedMethodId === String(method.ID_TIPO_FRETE)}
                disabled={!canUpdate || isPending}
                onClick={() =>
                  handleDeliveryMethodChange(String(method.ID_TIPO_FRETE))
                }
                className={cn(
                  "h-auto w-full flex-col items-center justify-center gap-1 rounded-3xl border px-2 py-2 text-center shadow-none transition-all",
                  "hover:-translate-y-0.5 hover:bg-accent/70",
                  selectedMethodId === String(method.ID_TIPO_FRETE)
                    ? "border-primary/25 bg-primary/10 shadow-lg shadow-black/10"
                    : "border-border/70 bg-background/80 dark:bg-white/3",
                )}
              >
                <div className="rounded-xl border border-border/60 bg-background/80 p-1.5 dark:bg-white/6">
                  <Truck className="h-3.5 w-3.5 text-primary" />
                </div>
                <p className="w-full whitespace-nowrap text-xs font-semibold leading-none text-foreground sm:text-[13px]">
                  {method.TIPO_FRETE}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(
                    hasFreeShipping ? 0 : Number(method.VALOR_PADRAO),
                  )}
                </p>
              </Button>
            ))}
          </div>

          {orderStatusId !== EDITABLE_ORDER_STATUS_ID ? (
            <p className="mt-3 text-xs text-muted-foreground">
              O frete só pode ser alterado em pedidos com status orçamento.
            </p>
          ) : null}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
