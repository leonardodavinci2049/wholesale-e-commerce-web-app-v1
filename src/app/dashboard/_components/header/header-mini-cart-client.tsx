"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { type ReactNode, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface HeaderMiniCartClientProps {
  itemCount: number;
  href: string;
  cartContent: ReactNode;
}

const BADGE_CLASS =
  "absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold leading-none text-white";

function CartIconWithBadge({ itemCount }: { itemCount: number }) {
  const display = itemCount > 99 ? "99+" : String(itemCount);
  return (
    <span className="relative inline-flex">
      <ShoppingCart className="h-6 w-6 text-green-700 dark:text-green-500" />
      {itemCount > 0 && <span className={BADGE_CLASS}>{display}</span>}
    </span>
  );
}

export function HeaderMiniCartClient({
  itemCount,
  href,
  cartContent,
}: HeaderMiniCartClientProps) {
  const [open, setOpen] = useState(false);
  const ariaLabel =
    itemCount > 0
      ? `Carrinho com ${itemCount} ${itemCount === 1 ? "item" : "itens"}`
      : "Carrinho vazio";

  return (
    <>
      {/* Desktop: link para a rota de orçamento */}
      <Button
        asChild
        variant="ghost"
        size="icon"
        className="relative hidden xl:inline-flex"
        aria-label={ariaLabel}
      >
        <Link href={href}>
          <CartIconWithBadge itemCount={itemCount} />
        </Link>
      </Button>

      {/* Mobile/tablet: abre sheet com o conteúdo do carrinho */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="relative inline-flex xl:hidden"
        aria-label={ariaLabel}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <CartIconWithBadge itemCount={itemCount} />
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className={cn("flex w-full max-w-lg flex-col gap-0 p-0 sm:max-w-lg")}
        >
          <SheetHeader className="border-b border-border/60 p-4">
            <SheetTitle className="text-base">Carrinho</SheetTitle>
            <SheetDescription className="sr-only">
              Resumo dos itens do orçamento atual
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto p-4">{cartContent}</div>
        </SheetContent>
      </Sheet>
    </>
  );
}
