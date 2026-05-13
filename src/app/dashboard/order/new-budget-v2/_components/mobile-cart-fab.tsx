"use client";

import { ShoppingCart, X } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface MobileCartFabProps {
  itemCount: number;
  children: React.ReactNode;
}

export function MobileCartFab({ itemCount, children }: MobileCartFabProps) {
  const [open, setOpen] = useState(false);
  const itemLabel = itemCount === 1 ? "item" : "itens";

  return (
    <>
      <div className="fixed bottom-4 right-4 z-40 xl:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`Abrir carrinho com ${itemCount} ${itemLabel}`}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
          style={{ marginBottom: "env(safe-area-inset-bottom)" }}
        >
          <ShoppingCart className="h-6 w-6" />
          {itemCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold"
            >
              {itemCount}
            </Badge>
          )}
        </button>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          className="inset-x-0 bottom-0 flex h-[min(90dvh,820px)] w-full flex-col gap-0 rounded-t-3xl border-x border-t border-border/60 bg-background p-0 shadow-2xl [&>button]:hidden"
        >
          <SheetHeader className="flex flex-row items-center justify-between gap-3 border-b border-border/60 px-4 py-3">
            <SheetTitle className="flex items-center gap-2 text-base">
              <ShoppingCart className="h-4 w-4" />
              Carrinho
              {itemCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {itemCount} {itemLabel}
                </Badge>
              )}
            </SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0 rounded-full"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Fechar</span>
            </Button>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-3">{children}</div>
        </SheetContent>
      </Sheet>
    </>
  );
}
