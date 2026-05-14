"use client";

import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function UserSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [inputValue, setInputValue] = useState(
    searchParams.get("search") || "",
  );

  const handleSearch = () => {
    if (!inputValue.trim()) {
      handleClear();
      return;
    }

    if (inputValue.trim().length < 3) {
      toast.warning("A pesquisa deve ter pelo menos 3 caracteres.");
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("search", inputValue.trim());
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleClear = () => {
    setInputValue("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex justify-start w-full">
      <Card className="w-full md:w-1/4 min-w-[300px] shadow-sm">
        <CardContent className="p-2">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <div className="absolute left-3 inset-y-0 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input
                type="text"
                placeholder="Buscar usuário..."
                className="pl-9 pr-10 h-10 border-none bg-muted/50 focus-visible:ring-1 focus-visible:ring-primary/50"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              {inputValue && (
                <div className="absolute right-2 inset-y-0 flex items-center">
                  <button
                    type="button"
                    onClick={handleClear}
                    className="flex items-center justify-center text-muted-foreground hover:text-foreground p-1 transition-colors rounded-full hover:bg-muted"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
            <Button
              size="sm"
              onClick={handleSearch}
              className="h-10 px-4 font-medium transition-all active:scale-95"
            >
              Buscar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
