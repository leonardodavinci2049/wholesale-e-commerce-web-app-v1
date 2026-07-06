"use client";

import { LayoutGrid, List, Search, X } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBudgetProductSearch } from "@/hooks/use-budget-product-search";

const BUDGET_ROUTE = "/dashboard";
const STORAGE_KEY = "budget:product-view-mode";
const SEARCH_PANEL_CONTAINER_ID = "budget-search-panel-container";
type ViewMode = "grid" | "list";

export function HeaderBudgetControls() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mode, setMode] = useState<ViewMode>("grid");
  const [hydrated, setHydrated] = useState(false);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const currentSearchValue = searchParams.get("search") ?? "";
  const {
    value,
    isPending,
    handleChange,
    handleCompositionStart,
    handleCompositionEnd,
    commitSearch,
    clearSearch,
  } = useBudgetProductSearch({ initialValue: currentSearchValue });

  useEffect(() => {
    setPortalTarget(document.getElementById(SEARCH_PANEL_CONTAINER_ID));
  }, []);

  // Hydrate mode from localStorage
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

  // Listen to external view mode changes
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

  // Function to toggle mode
  const toggleMode = () => {
    const newMode = mode === "grid" ? "list" : "grid";
    setMode(newMode);
    try {
      window.localStorage.setItem(STORAGE_KEY, newMode);
    } catch {
      // ignore
    }
    // Dispatch event to sync other switcher components
    window.dispatchEvent(
      new CustomEvent("budget-view-mode-change", { detail: newMode }),
    );
  };

  // Close search on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Check if we are on the budget route
  if (pathname !== BUDGET_ROUTE) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 sm:hidden">
      {/* Search Button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-full hover:bg-muted/60"
        onClick={() => setIsSearchOpen(!isSearchOpen)}
        aria-label={isSearchOpen ? "Fechar busca" : "Abrir busca"}
      >
        {isSearchOpen ? (
          <X className="h-5 w-5 text-foreground animate-in fade-in zoom-in duration-200" />
        ) : (
          <Search className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
        )}
      </Button>

      {/* View Switcher Button */}
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

      {/* Search Panel via portal */}
      {isSearchOpen &&
        portalTarget &&
        createPortal(
          <div className="w-full border-b bg-background px-4 py-3 animate-in slide-in-from-top-2 duration-200">
            <div className="relative mx-auto max-w-350">
              <Search className="pointer-events-none absolute inset-y-0 left-3 my-auto h-4 w-4 text-muted-foreground" />
              <Input
                id="header-product-search-v2"
                type="search"
                placeholder="Digite o termo de pesquisa..."
                value={value}
                onChange={(e) => handleChange(e.target.value)}
                onCompositionStart={handleCompositionStart}
                onCompositionEnd={(e) =>
                  handleCompositionEnd(e.currentTarget.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    commitSearch(e.currentTarget.value);
                    e.currentTarget.blur();
                  }
                }}
                aria-label="Buscar produto"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect="off"
                enterKeyHint="search"
                spellCheck={false}
                className={isPending ? "pl-10 opacity-60 pr-10" : "pl-10 pr-10"}
                autoFocus
              />
              {value && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-3 my-auto text-muted-foreground hover:text-foreground"
                  aria-label="Limpar busca"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>,
          portalTarget,
        )}
    </div>
  );
}
