"use client";

import { Loader2, Search, X } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProductSearch } from "@/hooks/use-product-search";

interface ProductSearchBarProps {
  defaultValue: string;
  placeholder?: string;
  ariaLabel?: string;
  viewToggleButton?: ReactNode;
}

export function ProductSearchBar({
  defaultValue,
  placeholder = "Buscar produto...",
  ariaLabel = "Buscar produto",
  viewToggleButton,
}: ProductSearchBarProps) {
  const {
    value,
    isPending,
    handleChange,
    handleCompositionStart,
    handleCompositionEnd,
    commitSearch,
    clearSearch,
  } = useProductSearch({ initialValue: defaultValue });

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute inset-y-0 left-3 my-auto h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          inputMode="search"
          placeholder={placeholder}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={(e) => handleCompositionEnd(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commitSearch(e.currentTarget.value);
              e.currentTarget.blur();
            }
          }}
          aria-label={ariaLabel}
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
          enterKeyHint="search"
          spellCheck={false}
          className="h-11 pl-10 pr-10 text-base md:h-10 md:text-sm"
        />
        {isPending ? (
          <Loader2
            className="pointer-events-none absolute inset-y-0 right-3 my-auto h-4 w-4 animate-spin text-muted-foreground"
            aria-hidden="true"
          />
        ) : value ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={clearSearch}
            aria-label="Limpar busca"
            className="absolute inset-y-0 right-1 my-auto"
          >
            <X className="h-4 w-4" />
          </Button>
        ) : null}
      </div>
      {viewToggleButton}
    </div>
  );
}
