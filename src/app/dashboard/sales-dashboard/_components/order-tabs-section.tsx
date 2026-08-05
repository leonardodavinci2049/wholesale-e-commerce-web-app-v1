"use client";

import {
  ContactRound,
  FileText,
  PencilLine,
  ShoppingCart,
  UserRound,
} from "lucide-react";
import type * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface OrderTabsSectionProps {
  cartContent: React.ReactNode;
  purchaseDetailsContent: React.ReactNode;
  sellerDetailsContent: React.ReactNode;
  customerDetailsContent: React.ReactNode;
  orderEditContent: React.ReactNode;
}

export function OrderTabsSection({
  cartContent,
  purchaseDetailsContent,
  sellerDetailsContent,
  customerDetailsContent,
  orderEditContent,
}: OrderTabsSectionProps) {
  return (
    <Tabs defaultValue="cart" className="flex flex-col">
      <div className="overflow-x-auto rounded-full border border-border/70 bg-card/80 p-1 shadow-lg shadow-black/5 backdrop-blur-sm dark:bg-card/60 dark:shadow-black/20">
        <TabsList
          variant="default"
          className="h-auto min-w-full w-max justify-start gap-1 bg-transparent p-0"
        >
          <TabsTrigger
            value="cart"
            aria-label="Itens do pedido"
            className="min-w-11 flex-1 gap-2 rounded-full px-3 py-2 text-[13px] font-semibold transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:shadow-primary/25 md:px-4 md:py-2.5 md:text-sm"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden whitespace-nowrap xs:inline">Carrinho</span>
          </TabsTrigger>

          <TabsTrigger
            value="purchase-details"
            aria-label="Informações da compra"
            className="min-w-11 flex-1 gap-2 rounded-full px-3 py-2 text-[13px] font-semibold transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:shadow-primary/25 md:px-4 md:py-2.5 md:text-sm"
          >
            <FileText className="h-4 w-4" />
            <span className="hidden whitespace-nowrap xs:inline">
              Detalhes Compras
            </span>
          </TabsTrigger>

          <TabsTrigger
            value="seller-details"
            aria-label="Informações do vendedor"
            className="min-w-11 flex-1 gap-2 rounded-full px-3 py-2 text-[13px] font-semibold transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:shadow-primary/25 md:px-4 md:py-2.5 md:text-sm"
          >
            <ContactRound className="h-4 w-4" />
            <span className="hidden whitespace-nowrap xs:inline">
              Informações do Vendedor
            </span>
          </TabsTrigger>

          <TabsTrigger
            value="customer-details"
            aria-label="Informações do cliente"
            className="min-w-11 flex-1 gap-2 rounded-full px-3 py-2 text-[13px] font-semibold transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:shadow-primary/25 md:px-4 md:py-2.5 md:text-sm"
          >
            <UserRound className="h-4 w-4" />
            <span className="hidden whitespace-nowrap xs:inline">
              Detalhe Cliente
            </span>
          </TabsTrigger>

          <TabsTrigger
            value="order-edit"
            aria-label="Anotações do orçamento"
            className="min-w-11 flex-1 gap-2 rounded-full px-3 py-2 text-[13px] font-semibold transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:shadow-primary/25 md:px-4 md:py-2.5 md:text-sm"
          >
            <PencilLine className="h-4 w-4" />
            <span className="hidden whitespace-nowrap xs:inline">Editar</span>
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent
        value="cart"
        forceMount
        className="mt-4 outline-none data-[state=inactive]:hidden"
      >
        {cartContent}
      </TabsContent>

      <TabsContent
        value="purchase-details"
        forceMount
        className="mt-4 outline-none data-[state=inactive]:hidden"
      >
        {purchaseDetailsContent}
      </TabsContent>

      <TabsContent
        value="seller-details"
        forceMount
        className="mt-4 outline-none data-[state=inactive]:hidden"
      >
        {sellerDetailsContent}
      </TabsContent>

      <TabsContent
        value="customer-details"
        forceMount
        className="mt-4 outline-none data-[state=inactive]:hidden"
      >
        {customerDetailsContent}
      </TabsContent>

      <TabsContent
        value="order-edit"
        forceMount
        className="mt-4 outline-none data-[state=inactive]:hidden"
      >
        {orderEditContent}
      </TabsContent>
    </Tabs>
  );
}
