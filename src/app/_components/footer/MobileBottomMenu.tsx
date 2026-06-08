"use client";

import {
  Grid3x3,
  Home as HomeIcon,
  Menu as MenuIcon,
  MessageCircle,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CategoryMenuAccordion } from "@/components/category-menu/CategoryMenuAccordion";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { publicEnvs } from "@/core/config/envs.client";
import { useCart } from "@/hooks/useCart";
import type { UICategory } from "@/lib/transformers";

interface MobileBottomMenuProps {
  categories: UICategory[];
}

export function MobileBottomMenu({ categories }: MobileBottomMenuProps) {
  const { uniqueItems, openCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleWhatsAppClick = () => {
    const message =
      "Olá! Estou no APP do Mundial Megastore. Gostaria de mais informações.";
    // Remove caracteres especiais do número de WhatsApp: (XX) XXXXX XXXX -> XXXXXXXXXX
    const whatsappNumber = publicEnvs.NEXT_PUBLIC_COMPANY_WHATSAPP.replace(
      /\D/g,
      "",
    );
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      message,
    )}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  const handleNavigate = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80 md:hidden">
      <div className="mx-auto flex max-w-xl items-center justify-between px-4 py-2 text-xs text-muted-foreground">
        {/* Menu Hambúrguer - Isolado no lado esquerdo */}
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              aria-label="Abrir menu de categorias"
              className="relative flex flex-1 flex-col items-center justify-center gap-1 px-1 py-1.5 text-[11px] leading-tight"
            >
              <div className="relative flex items-center justify-center">
                <MenuIcon className="h-5 w-5" />
              </div>
              <span>Menu</span>
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
            <SheetHeader className="px-6 py-4 border-b">
              <SheetTitle>Todas as Categorias</SheetTitle>
              <SheetDescription className="sr-only">
                Navegue pelas categorias de produtos
              </SheetDescription>
            </SheetHeader>
            <div className="px-4 py-4 overflow-y-auto max-h-[calc(100vh-80px)]">
              <CategoryMenuAccordion
                categories={categories}
                onNavigate={handleNavigate}
              />
            </div>
          </SheetContent>
        </Sheet>

        {/* Home */}
        <Link
          href="/"
          className="relative flex flex-1 flex-col items-center justify-center gap-1 px-1 py-1.5 text-[11px] leading-tight hover:text-foreground transition-colors"
          aria-label="Ir para home"
        >
          <div className="relative flex items-center justify-center">
            <HomeIcon className="h-5 w-5" />
          </div>
          <span>Home</span>
        </Link>

        {/* Catalogo */}
        <Link
          href="/products"
          className="relative flex flex-1 flex-col items-center justify-center gap-1 px-1 py-1.5 text-[11px] leading-tight hover:text-foreground transition-colors"
          aria-label="Ir para catálogo de produtos"
        >
          <div className="relative flex items-center justify-center">
            <Grid3x3 className="h-5 w-5" />
          </div>
          <span>Catalogo</span>
        </Link>

        {/* Fale Conosco */}
        <button
          type="button"
          onClick={handleWhatsAppClick}
          className="relative flex flex-1 flex-col items-center justify-center gap-1 px-1 py-1.5 text-[11px] leading-tight hover:text-foreground transition-colors"
          aria-label="Fale conosco no WhatsApp"
        >
          <div className="relative flex items-center justify-center">
            <MessageCircle className="h-5 w-5" />
          </div>
          <span>Fale Conosco</span>
        </button>

        {/* Carrinho */}
        <button
          type="button"
          onClick={openCart}
          className="relative flex flex-1 flex-col items-center justify-center gap-1 px-1 py-1.5 text-[11px] leading-tight"
          aria-label="Abrir carrinho de compras"
        >
          <div className="relative flex items-center justify-center">
            <ShoppingCart className="h-5 w-5" />
            {uniqueItems > 0 && (
              <span className="absolute -right-2 -top-2 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
                {uniqueItems > 99 ? "99+" : uniqueItems}
              </span>
            )}
          </div>
          <span>Carrinho</span>
        </button>
      </div>
    </nav>
  );
}
