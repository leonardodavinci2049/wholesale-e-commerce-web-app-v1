import type { Metadata } from "next";
import { CatalogMobileBottomBar } from "@/components/common/catalog-mobile-bottom-bar";
import { HeaderPromoViewToggle } from "@/components/dashboard/header/header-promo-view-toggle";
import { SiteHeaderWithBreadcrumb } from "@/components/dashboard/header/site-header-with-breadcrumb";
import { serverEnvs } from "@/core/config/envs.server";
import { createLogger } from "@/core/logger";

export const metadata: Metadata = {
  title: "Produtos em Promoção",
};

import { getAuthContext } from "@/server/auth-context";
import { orderSalesServiceApi } from "@/services/api-main/order-sales";
import {
  transformCustomerEntity,
  transformDashboardDetailsEntity,
  transformDashboardItemEntity,
  transformSummaryEntity,
} from "@/services/api-main/order-sales/transformers/transformers";
import { productBaseServiceApi } from "@/services/api-main/product-base";
import { transformProductList } from "@/services/api-main/product-base/transformers/transformers";

import { CartSummaryPanel } from "../_components/cart-summary-panel";
import { ProductGrid } from "../_components/product-grid";
import { ProductList } from "../_components/product-list";
import { ProductLoadMore } from "../_components/product-load-more";
import { ProductSearchBar } from "../_components/product-search-bar";
import { ProductViewSwitcher } from "../_components/product-view-switcher";

const logger = createLogger("products-on-sale-page");

const DEFAULT_PRODUCT_LIMIT = 20;

async function getOrderCart(
  orderId: number,
  params: {
    customerId?: number;
    typeBusiness?: number;
    pe_user_id: string;
    pe_user_name: string;
    pe_user_role: string;
    pe_person_id: number;
  },
) {
  const response = await orderSalesServiceApi.findCartId({
    pe_order_id: orderId,
    pe_id_customer: params.customerId,
    pe_type_business: params.typeBusiness,
    pe_user_id: params.pe_user_id,
    pe_user_name: params.pe_user_name,
    pe_user_role: params.pe_user_role,
    pe_person_id: params.pe_person_id,
  });

  if (!response) {
    return undefined;
  }

  const summary = orderSalesServiceApi.extractDashboardSummary(response);
  const details = orderSalesServiceApi.extractDashboardDetails(response);
  const items = orderSalesServiceApi.extractDashboardItems(response);
  const customer = orderSalesServiceApi.extractDashboardCustomer(response);

  return {
    summary: summary ? transformSummaryEntity(summary) : null,
    details: details ? transformDashboardDetailsEntity(details) : null,
    items: items.map(transformDashboardItemEntity),
    customer: customer ? transformCustomerEntity(customer) : null,
  };
}

interface ProductsOnSalePageProps {
  searchParams: Promise<{
    search?: string;
    orderId?: string;
    limit?: string;
  }>;
}

export default async function ProductsOnSalePage({
  searchParams,
}: ProductsOnSalePageProps) {
  const { session, apiContext } = await getAuthContext();

  const customerId = session.user.personId ?? 0;
  const typeBusiness = serverEnvs.TYPE_BUSINESS;

  const params = await searchParams;
  const search = params.search?.trim() ?? "";
  const orderId = params.orderId ? Number(params.orderId) : undefined;
  const productLimit = params.limit
    ? Math.max(DEFAULT_PRODUCT_LIMIT, Number(params.limit))
    : DEFAULT_PRODUCT_LIMIT;

  const productsPromise = productBaseServiceApi
    .findPremiumProducts({
      pe_search: search || undefined,
      pe_taxonomy_id: 0,
      pe_type_id: 0,
      pe_brand_id: 0,
      pe_stock_flag: 1,
      pe_flag_service: 0,
      pe_flag_promotions: 1,
      pe_flag_highlight: 0,
      pe_flag_launch: 0,
      pe_records_quantity: productLimit,
      pe_page_id: 0,
      pe_column_id: 1,
      pe_order_id: 2,
      pe_user_id: apiContext.pe_user_id,
      pe_user_name: apiContext.pe_user_name,
      pe_user_role: apiContext.pe_user_role,
      pe_person_id: apiContext.pe_person_id,
    })
    .then((response) =>
      transformProductList(
        productBaseServiceApi.extractPremiumProducts(response),
      ),
    );

  const orderCartPromise = getOrderCart(orderId ?? 0, {
    ...apiContext,
    customerId,
    typeBusiness,
  }).catch((error) => {
    logger.error("Erro ao carregar carrinho:", error);
    return undefined;
  });

  const [products, orderCart] = await Promise.all([
    productsPromise.catch((error) => {
      logger.error("Erro ao carregar produtos em promoção:", error);
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
        title="Produtos em Promoção"
        breadcrumbItems={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Produtos", href: "#" },
          { label: "Promoções", isActive: true },
        ]}
        mobileSearchBar={
          <ProductSearchBar
            defaultValue={search}
            placeholder="Buscar produto em promoção..."
            ariaLabel="Buscar produto em promoção"
            viewToggleButton={<HeaderPromoViewToggle />}
          />
        }
      />

      <main className="flex flex-1 flex-col gap-4 p-4 pt-0 lg:p-6 lg:pt-0">
        <div className="mx-auto w-full max-w-350 flex flex-col gap-1 mb-2">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl text-foreground">
            Produtos em Promoção
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Confira as melhores ofertas e descontos especiais preparados para
            você.
          </p>
        </div>

        <div className="mx-auto grid w-full max-w-350 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="flex min-w-0 flex-col gap-4">
            <ProductViewSwitcher
              searchDefaultValue={search}
              searchPlaceholder="Buscar produto em promoção..."
              searchAriaLabel="Buscar produto em promoção"
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

      <CatalogMobileBottomBar
        cartItemCount={cartItems.length}
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
