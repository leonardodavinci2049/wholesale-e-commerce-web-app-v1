import { Home, MessageCircle, Search, ShoppingCart } from "lucide-react";
import type { ReactNode } from "react";
import {
  MobileBottomBar,
  MobileBottomBarExternalLink,
  MobileBottomBarLink,
  MobileBottomBarSheet,
} from "@/components/common/mobile-bottom-bar";
import { companyInfo } from "@/data/info-company";

interface SaleMobileBottomBarProps {
  cartItemCount: number;
  cartContent: ReactNode;
  searchContent: ReactNode;
}

const WHATSAPP_MESSAGE =
  "Olá, gostaria de tirar dúvidas sobre produtos em promoção";

function buildWhatsappUrl(phone: string, message: string): string {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function SaleMobileBottomBar({
  cartItemCount,
  cartContent,
  searchContent,
}: SaleMobileBottomBarProps) {
  const whatsappUrl = buildWhatsappUrl(companyInfo.whatsapp, WHATSAPP_MESSAGE);

  return (
    <MobileBottomBar aria-label="Menu de navegação promoções">
      <MobileBottomBarLink
        href="/dashboard"
        icon={<Home className="h-5 w-5" />}
        label="Home"
        exact
      />

      <MobileBottomBarSheet
        icon={<Search className="h-5 w-5" />}
        label="Buscar"
        sheetTitle="Buscar promoções"
      >
        <div className="px-4 pb-6 pt-2">{searchContent}</div>
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
