import { SiteHeaderWithBreadcrumb } from "@/components/dashboard/header/site-header-with-breadcrumb";
import { serverEnvs } from "@/core/config/envs.server";
import { createLogger } from "@/core/logger";
import { getAuthContext } from "@/server/auth-context";
import { getBrands } from "@/services/api-main/brand/brand-cached-service";
import { getOrderCart } from "@/services/api-main/order-sales/order-sales-cached-service";
import {
  getProductsPdv,
  searchProductsPdv,
} from "@/services/api-main/product-pdv/product-pdv-cached-service";
import { getTaxonomyMenu } from "@/services/api-main/taxonomy-base/taxonomy-base-cached-service";

import { BudgetMobileBottomBar } from "./_components/budget-mobile-bottom-bar";
import { CartSummaryPanel } from "./_components/cart-summary-panel";
import { ProductGrid } from "./_components/product-grid";
import { ProductList } from "./_components/product-list";
import { ProductLoadMoreV2 } from "./_components/product-load-more-v2";
import { ProductSearchBar } from "./_components/product-search-bar";
import { ProductViewSwitcher } from "./_components/product-view-switcher";

const logger = createLogger("budget-page");

const DEFAULT_PRODUCT_LIMIT = 50;

interface BudgetPageProps {
  searchParams: Promise<{
    search?: string;
    orderId?: string;
    brandId?: string;
    taxonomyId?: string;
    flagStock?: string;
    limit?: string;
  }>;
}

export default async function BudgetPage({ searchParams }: BudgetPageProps) {
  const { session, apiContext } = await getAuthContext();

  const customerId = session.user.personId ?? 0;
  const typeBusiness = serverEnvs.TYPE_BUSINESS;

  const params = await searchParams;
  const search = params.search?.trim() ?? "";
  const orderId = params.orderId ? Number(params.orderId) : undefined;
  const brandId = params.brandId ? Number(params.brandId) : undefined;
  const taxonomyId = params.taxonomyId ? Number(params.taxonomyId) : undefined;
  const flagStock = params.flagStock === "1" ? 1 : 0;
  const productLimit = params.limit
    ? Math.max(DEFAULT_PRODUCT_LIMIT, Number(params.limit))
    : DEFAULT_PRODUCT_LIMIT;

  const dashboardParams = {
    ...apiContext,
    customerId,
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
        taxonomyId,
        flagStock,
        recordsQuantity: productLimit,
        ...apiContext,
      });

  const brandsPromise = getBrands({
    inactive: 0,
    limit: 50,
    ...apiContext,
  });

  const categoriesPromise = getTaxonomyMenu(2, 0, apiContext);

  const orderCartPromise = getOrderCart(orderId ?? 0, dashboardParams).catch(
    (error) => {
      logger.error("Erro ao carregar carrinho do pedido (v2):", error);
      return undefined;
    },
  );

  const [products, brands, categories, orderCart] = await Promise.all([
    productsPromise.catch((error) => {
      logger.error("Erro ao carregar produtos (v2):", error);
      return [];
    }),
    brandsPromise.catch((error) => {
      logger.error("Erro ao carregar marcas (v2):", error);
      return [];
    }),
    categoriesPromise.catch((error) => {
      logger.error("Erro ao carregar categorias (v2):", error);
      return [];
    }),
    orderCartPromise,
  ]);

  const cartItems = orderCart?.items ?? [];
  const summary = orderCart?.summary;
  const selectedPaymentId = orderCart?.details?.paymentFormId;
  const effectiveOrderId = orderCart?.details?.orderId ?? orderId;

  return (
    <div className="flex flex-1 flex-col pb-[calc(env(safe-area-inset-bottom)+5rem)] xl:pb-0">
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
                Busca rápida
              </p>
              <ProductSearchBar
                defaultValue={search}
                flagStock={flagStock}
                brands={brands}
                selectedBrandId={brandId}
                categories={categories}
                selectedTaxonomyId={taxonomyId}
              />
            </section>

            <ProductViewSwitcher
              grid={
                <ProductGrid products={products} orderId={effectiveOrderId} />
              }
              list={
                <ProductList products={products} orderId={effectiveOrderId} />
              }
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
                orderId={effectiveOrderId}
                selectedPaymentId={selectedPaymentId}
              />
            </div>
          </aside>
        </div>
      </main>

      <BudgetMobileBottomBar
        cartItemCount={cartItems.length}
        flagStock={flagStock}
        brands={brands}
        selectedBrandId={brandId}
        categories={categories}
        selectedTaxonomyId={taxonomyId}
        cartContent={
          <CartSummaryPanel
            items={cartItems}
            summary={summary}
            orderId={effectiveOrderId}
            selectedPaymentId={selectedPaymentId}
          />
        }
      />
    </div>
  );
}
