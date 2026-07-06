"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";

const SEARCH_DEBOUNCE_MS = 800;

interface UseProductSearchOptions {
  initialValue: string;
}

export function useProductSearch({ initialValue }: UseProductSearchOptions) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(initialValue);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isComposingRef = useRef(false);
  const searchParamsRef = useRef(searchParams);
  const pathnameRef = useRef(pathname);

  useEffect(() => {
    searchParamsRef.current = searchParams;
  }, [searchParams]);

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

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
    const route = pathnameRef.current;
    return queryString ? `${route}?${queryString}` : route;
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
