"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

interface ViewBudgetButtonProps {
  orderId?: number;
  disabled?: boolean;
}

export function ViewBudgetButton({ orderId, disabled }: ViewBudgetButtonProps) {
  const isDisabled = disabled || !orderId;
  const href = orderId ? `/dashboard/sales-dashboard?orderId=${orderId}` : "#";

  if (isDisabled) {
    return (
      <Button disabled className="h-11 w-full rounded-xl">
        Ver o orçamento
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button asChild className="h-11 w-full rounded-xl">
      <Link href={href}>
        Ver o orçamento
        <ArrowRight className="ml-2 h-4 w-4" />
      </Link>
    </Button>
  );
}
