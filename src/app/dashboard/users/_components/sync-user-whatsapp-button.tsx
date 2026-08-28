"use client";

import { Loader2, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { syncUserWhatsAppAction } from "../_actions/whatsapp-actions";

type SyncUserWhatsAppButtonProps = {
  userId: string;
  userName: string;
  personId: number | null;
};

export function SyncUserWhatsAppButton({
  userId,
  userName,
  personId,
}: SyncUserWhatsAppButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const hasCustomer = personId != null && personId > 0;

  function handleSync() {
    startTransition(async () => {
      try {
        const result = await syncUserWhatsAppAction({ userId });

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        toast.success(result.message);
        router.refresh();
      } catch {
        toast.error("Falha ao consultar o telefone do cliente");
      }
    });
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="h-7 gap-1.5 px-2 text-xs"
      disabled={!hasCustomer || isPending}
      onClick={handleSync}
      title={
        hasCustomer
          ? `Consultar telefone de ${userName} no cadastro do cliente`
          : "Usuário sem ID de cliente"
      }
      aria-label={`Consultar telefone de ${userName} no cadastro do cliente`}
    >
      {isPending ? (
        <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
      ) : (
        <RefreshCw className="size-3.5" aria-hidden="true" />
      )}
      {isPending ? "Consultando..." : "Buscar telefone"}
    </Button>
  );
}
