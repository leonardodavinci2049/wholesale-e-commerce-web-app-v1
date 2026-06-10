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
import { companyInfo } from "@/core/config-tenant/info-company";
import type { UIBrand } from "@/services/api-main/brand/transformers/transformers";
import type { UITaxonomyMenuItem } from "@/services/api-main/taxonomy-base/transformers/transformers";

import { BudgetCategoryFilterPanel } from "./budget-category-filter-panel";
import { BudgetGeneralFilterPanel } from "./budget-general-filter-panel";

interface BudgetMobileBottomBarProps {
  cartItemCount: number;
  cartContent: ReactNode;
  flagStock: number;
  brands: UIBrand[];
  selectedBrandId?: number;
  categories: UITaxonomyMenuItem[];
  selectedTaxonomyId?: number;
}

const WHATSAPP_MESSAGE = "Olá Gostaria tirar dúvidas sobre produtos";

function buildWhatsappUrl(phone: string, message: string): string {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function BudgetMobileBottomBar({
  cartItemCount,
  cartContent,
  flagStock,
  brands,
  selectedBrandId,
  categories,
  selectedTaxonomyId,
}: BudgetMobileBottomBarProps) {
  const whatsappUrl = buildWhatsappUrl(companyInfo.whatsapp, WHATSAPP_MESSAGE);

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
        <BudgetCategoryFilterPanel
          categories={categories}
          selectedTaxonomyId={selectedTaxonomyId}
        />
      </MobileBottomBarSheet>

      <MobileBottomBarSheet
        icon={<Filter className="h-5 w-5" />}
        label="Filtro geral"
        sheetTitle="Filtro geral"
      >
        <BudgetGeneralFilterPanel
          brands={brands}
          selectedBrandId={selectedBrandId}
          flagStock={flagStock}
          stockSwitchId="mobile-stock-filter-v2"
        />
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
