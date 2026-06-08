"use client";

import { FolderOpen, Layers, LayoutGrid, Tag } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { UICategory, UISubcategory } from "@/lib/transformers";
import { cn } from "@/lib/utils";

interface CategoryMenuAccordionProps {
  categories: UICategory[];
  onNavigate?: () => void;
}

interface ExpandedState {
  level1: string | undefined;
  level2: string | undefined;
}

/**
 * Derives the expanded accordion state from the current URL pathname.
 * Searches through the category hierarchy to find which categories
 * should be expanded based on the active URL.
 */
export function getExpandedCategoriesFromPath(
  pathname: string,
  categories: UICategory[],
): ExpandedState {
  // Extract the last segment of the URL (the active category slug)
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length < 2 || segments[0] !== "category") {
    return { level1: undefined, level2: undefined };
  }

  const activeSlug = segments[segments.length - 1];

  // Search through the hierarchy to find the active category
  for (const category of categories) {
    // Check if Level 1 is active
    if (category.slug === activeSlug) {
      return { level1: category.id, level2: undefined };
    }

    // Check Level 2 (subcategories)
    if (category.subcategories) {
      for (const subcategory of category.subcategories) {
        if (subcategory.slug === activeSlug) {
          return { level1: category.id, level2: subcategory.id };
        }

        // Check Level 3 (children of subcategories)
        if (subcategory.children) {
          for (const child of subcategory.children) {
            if (child.slug === activeSlug) {
              return { level1: category.id, level2: subcategory.id };
            }
          }
        }
      }
    }
  }

  return { level1: undefined, level2: undefined };
}

/**
 * Checks if a category is an ancestor of the currently active category.
 */
function isParentOfActive(
  categoryHref: string,
  pathname: string,
  isExactMatch: boolean,
): boolean {
  if (isExactMatch) return false;
  return pathname.startsWith(categoryHref) && pathname !== categoryHref;
}

export function CategoryMenuAccordion({
  categories,
  onNavigate,
}: CategoryMenuAccordionProps) {
  const pathname = usePathname();

  // Check if "Todos" (All Products) is active
  // Match /products with or without query parameters
  const isTodosActive =
    pathname === "/products" ||
    pathname.startsWith("/products/") ||
    pathname.startsWith("/products?");

  // Derive expanded state from URL
  const expandedFromUrl = useMemo(
    () => getExpandedCategoriesFromPath(pathname, categories),
    [pathname, categories],
  );

  // Local state for manual expansion (allows user to expand other items)
  const [manualExpanded, setManualExpanded] = useState<string | undefined>(
    undefined,
  );

  // Reset manual expanded state when navigating to /products
  useEffect(() => {
    if (isTodosActive) {
      setManualExpanded(undefined);
    }
  }, [isTodosActive]);

  // Use URL-derived state, but allow manual override
  // When "Todos" is active, force accordion to be closed
  const effectiveLevel1 = isTodosActive
    ? undefined
    : (manualExpanded ?? expandedFromUrl.level1);

  const handleLevel1Change = useCallback((value: string | undefined) => {
    setManualExpanded(value);
  }, []);

  // Helper to check if a specific item is exactly selected
  const isSelected = useCallback(
    (href: string) => pathname === href,
    [pathname],
  );

  // Helper to check if category is parent of active
  const isParent = useCallback(
    (href: string) => {
      const selected = isSelected(href);
      return isParentOfActive(href, pathname, selected);
    },
    [pathname, isSelected],
  );

  // Handle "Todos" click - close accordion and navigate
  const handleTodosClick = useCallback(() => {
    setManualExpanded(undefined);
    onNavigate?.();
  }, [onNavigate]);

  return (
    <div className="rounded-lg overflow-hidden bg-card shadow-sm">
      {/* "Todos" (All Products) option - always first */}
      <Link
        href="/products"
        onClick={handleTodosClick}
        className={cn(
          "flex items-center gap-3 py-3 px-4 text-sm transition-colors border-b",
          isTodosActive
            ? "bg-primary/10 border-l-4 border-l-primary pl-3 text-primary font-bold"
            : "text-foreground font-medium hover:bg-muted/50",
        )}
      >
        <LayoutGrid
          className={cn(
            "h-5 w-5 shrink-0",
            isTodosActive ? "text-primary" : "text-muted-foreground",
          )}
        />
        Todos
      </Link>

      <Accordion
        type="single"
        collapsible
        value={effectiveLevel1}
        onValueChange={handleLevel1Change}
        className="w-full divide-y"
      >
        {categories.map((category) => {
          const selected = isSelected(category.href);
          const parentOfActive = isParent(category.href);

          return (
            <AccordionItem
              key={category.id}
              value={category.id}
              className="border-b-0 px-0"
            >
              <div
                className={cn(
                  "flex items-center justify-between py-3 px-4 transition-colors",
                  selected && "bg-primary/10 border-l-4 border-l-primary pl-3",
                  parentOfActive &&
                    !selected &&
                    "bg-muted/40 border-l-2 border-l-primary/50 pl-3.5",
                  !selected && !parentOfActive && "hover:bg-muted/50",
                )}
              >
                <Link
                  href={category.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex-1 flex items-center gap-3 text-sm transition-colors",
                    selected && "text-primary font-bold",
                    parentOfActive &&
                      !selected &&
                      "text-foreground font-medium",
                    !selected &&
                      !parentOfActive &&
                      "text-foreground font-medium",
                  )}
                >
                  <Layers
                    className={cn(
                      "h-5 w-5 shrink-0",
                      selected && "text-primary",
                      parentOfActive && !selected && "text-primary/70",
                      !selected && !parentOfActive && "text-muted-foreground",
                    )}
                  />
                  {category.name}
                </Link>
                {category.subcategories &&
                  category.subcategories.length > 0 && (
                    <AccordionTrigger className="py-0 flex-none w-8 h-8 flex items-center justify-center hover:no-underline text-muted-foreground" />
                  )}
              </div>

              {category.subcategories && category.subcategories.length > 0 && (
                <AccordionContent className="pb-0 pt-0 border-t">
                  <div className="pl-6 py-1">
                    <div className="border-l-2 border-foreground/20 pl-1">
                      <Level2Categories
                        subcategories={category.subcategories}
                        pathname={pathname}
                        expandedFromUrl={expandedFromUrl.level2}
                        onNavigate={onNavigate}
                      />
                    </div>
                  </div>
                </AccordionContent>
              )}
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}

function Level2Categories({
  subcategories,
  pathname,
  expandedFromUrl,
  onNavigate,
}: {
  subcategories: UISubcategory[];
  pathname: string;
  expandedFromUrl: string | undefined;
  onNavigate?: () => void;
}) {
  // Local state for manual expansion at level 2
  const [manualExpanded, setManualExpanded] = useState<string | undefined>(
    undefined,
  );

  // Use URL-derived state, but allow manual override
  const effectiveLevel2 = manualExpanded ?? expandedFromUrl;

  const handleLevel2Change = useCallback((value: string | undefined) => {
    setManualExpanded(value);
  }, []);

  const isSelected = useCallback(
    (href: string) => pathname === href,
    [pathname],
  );

  const isParent = useCallback(
    (href: string) => {
      const selected = pathname === href;
      return !selected && pathname.startsWith(href) && pathname !== href;
    },
    [pathname],
  );

  return (
    <Accordion
      type="single"
      collapsible
      value={effectiveLevel2}
      onValueChange={handleLevel2Change}
      className="w-full"
    >
      {subcategories.map((subcategory) => {
        const selected = isSelected(subcategory.href);
        const parentOfActive = isParent(subcategory.href);

        return (
          <AccordionItem
            key={subcategory.id}
            value={subcategory.id}
            className="border-b-0"
          >
            <div
              className={cn(
                "flex items-center justify-between py-2 pl-4 pr-4 transition-colors rounded-r-md mr-1",
                selected && "bg-primary/10 border-l-4 border-l-primary pl-3",
                parentOfActive &&
                  !selected &&
                  "bg-muted/30 border-l-2 border-l-primary/40 pl-3.5",
                !selected && !parentOfActive && "hover:bg-muted/50",
              )}
            >
              <Link
                href={subcategory.href}
                onClick={onNavigate}
                className={cn(
                  "flex-1 flex items-center gap-2 text-sm transition-colors",
                  selected && "text-primary font-semibold",
                  parentOfActive && !selected && "text-foreground font-medium",
                  !selected && !parentOfActive && "text-foreground/80",
                )}
              >
                <FolderOpen
                  className={cn(
                    "h-4 w-4 shrink-0",
                    selected && "text-primary",
                    parentOfActive && !selected && "text-primary/70",
                    !selected && !parentOfActive && "text-muted-foreground",
                  )}
                />
                {subcategory.name}
              </Link>
              {subcategory.children && subcategory.children.length > 0 && (
                <AccordionTrigger className="py-0 flex-none w-6 h-6 flex items-center justify-center hover:no-underline text-muted-foreground" />
              )}
            </div>

            {subcategory.children && subcategory.children.length > 0 && (
              <AccordionContent className="pb-2 pt-0 pl-6">
                <div className="border-l-2 border-foreground/20 pl-1">
                  <Level3Categories
                    subcategories={subcategory.children}
                    pathname={pathname}
                    onNavigate={onNavigate}
                  />
                </div>
              </AccordionContent>
            )}
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

function Level3Categories({
  subcategories,
  pathname,
  onNavigate,
}: {
  subcategories: UISubcategory[];
  pathname: string;
  onNavigate?: () => void;
}) {
  const isSelected = useCallback(
    (href: string) => pathname === href,
    [pathname],
  );

  return (
    <div className="flex flex-col">
      {subcategories.map((subcategory) => {
        const selected = isSelected(subcategory.href);
        return (
          <Link
            key={subcategory.id}
            href={subcategory.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2 text-sm py-2 pl-4 pr-4 transition-colors border-l-2 rounded-r-md mr-1",
              selected
                ? "text-primary font-semibold bg-primary/10 border-l-primary"
                : "text-foreground/70 border-transparent hover:bg-muted/50",
            )}
          >
            <Tag
              className={cn(
                "h-3.5 w-3.5 shrink-0",
                selected ? "text-primary" : "text-muted-foreground",
              )}
            />
            {subcategory.name}
          </Link>
        );
      })}
    </div>
  );
}
