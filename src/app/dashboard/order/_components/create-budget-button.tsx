"use client";

import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { createBudgetAction } from "../../_actions/create-budget-action";

const ROUTE = "/dashboard";

interface CreateBudgetButtonProps {
  className?: string;
  size?: "default" | "sm" | "lg";
  variant?: "default" | "outline" | "secondary";
}

export function CreateBudgetButton({
  className,
  size = "default",
  variant = "default",
}: CreateBudgetButtonProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    createBudgetAction,
    null,
  );
  const prevStateRef = useRef(state);

  useEffect(() => {
    if (state === prevStateRef.current) return;
    prevStateRef.current = state;

    if (state?.success) {
      const orderId = Number(state.data?.orderId);
      toast.success(state.message);

      if (orderId) {
        const params = new URLSearchParams({ orderId: String(orderId) });
        router.replace(`${ROUTE}?${params.toString()}`);
      } else {
        router.replace(ROUTE);
      }
    } else if (state?.success === false) {
      toast.error(state.message);
    }
  }, [state, router]);

  return (
    <form action={formAction}>
      <Button
        type="submit"
        variant={variant}
        size={size}
        className={cn(className)}
        disabled={isPending}
        aria-label="Criar novo orçamento"
      >
        {isPending ? <Loader2 className="animate-spin" /> : <Plus />}
        Criar novo orçamento
      </Button>
    </form>
  );
}
