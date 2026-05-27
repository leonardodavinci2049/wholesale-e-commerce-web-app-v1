import { SiteHeaderWithBreadcrumb } from "@/components/dashboard/header/site-header-with-breadcrumb";
import { createLogger } from "@/core/logger";
import { getAuthContext } from "@/server/auth-context";
import { getOrderCart } from "@/services/api-main/order-sales/order-sales-cached-service";
import { getPremiumProducts } from "@/services/api-main/product-base/product-base-cached-service";

import { CartSummaryPanel } from "../_components/cart-summary-panel";
import { MobileProductSearch } from "../_components/mobile-product-search";
import { ProductGrid } from "../_components/product-grid";
import { ProductList } from "../_components/product-list";
import { ProductLoadMore } from "../_components/product-load-more";
import { ProductViewSwitcher } from "../_components/product-view-switcher";
import { SaleMobileBottomBar } from "../_components/sale-mobile-bottom-bar";

const logger = createLogger("products-best-selling-page");

const DEFAULT_PRODUCT_LIMIT = 20;

interface ProductsBestSellingPageProps {
  searchParams: Promise<{
    search?: string;
    orderId?: string;
    limit?: string;
  }>;
}

export default async function ProductsBestSellingPage({
  searchParams,
}: ProductsBestSellingPageProps) {
  const { apiContext } = await getAuthContext();

  const params = await searchParams;
  const search = params.search?.trim() ?? "";
  const orderId = params.orderId ? Number(params.orderId) : undefined;
  const productLimit = params.limit
    ? Math.max(DEFAULT_PRODUCT_LIMIT, Number(params.limit))
    : DEFAULT_PRODUCT_LIMIT;

  const productsPromise = getPremiumProducts({
    search: search || undefined,
    taxonomyId: 0,
    typeId: 0,
    brandId: 0,
    stockFlag: 1,
    flagService: 0,
    flagPromotions: 0,
    flagHighlight: 1,
    flagLaunch: 0,
    recordsQuantity: productLimit,
    pageId: 0,
    columnId: 1,
    orderId: 2,
    pe_user_id: apiContext.pe_user_id,
    pe_user_name: apiContext.pe_user_name,
    pe_user_role: apiContext.pe_user_role,
    pe_person_id: apiContext.pe_person_id,
  });

  const orderCartPromise = getOrderCart(orderId ?? 0, {
    ...apiContext,
  }).catch((error) => {
    logger.error("Erro ao carregar carrinho:", error);
    return undefined;
  });

  const [products, orderCart] = await Promise.all([
    productsPromise.catch((error) => {
      logger.error("Erro ao carregar produtos mais vendidos:", error);
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
        title="Produtos Mais Vendidos"
        breadcrumbItems={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Produtos", href: "#" },
          { label: "Mais Vendidos", isActive: true },
        ]}
      />

      <div id="promo-search-panel-container" className="sm:hidden" />

      <main className="flex flex-1 flex-col gap-4 p-4 pt-0 lg:p-6 lg:pt-0">
        <div className="mx-auto grid w-full max-w-350 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="flex min-w-0 flex-col gap-4">
            <ProductViewSwitcher
              searchDefaultValue={search}
              grid={
                <ProductGrid products={products} orderId={effectiveOrderId} />
              }
              list={
                <ProductList products={products} orderId={effectiveOrderId} />
              }
            />

            <ProductLoadMore
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

      <SaleMobileBottomBar
        cartItemCount={cartItems.length}
        searchContent={<MobileProductSearch defaultValue={search} />}
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
