"use client";

import { LayoutGrid, List } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

import { ProductSearchBar } from "./product-search-bar";

const STORAGE_KEY = "promo:product-view-mode";

type ViewMode = "grid" | "list";

interface ProductViewSwitcherProps {
  grid: ReactNode;
  list: ReactNode;
  searchDefaultValue: string;
}

export function ProductViewSwitcher({
  grid,
  list,
  searchDefaultValue,
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
      // ignore storage access errors
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    const handleModeChange = (e: Event) => {
      const customEvent = e as CustomEvent<ViewMode>;
      if (customEvent.detail === "grid" || customEvent.detail === "list") {
        setMode(customEvent.detail);
      }
    };
    window.addEventListener("promo-view-mode-change", handleModeChange);
    return () => {
      window.removeEventListener("promo-view-mode-change", handleModeChange);
    };
  }, []);

  function toggleMode() {
    const newMode = mode === "grid" ? "list" : "grid";
    setMode(newMode);
    try {
      window.localStorage.setItem(STORAGE_KEY, newMode);
    } catch {
      // ignore
    }
    window.dispatchEvent(
      new CustomEvent("promo-view-mode-change", { detail: newMode }),
    );
  }

  const toggleButton = hydrated ? (
    <Button
      variant="outline"
      size="icon"
      className="h-10 w-10 shrink-0 rounded-xl"
      onClick={toggleMode}
      aria-label={
        mode === "grid"
          ? "Mudar para visualização em lista"
          : "Mudar para visualização em grade"
      }
    >
      {mode === "grid" ? (
        <List className="h-4 w-4" />
      ) : (
        <LayoutGrid className="h-4 w-4" />
      )}
    </Button>
  ) : (
    <div className="h-10 w-10 shrink-0" />
  );

  return (
    <div className="flex flex-col gap-4">
      <section className="hidden sm:block rounded-2xl border border-border/50 bg-card/90 p-3 shadow-sm sm:p-4">
        <ProductSearchBar
          defaultValue={searchDefaultValue}
          viewToggleButton={toggleButton}
        />
      </section>

      {hydrated && mode === "list" ? list : grid}
    </div>
  );
}
