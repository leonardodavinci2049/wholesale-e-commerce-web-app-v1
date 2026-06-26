import { PackageX } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

interface PurchasedProductNotFoundProps {
  movementId: number;
}

export function PurchasedProductNotFound({
  movementId,
}: PurchasedProductNotFoundProps) {
  return (
    <div className="mx-auto flex w-full max-w-350 flex-col">
      <div className="@container/main flex flex-col gap-6">
        <div className="flex flex-col gap-6 py-6">
          <div className="px-4 lg:px-6">
            <div className="flex min-h-80 flex-col items-center justify-center rounded-3xl border border-dashed border-border/70 bg-muted/20 px-6 py-10 text-center">
              <div className="mb-4 rounded-full border border-border/70 bg-background p-4 shadow-sm">
                <PackageX className="size-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold tracking-tight">
                Movimentação não encontrada
              </h3>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Não foi possível localizar os detalhes da movimentação de compra
                #{movementId}. Ela pode ter sido removida ou não estar mais
                disponível para consulta.
              </p>
              <Button asChild type="button" variant="outline" className="mt-6">
                <Link href="/dashboard/order/purchased-products">
                  Voltar à lista de produtos comprados
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
