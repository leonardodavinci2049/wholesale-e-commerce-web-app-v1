"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createLogger } from "@/core/logger";

const logger = createLogger("ProductListErrorBoundary");

interface ProductListErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ProductListError({
  error,
  reset,
}: ProductListErrorProps) {
  useEffect(() => {
    logger.warn("Falha tratada ao renderizar lista de produtos", {
      message: error.message,
      digest: error.digest,
      name: error.name,
    });
  }, [error]);

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main mx-auto flex w-full max-w-350 flex-1 flex-col gap-6 px-4 py-6 lg:px-6">
        <Card className="rounded-3xl border-border/60 shadow-sm">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-7 w-7 text-destructive" />
            </div>
            <CardTitle>Não foi possível carregar os produtos</CardTitle>
            <CardDescription>
              Ocorreu uma falha ao consultar os dados desta página. A conexão
              com a API pode estar temporariamente indisponível.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <p className="text-center text-sm text-muted-foreground">
              Tente novamente em alguns instantes. Se o problema continuar,
              verifique a disponibilidade da API RESTCLEA.
            </p>
          </CardContent>

          <CardFooter className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              className="w-full gap-2 sm:w-auto"
              onClick={reset}
            >
              <RefreshCw className="h-4 w-4" />
              Tentar novamente
            </Button>

            <Button asChild className="w-full sm:w-auto">
              <Link href="/dashboard">Voltar ao dashboard</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
