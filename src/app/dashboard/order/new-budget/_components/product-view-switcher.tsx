"use client";

import { LayoutGrid, List } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const STORAGE_KEY = "new-budget:product-view-mode";

type ViewMode = "grid" | "list";

interface ProductViewSwitcherProps {
  grid: ReactNode;
  list: ReactNode;
  totalLabel?: string;
}

export function ProductViewSwitcher({
  grid,
  list,
  totalLabel,
}: ProductViewSwitcherProps) {
  const [mode, setMode] = useState<ViewMode>("grid");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "list" || stored === "grid") {
        setMode(stored);
      }
    } catch {
      // ignore storage access errors (private mode, etc.)
    }
    setHydrated(true);
  }, []);

  function handleChange(value: string) {
    if (value !== "grid" && value !== "list") return;
    setMode(value);
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // ignore
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        {totalLabel ? (
          <p className="text-xs text-muted-foreground">{totalLabel}</p>
        ) : (
          <span aria-hidden="true" />
        )}

        <ToggleGroup
          type="single"
          variant="outline"
          size="sm"
          value={mode}
          onValueChange={handleChange}
          aria-label="Modo de visualização da lista de produtos"
        >
          <ToggleGroupItem value="grid" aria-label="Visualização em grade">
            <LayoutGrid className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="Visualização em lista">
            <List className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {hydrated && mode === "list" ? list : grid}
    </div>
  );
}
