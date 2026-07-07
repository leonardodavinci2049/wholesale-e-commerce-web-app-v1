"use client";

import { LayoutGrid, List } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const BUDGET_ROUTE = "/dashboard";
const STORAGE_KEY = "budget:product-view-mode";
type ViewMode = "grid" | "list";

export function HeaderBudgetControls() {
  const pathname = usePathname();

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

  useEffect(() => {
    const handleModeChange = (e: Event) => {
      const customEvent = e as CustomEvent<ViewMode>;
      if (customEvent.detail === "grid" || customEvent.detail === "list") {
        setMode(customEvent.detail);
      }
    };
    window.addEventListener("budget-view-mode-change", handleModeChange);
    return () => {
      window.removeEventListener("budget-view-mode-change", handleModeChange);
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
      new CustomEvent("budget-view-mode-change", { detail: newMode }),
    );
  }

  if (pathname !== BUDGET_ROUTE) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 sm:hidden">
      {hydrated ? (
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full hover:bg-muted/60"
          onClick={toggleMode}
          aria-label={
            mode === "grid"
              ? "Mudar para visualização em lista"
              : "Mudar para visualização em grade"
          }
        >
          {mode === "grid" ? (
            <List className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
          ) : (
            <LayoutGrid className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
          )}
        </Button>
      ) : (
        <div className="h-9 w-9" />
      )}
    </div>
  );
}
