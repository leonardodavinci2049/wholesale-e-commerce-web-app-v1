import { SiteHeaderWithBreadcrumb } from "@/components/dashboard/header/site-header-with-breadcrumb";
import { serverEnvs } from "@/core/config/envs.server";
import { createLogger } from "@/core/logger";
import { getAuthContext } from "@/server/auth-context";
import { getBrands } from "@/services/api-main/brand/brand-cached-service";
import { getOrderDashboard } from "@/services/api-main/order-sales/order-sales-cached-service";
import {
  getProductsPdv,
  searchProductsPdv,
} from "@/services/api-main/product-pdv/product-pdv-cached-service";

import { BrandFilterBar } from "./_components/brand-filter-bar";
import { CartSummaryPanel } from "./_components/cart-summary-panel";
import { MobileCartFab } from "./_components/mobile-cart-fab";
import { ProductGrid } from "./_components/product-grid";
import { ProductList } from "./_components/product-list";
import { ProductLoadMoreV2 } from "./_components/product-load-more-v2";
import { ProductSearchBar } from "./_components/product-search-bar";
import { ProductViewSwitcher } from "./_components/product-view-switcher";

const logger = createLogger("new-budget-page");

const DEFAULT_PRODUCT_LIMIT = 50;

interface NewBudgetV2PageProps {
  searchParams: Promise<{
    search?: string;
    orderId?: string;
    brandId?: string;
    flagStock?: string;
    limit?: string;
  }>;
}

export default async function NewBudgetV2Page({
  searchParams,
}: NewBudgetV2PageProps) {
  const { session, apiContext } = await getAuthContext();

  const customerId = session.user.personId ?? 0;
  const sellerId = session.user.sellerId ?? 0;
  const typeBusiness = serverEnvs.TYPE_BUSINESS;

  const params = await searchParams;
  const search = params.search?.trim() ?? "";
  const orderId = params.orderId ? Number(params.orderId) : undefined;
  const brandId = params.brandId ? Number(params.brandId) : undefined;
  const flagStock = params.flagStock === "0" ? 0 : 1;
  const productLimit = params.limit
    ? Math.max(DEFAULT_PRODUCT_LIMIT, Number(params.limit))
    : DEFAULT_PRODUCT_LIMIT;

  const dashboardParams = {
    ...apiContext,
    sellerId,
    typeBusiness,
  };

  const productsPromise = search
    ? searchProductsPdv({
        search,
        customerId,
        flagStock,
        limit: productLimit,
        ...apiContext,
      })
    : getProductsPdv({
        brandId,
        flagStock,
        recordsQuantity: productLimit,
        ...apiContext,
      });

  const brandsPromise = getBrands({
    inactive: 0,
    limit: 50,
    ...apiContext,
  });

  const orderDashboardPromise = orderId
    ? getOrderDashboard(orderId, dashboardParams).catch((error) => {
        logger.error("Erro ao carregar dashboard do pedido (v2):", error);
        return undefined;
      })
    : Promise.resolve(undefined);

  const [products, brands, orderDashboard] = await Promise.all([
    productsPromise.catch((error) => {
      logger.error("Erro ao carregar produtos (v2):", error);
      return [];
    }),
    brandsPromise.catch((error) => {
      logger.error("Erro ao carregar marcas (v2):", error);
      return [];
    }),
    orderDashboardPromise,
  ]);

  const cartItems = orderDashboard?.items ?? [];
  const summary = orderDashboard?.summary;
  const selectedPaymentId = orderDashboard?.details?.paymentFormId;

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeaderWithBreadcrumb
        title="Novo Orçamento"
        breadcrumbItems={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Vendas", href: "#" },
          { label: "Novo Orçamento (v2)", isActive: true },
        ]}
      />

      <main className="flex flex-1 flex-col gap-4 p-4 pt-0 lg:p-6 lg:pt-0">
        <div className="mx-auto grid w-full max-w-350 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="flex min-w-0 flex-col gap-4">
            <section className="rounded-2xl border border-border/60 bg-card/95 p-3 shadow-xs sm:p-4">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Marcas
              </p>
              <BrandFilterBar brands={brands} selectedBrandId={brandId} />
            </section>

            <section className="rounded-2xl border border-border/60 bg-card/95 p-3 shadow-xs sm:p-4">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Busca rápida
              </p>
              <ProductSearchBar defaultValue={search} flagStock={flagStock} />
            </section>

            <p className="px-1 text-xs text-muted-foreground">
              Lista sincronizada. Escolha os itens e confirme pelo WhatsApp.
            </p>

            <ProductViewSwitcher
              grid={<ProductGrid products={products} orderId={orderId} />}
              list={<ProductList products={products} orderId={orderId} />}
            />

            <ProductLoadMoreV2
              currentLimit={productLimit}
              totalLoaded={products.length}
            />
          </div>

          <aside className="hidden xl:block">
            <div className="sticky top-4">
              <CartSummaryPanel
                items={cartItems}
                summary={summary}
                orderId={orderId}
                selectedPaymentId={selectedPaymentId}
              />
            </div>
          </aside>
        </div>
      </main>

      <MobileCartFab itemCount={cartItems.length}>
        <CartSummaryPanel
          items={cartItems}
          summary={summary}
          orderId={orderId}
          selectedPaymentId={selectedPaymentId}
        />
      </MobileCartFab>
    </div>
  );
}
