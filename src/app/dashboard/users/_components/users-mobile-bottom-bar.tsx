import { ClipboardList, Home, MessageCircle } from "lucide-react";

import {
  MobileBottomBar,
  MobileBottomBarExternalLink,
  MobileBottomBarLink,
} from "@/components/common/mobile-bottom-bar";
import { companyInfo } from "@/data/info-company";

import { AddCustomerUserDialog } from "./add-customer-user-dialog";

const WHATSAPP_MESSAGE = "Olá, gostaria de tirar algumas dúvidas";

function buildWhatsappUrl(phone: string, message: string): string {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function UsersMobileBottomBar() {
  const whatsappUrl = buildWhatsappUrl(companyInfo.whatsapp, WHATSAPP_MESSAGE);

  return (
    <MobileBottomBar
      aria-label="Menu da gestão de usuários"
      hideFromBreakpoint="md"
    >
      <MobileBottomBarLink
        href="/dashboard"
        icon={<Home className="h-5 w-5" />}
        label="Home"
        exact
      />

      <MobileBottomBarLink
        href="/dashboard/sales-dashboard"
        icon={<ClipboardList className="h-5 w-5" />}
        label="Pedido"
      />

      <MobileBottomBarExternalLink
        href={whatsappUrl}
        icon={<MessageCircle className="h-5 w-5" />}
        label="WhatsApp"
      />

      <li className="flex flex-1">
        <AddCustomerUserDialog triggerVariant="mobile-bottom-bar" />
      </li>
    </MobileBottomBar>
  );
}
