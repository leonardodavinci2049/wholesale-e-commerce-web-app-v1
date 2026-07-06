"use client";

import { ChevronLeft, ChevronRight, Folder, RotateCcw } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SheetClose } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { UITaxonomyMenuItem } from "@/services/api-main/taxonomy-base/transformers/transformers";

const ROUTE = "/dashboard";
const MAX_LEVELS = 3;

interface BudgetCategoryFilterPanelProps {
  categories: UITaxonomyMenuItem[];
  selectedTaxonomyId?: number;
}

interface NavigationNode {
  id: number;
  name: string;
}

export function BudgetCategoryFilterPanel({
  categories,
  selectedTaxonomyId,
}: BudgetCategoryFilterPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const byId = useMemo(() => {
    const map = new Map<number, UITaxonomyMenuItem>();
    for (const item of categories) {
      map.set(item.id, item);
    }
    return map;
  }, [categories]);

  const childrenByParent = useMemo(() => {
    const map = new Map<number, UITaxonomyMenuItem[]>();
    for (const item of categories) {
      const list = map.get(item.parentId) ?? [];
      list.push(item);
      map.set(item.parentId, list);
    }
    for (const list of map.values()) {
      list.sort((a, b) => {
        if (a.order !== b.order) return a.order - b.order;
        return a.name.localeCompare(b.name, "pt-BR");
      });
    }
    return map;
  }, [categories]);

  // Build the path from root to the selected taxonomy's parent, so the
  // sibling list (containing the selected item) is shown when reopening.
  const initialPath = useMemo<NavigationNode[]>(() => {
    if (!selectedTaxonomyId) return [];
    const selected = byId.get(selectedTaxonomyId);
    if (!selected) return [];
    const ancestors: NavigationNode[] = [];
    let cursorId = selected.parentId;
    while (cursorId && cursorId !== 0) {
      const node = byId.get(cursorId);
      if (!node) break;
      ancestors.unshift({ id: node.id, name: node.name });
      cursorId = node.parentId;
    }
    return ancestors.slice(0, MAX_LEVELS - 1);
  }, [byId, selectedTaxonomyId]);

  const [path, setPath] = useState<NavigationNode[]>(initialPath);

  const currentParentId = path.length === 0 ? 0 : path[path.length - 1].id;
  const currentLevel = path.length + 1;
  const currentItems = childrenByParent.get(currentParentId) ?? [];
  const canDrillDown = currentLevel < MAX_LEVELS;

  const buildHrefForTaxonomy = useCallback(
    (taxonomyId: number | undefined) => {
      const params = new URLSearchParams(searchParams.toString());
      if (taxonomyId !== undefined) {
        params.set("taxonomyId", String(taxonomyId));
      } else {
        params.delete("taxonomyId");
      }
      params.delete("limit");
      const qs = params.toString();
      return qs ? `${ROUTE}?${qs}` : ROUTE;
    },
    [searchParams],
  );

  const handleSelect = useCallback(
    (taxonomyId: number) => {
      startTransition(() => {
        router.push(buildHrefForTaxonomy(taxonomyId), { scroll: false });
      });
    },
    [buildHrefForTaxonomy, router],
  );

  const handleClear = useCallback(() => {
    startTransition(() => {
      router.push(buildHrefForTaxonomy(undefined), { scroll: false });
    });
  }, [buildHrefForTaxonomy, router]);

  const handleDrillDown = useCallback((node: UITaxonomyMenuItem) => {
    setPath((prev) => [...prev, { id: node.id, name: node.name }]);
  }, []);

  const handleBack = useCallback(() => {
    setPath((prev) => prev.slice(0, -1));
  }, []);

  const handleJumpTo = useCallback((index: number) => {
    setPath((prev) => prev.slice(0, index + 1));
  }, []);

  const handleResetToRoot = useCallback(() => {
    setPath([]);
  }, []);

  const currentNodeName =
    path.length > 0 ? path[path.length - 1].name : undefined;

  return (
    <div className="flex min-h-full flex-col gap-3">
      <div className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
        <button
          type="button"
          onClick={handleResetToRoot}
          className={cn(
            "rounded px-1.5 py-0.5 hover:bg-muted",
            path.length === 0 && "font-medium text-foreground",
          )}
        >
          Todas as categorias
        </button>
        {path.map((node, index) => (
          <span key={node.id} className="flex items-center gap-1">
            <ChevronRight className="size-3" aria-hidden="true" />
            <button
              type="button"
              onClick={() => handleJumpTo(index)}
              className={cn(
                "rounded px-1.5 py-0.5 hover:bg-muted",
                index === path.length - 1 && "font-medium text-foreground",
              )}
            >
              {node.name}
            </button>
          </span>
        ))}
      </div>

      {path.length > 0 && currentNodeName !== undefined && (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="h-8 gap-1 px-2"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
            Voltar
          </Button>
          <SheetClose asChild>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => handleSelect(currentParentId)}
              className="h-8 flex-1 justify-start"
              disabled={isPending}
            >
              Filtrar por “{currentNodeName}”
            </Button>
          </SheetClose>
        </div>
      )}

      <ScrollArea className="-mx-1 flex-1 px-1">
        {currentItems.length === 0 ? (
          <p className="px-1 py-4 text-sm text-muted-foreground">
            Nenhuma categoria disponível neste nível.
          </p>
        ) : (
          <ul className="flex flex-col gap-1">
            {currentItems.map((item) => {
              const children = childrenByParent.get(item.id) ?? [];
              const hasChildren = children.length > 0 && canDrillDown;
              const isSelected = item.id === selectedTaxonomyId;

              return (
                <li key={item.id}>
                  <div
                    className={cn(
                      "group flex items-stretch overflow-hidden rounded-lg border border-border/60 bg-background transition-colors",
                      isSelected && "border-primary bg-primary/5",
                    )}
                  >
                    <SheetClose asChild>
                      <button
                        type="button"
                        onClick={() => handleSelect(item.id)}
                        disabled={isPending}
                        className={cn(
                          "flex flex-1 items-center gap-2 px-3 py-2.5 text-left text-sm hover:bg-muted/60 disabled:opacity-60",
                          isSelected && "text-primary",
                        )}
                      >
                        <Folder
                          className="size-4 shrink-0 text-muted-foreground"
                          aria-hidden="true"
                        />
                        <span className="flex min-w-0 flex-1 items-baseline gap-1.5">
                          <span className="truncate">{item.name}</span>
                          {typeof item.productCount === "number" &&
                            item.productCount > 0 && (
                              <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                                ({item.productCount})
                              </span>
                            )}
                        </span>
                      </button>
                    </SheetClose>
                    {hasChildren && (
                      <button
                        type="button"
                        onClick={() => handleDrillDown(item)}
                        aria-label={`Abrir subcategorias de ${item.name}`}
                        className="flex items-center justify-center border-l border-border/60 px-3 text-muted-foreground hover:bg-muted/60"
                      >
                        <ChevronRight className="size-4" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </ScrollArea>

      <div className="sticky bottom-0 mt-auto border-t border-border/60 bg-background/95 pt-4 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm">
        <SheetClose asChild>
          <Button
            type="button"
            variant="outline"
            className="h-11 w-full rounded-xl"
            onClick={handleClear}
            disabled={isPending || selectedTaxonomyId === undefined}
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Limpar filtro
          </Button>
        </SheetClose>
      </div>
    </div>
  );
}
