"use client";

import { useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SALES_DASHBOARD_PAYMENT_METHODS } from "@/core/config-tenant/payment-methods";
import { PaymentButtonSection } from "./payment-button-section";

export function PaymentMethodsSection() {
  const [selectedMethod, setSelectedMethod] = useState("pix");

  const currentMethod =
    SALES_DASHBOARD_PAYMENT_METHODS.find(
      (method) => method.id === selectedMethod,
    ) ?? SALES_DASHBOARD_PAYMENT_METHODS[0];

  const CurrentIcon = currentMethod.Icon;

  return (
    <Accordion type="single" collapsible defaultValue="">
      <AccordionItem value="payment" className="border-0">
        <AccordionTrigger className="py-0 hover:no-underline">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
              <CurrentIcon className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="text-left">
              <p className="text-xs text-muted-foreground">Pagamento</p>
              <p className="text-sm font-semibold text-foreground">
                {currentMethod.label}
              </p>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-0 pt-3">
          <div className="grid grid-cols-2 gap-2">
            {SALES_DASHBOARD_PAYMENT_METHODS.map((method) => (
              <PaymentButtonSection
                key={method.id}
                icon={method.icon}
                label={method.label}
                color={method.color}
                isActive={selectedMethod === method.id}
                isRecommended={Boolean(method.recommended)}
                onClick={() => setSelectedMethod(method.id)}
              />
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
