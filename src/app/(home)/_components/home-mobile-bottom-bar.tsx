import { Home, LogIn, MapPin, MessageCircle } from "lucide-react";
import {
  MobileBottomBar,
  MobileBottomBarExternalLink,
  MobileBottomBarLink,
} from "@/components/common/mobile-bottom-bar";
import { companyInfo } from "@/core/config-tenant/info-company";

const WHATSAPP_MESSAGE = "Olá, gostaria de falar sobre revenda de produtos";

function buildWhatsappUrl(phone: string, message: string): string {
  return `https://api.whatsapp.com/send/?phone=${encodeURIComponent(phone)}&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`;
}

export function HomeMobileBottomBar() {
  const whatsappUrl = buildWhatsappUrl(companyInfo.whatsapp, WHATSAPP_MESSAGE);

  return (
    <MobileBottomBar
      aria-label="Menu de navegação home"
      hideFromBreakpoint="md"
    >
      <MobileBottomBarLink
        href="/"
        icon={<Home className="h-5 w-5" />}
        label="Home"
        exact
      />

      <MobileBottomBarExternalLink
        href={whatsappUrl}
        icon={<MessageCircle className="h-5 w-5" />}
        label="WhatsApp"
      />

      <MobileBottomBarLink
        href="/#localizacao"
        icon={<MapPin className="h-5 w-5" />}
        label="Localização"
      />

      <MobileBottomBarLink
        href="/sign-in"
        icon={<LogIn className="h-5 w-5" />}
        label="Área do Cliente"
      />
    </MobileBottomBar>
  );
}
