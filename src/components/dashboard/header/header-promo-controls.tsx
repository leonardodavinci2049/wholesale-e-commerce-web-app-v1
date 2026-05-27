"use client";

import { LayoutGrid, List, Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PROMO_ROUTE = "/dashboard/product/products-on-sale";
const STORAGE_KEY = "promo:product-view-mode";
const SEARCH_PANEL_CONTAINER_ID = "promo-search-panel-container";
type ViewMode = "grid" | "list";

export function HeaderPromoControls() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mode, setMode] = useState<ViewMode>("grid");
  const [hydrated, setHydrated] = useState(false);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setPortalTarget(document.getElementById(SEARCH_PANEL_CONTAINER_ID));
  }, []);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "list" || stored === "grid") {
        setMode(stored);
      }
    } catch {
      // ignore
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

  const toggleMode = () => {
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
  };

  const currentSearchValue = searchParams.get("search") ?? "";

  const buildSearchParams = useCallback(
    (searchValue: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const trimmed = searchValue.trim();

      if (trimmed) {
        params.set("search", trimmed);
      } else {
        params.delete("search");
      }

      params.delete("limit");

      return params;
    },
    [searchParams],
  );

  const handleSearch = useCallback(
    (value: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        const params = buildSearchParams(value);
        startTransition(() => {
          router.push(`${PROMO_ROUTE}?${params.toString()}`, {
            scroll: false,
          });
        });
      }, 400);
    },
    [buildSearchParams, router],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (pathname !== PROMO_ROUTE) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 sm:hidden">
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

      {isSearchOpen &&
        portalTarget &&
        createPortal(
          <div className="w-full border-b bg-background px-4 py-3 animate-in slide-in-from-top-2 duration-200">
            <div className="relative mx-auto max-w-350">
              <Search className="pointer-events-none absolute inset-y-0 left-3 my-auto h-4 w-4 text-muted-foreground" />
              <Input
                id="header-promo-product-search"
                placeholder="Buscar produto em promoção..."
                key={currentSearchValue}
                defaultValue={currentSearchValue}
                onChange={(e) => handleSearch(e.target.value)}
                aria-label="Buscar produto em promoção"
                className={isPending ? "pl-10 opacity-60 pr-10" : "pl-10 pr-10"}
                autoFocus
              />
              {currentSearchValue && (
                <button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById(
                      "header-promo-product-search",
                    ) as HTMLInputElement;
                    if (input) {
                      input.value = "";
                      handleSearch("");
                    }
                  }}
                  className="absolute inset-y-0 right-3 my-auto text-muted-foreground hover:text-foreground"
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
