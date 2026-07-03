"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";

const BUDGET_ROUTE = "/dashboard/order/budget";
const SEARCH_DEBOUNCE_MS = 800;

interface UseBudgetProductSearchOptions {
  initialValue: string;
}

export function useBudgetProductSearch({
  initialValue,
}: UseBudgetProductSearchOptions) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(initialValue);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isComposingRef = useRef(false);
  const searchParamsRef = useRef(searchParams);

  useEffect(() => {
    searchParamsRef.current = searchParams;
  }, [searchParams]);

  const clearScheduledSearch = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!debounceRef.current) {
      setValue(initialValue);
    }
  }, [initialValue]);

  useEffect(() => clearScheduledSearch, [clearScheduledSearch]);

  const buildHref = useCallback((searchValue: string) => {
    const params = new URLSearchParams(searchParamsRef.current.toString());
    const trimmed = searchValue.trim();

    if (trimmed) {
      params.set("search", trimmed);
    } else {
      params.delete("search");
    }

    params.delete("limit");

    const queryString = params.toString();
    return queryString ? `${BUDGET_ROUTE}?${queryString}` : BUDGET_ROUTE;
  }, []);

  const commitSearch = useCallback(
    (searchValue: string) => {
      clearScheduledSearch();
      const href = buildHref(searchValue);

      startTransition(() => {
        router.replace(href, { scroll: false });
      });
    },
    [buildHref, clearScheduledSearch, router],
  );

  const scheduleSearch = useCallback(
    (searchValue: string) => {
      clearScheduledSearch();
      debounceRef.current = setTimeout(() => {
        debounceRef.current = null;
        commitSearch(searchValue);
      }, SEARCH_DEBOUNCE_MS);
    },
    [clearScheduledSearch, commitSearch],
  );

  const handleChange = useCallback(
    (nextValue: string) => {
      setValue(nextValue);

      if (!isComposingRef.current) {
        scheduleSearch(nextValue);
      }
    },
    [scheduleSearch],
  );

  const handleCompositionStart = useCallback(() => {
    isComposingRef.current = true;
    clearScheduledSearch();
  }, [clearScheduledSearch]);

  const handleCompositionEnd = useCallback(
    (nextValue: string) => {
      isComposingRef.current = false;
      setValue(nextValue);
      scheduleSearch(nextValue);
    },
    [scheduleSearch],
  );

  const clearSearch = useCallback(() => {
    setValue("");
    commitSearch("");
  }, [commitSearch]);

  return {
    value,
    isPending,
    handleChange,
    handleCompositionStart,
    handleCompositionEnd,
    commitSearch,
    clearSearch,
  };
}
