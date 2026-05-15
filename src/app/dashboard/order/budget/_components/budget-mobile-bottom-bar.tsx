import {
  Filter,
  Home,
  LayoutGrid,
  MessageCircle,
  ShoppingCart,
} from "lucide-react";
import type { ReactNode } from "react";

import {
  MobileBottomBar,
  MobileBottomBarExternalLink,
  MobileBottomBarLink,
  MobileBottomBarSheet,
} from "@/components/common/mobile-bottom-bar";
import { publicEnvs } from "@/core/config/envs.client";

interface BudgetMobileBottomBarProps {
  cartItemCount: number;
  cartContent: ReactNode;
}

const WHATSAPP_MESSAGE = "Olá Gostaria tirar dúvidas sobre produtos";

function buildWhatsappUrl(phone: string, message: string): string {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function BudgetMobileBottomBar({
  cartItemCount,
  cartContent,
}: BudgetMobileBottomBarProps) {
  const whatsappUrl = buildWhatsappUrl(
    publicEnvs.NEXT_PUBLIC_COMPANY_WHATSAPP,
    WHATSAPP_MESSAGE,
  );

  return (
    <MobileBottomBar aria-label="Menu de navegação do orçamento">
      <MobileBottomBarLink
        href="/dashboard"
        icon={<Home className="h-5 w-5" />}
        label="Home"
        exact
      />

      <MobileBottomBarSheet
        icon={<LayoutGrid className="h-5 w-5" />}
        label="Categorias"
        sheetTitle="Categorias"
      >
        {null}
      </MobileBottomBarSheet>

      <MobileBottomBarSheet
        icon={<Filter className="h-5 w-5" />}
        label="Filtro"
        sheetTitle="Filtros"
      >
        {null}
      </MobileBottomBarSheet>

      <MobileBottomBarExternalLink
        href={whatsappUrl}
        icon={<MessageCircle className="h-5 w-5" />}
        label="WhatsApp"
      />

      <MobileBottomBarSheet
        icon={<ShoppingCart className="h-5 w-5" />}
        label="Carrinho"
        sheetTitle="Carrinho"
        side="right"
        badgeCount={cartItemCount}
        contentClassName="w-full max-w-lg sm:max-w-lg"
      >
        {cartContent}
      </MobileBottomBarSheet>
    </MobileBottomBar>
  );
}
