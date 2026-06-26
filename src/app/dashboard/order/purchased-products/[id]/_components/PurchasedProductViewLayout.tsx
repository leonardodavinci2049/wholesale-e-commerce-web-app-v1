import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { UIOrderItemCustomer } from "@/services/api-main/physical_product";
import { formatCurrency, parseMonetaryValue } from "@/utils/common-utils";
import { getValidImageUrl } from "@/utils/image-utils";

import { BackToPurchasedProductsButton } from "./BackToPurchasedProductsButton";

interface PurchasedProductViewLayoutProps {
  item: UIOrderItemCustomer;
}

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

function toDateLabel(value: string | null | undefined): string {
  if (!value) return "Data indisponível";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "Data indisponível";
  return dateFormatter.format(parsed);
}

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-medium text-foreground break-words">
        {children}
      </span>
    </div>
  );
}

export function PurchasedProductViewLayout({
  item,
}: PurchasedProductViewLayoutProps) {
  const imageUrl = getValidImageUrl(item.imagePath);
  const hasDiscount = parseMonetaryValue(item.totalDiscountValue) > 0;
  const warrantyMonths = Math.ceil(item.warrantyDays / 30);

  return (
    <div className="mx-auto flex w-full max-w-350 flex-col gap-6 lg:gap-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between border-b pb-4">
          <BackToPurchasedProductsButton />
        </div>

        <div>
          <div className="mb-2 flex flex-wrap gap-2">
            <Badge variant="secondary">{item.orderStatus || "Pedido"}</Badge>
            {item.financialStatus && (
              <Badge variant="outline">{item.financialStatus}</Badge>
            )}
            {item.accountStatus && (
              <Badge variant="ghost">{item.accountStatus}</Badge>
            )}
          </div>
          <h1 className="text-2xl font-bold leading-tight lg:text-3xl">
            {item.description || `Produto #${item.productId}`}
          </h1>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span>SKU: #{item.productId}</span>
            {item.model && <span>Modelo: {item.model}</span>}
            {item.brand && <span>Marca: {item.brand}</span>}
            {item.reference && <span>Ref: {item.reference}</span>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
        {/* Imagem do produto (PATH_IMAGEM) */}
        <div className="flex flex-col gap-3">
          <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm">
            <Image
              src={imageUrl}
              alt={item.description || `Produto #${item.productId}`}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-3"
              priority
            />
          </div>
          {item.label && (
            <span className="text-xs text-muted-foreground">
              Etiqueta: {item.label}
            </span>
          )}
        </div>

        {/* Resumo financeiro */}
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Resumo da Compra</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <DetailRow label="Quantidade">
                <span className="tabular-nums">{item.quantity}</span>
              </DetailRow>
              <DetailRow label="Valor Unitário">
                <span className="tabular-nums">
                  {formatCurrency(parseMonetaryValue(item.unitValue))}
                </span>
              </DetailRow>
              <DetailRow label="Subtotal">
                <span className="tabular-nums">
                  {formatCurrency(parseMonetaryValue(item.subtotalValue))}
                </span>
              </DetailRow>

              {hasDiscount && (
                <>
                  <Separator className="my-1" />
                  <DetailRow label="Desconto">
                    <span className="tabular-nums text-emerald-600">
                      - {formatCurrency(parseMonetaryValue(item.discountValue))}
                    </span>
                  </DetailRow>
                  {parseMonetaryValue(item.adminDiscountValue) > 0 && (
                    <DetailRow label="Desconto Admin.">
                      <span className="tabular-nums text-emerald-600">
                        -{" "}
                        {formatCurrency(
                          parseMonetaryValue(item.adminDiscountValue),
                        )}
                      </span>
                    </DetailRow>
                  )}
                  <DetailRow label="Desconto Total">
                    <span className="tabular-nums text-emerald-600">
                      -{" "}
                      {formatCurrency(
                        parseMonetaryValue(item.totalDiscountValue),
                      )}
                    </span>
                  </DetailRow>
                </>
              )}

              <Separator className="my-2" />
              <div className="flex items-center justify-between gap-3 pt-1">
                <span className="text-sm font-semibold">Total</span>
                <span className="text-xl font-bold tabular-nums">
                  {formatCurrency(parseMonetaryValue(item.totalValue))}
                </span>
              </div>
            </CardContent>
          </Card>

          {item.warrantyDays > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Garantia</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {item.warrantyDays} dia{item.warrantyDays === 1 ? "" : "s"}
                  {warrantyMonths > 0
                    ? ` (aprox. ${warrantyMonths} meses)`
                    : ""}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Informações do pedido */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informações do Pedido</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
            <div>
              <DetailRow label="Nº do Pedido">#{item.orderId}</DetailRow>
              <DetailRow label="Movimento">#{item.movementId}</DetailRow>
              <DetailRow label="Data do Pedido">
                {toDateLabel(item.orderDate)}
              </DetailRow>
              <DetailRow label="Cadastrado em">
                {toDateLabel(item.createdAt)}
              </DetailRow>
            </div>
            <div>
              <DetailRow label="Tipo">{item.type || "-"}</DetailRow>
              <DetailRow label="Marca">{item.brand || "-"}</DetailRow>
              <DetailRow label="Cliente">{item.customerName || "-"}</DetailRow>
              <DetailRow label="Vendedor">{item.sellerName || "-"}</DetailRow>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function PurchasedProductViewLayoutSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-350 flex-col gap-6 animate-pulse lg:gap-8">
      <div className="h-10 rounded bg-muted" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
        <div className="aspect-square rounded-xl bg-muted" />
        <div className="space-y-6">
          <div className="h-48 rounded bg-muted" />
          <div className="h-24 rounded bg-muted" />
        </div>
      </div>
      <div className="h-48 rounded bg-muted" />
    </div>
  );
}
