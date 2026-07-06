"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function DashboardSearchContent() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSearch() {
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/dashboard?search=${encodeURIComponent(trimmed)}`);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleSearch();
  }

  return (
    <div className="flex flex-col gap-4 py-2">
      <p className="text-sm text-muted-foreground">
        Busque produtos para iniciar um orçamento.
      </p>
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Digite o termo de busca..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1"
          autoFocus
        />
        <Button type="button" onClick={handleSearch} disabled={!query.trim()}>
          Buscar
        </Button>
      </div>
    </div>
  );
}
