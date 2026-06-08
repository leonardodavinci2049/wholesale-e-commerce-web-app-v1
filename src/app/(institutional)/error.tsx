"use client";

import { useEffect } from "react";

export default function CompanyError({ error }: { error: Error }) {
  useEffect(() => {
    console.error("Company route error:", error);
  }, [error]);

  return (
    <div className="container py-12">
      <h2 className="text-2xl font-semibold">Ocorreu um erro</h2>
      <p className="text-muted-foreground mt-2">
        Não foi possível carregar esta página. Tente novamente mais tarde.
      </p>
      <details className="text-muted-foreground mt-4 text-sm">
        <summary className="cursor-pointer">Detalhes do erro</summary>
        <pre className="whitespace-pre-wrap">{error.message}</pre>
      </details>
    </div>
  );
}
