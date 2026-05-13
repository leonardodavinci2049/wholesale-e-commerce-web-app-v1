"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import { BUDGET_FLOW_STEPS } from "../budget-flow";

interface CloseOrderButtonProps {
  orderId: number;
}

export function CloseOrderButton({ orderId }: CloseOrderButtonProps) {
  const params = new URLSearchParams();
  params.set("step", String(BUDGET_FLOW_STEPS.summary));
  params.set("orderId", String(orderId));
  const href = `/dashboard/order/new-budget?${params.toString()}`;

  return (
    <div className="flex justify-end">
      <Button asChild size="lg" className="w-full sm:w-auto">
        <Link href={href}>
          <ArrowRight className="mr-2 h-4 w-4" />
          Revisar resumo do orçamento
        </Link>
      </Button>
    </div>
  );
}
