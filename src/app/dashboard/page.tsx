import { SiteHeaderWithBreadcrumb } from "@/components/dashboard/header/site-header-with-breadcrumb";
import { serverEnvs } from "@/core/config/envs.server";
import { createLogger } from "@/core/logger";
import { isApiAvailabilityError } from "@/lib/axios/base-api-service";
import { getAuthContext } from "@/server/auth-context";
import { brandServiceApi } from "@/services/api-main/brand";
import { transformBrandList } from "@/services/api-main/brand/transformers/transformers";
import { orderSalesServiceApi } from "@/services/api-main/order-sales";
import {
  transformCustomerEntity,
  transformDashboardDetailsEntity,
  transformDashboardItemEntity,
  transformSummaryEntity,
} from "@/services/api-main/order-sales/transformers/transformers";
import { productPdvServiceApi } from "@/services/api-main/product-pdv";
import {
  transformProductPdvList,
  transformProductPdvSearchList,
} from "@/services/api-main/product-pdv/transformers/transformers";
import { taxonomyBaseServiceApi } from "@/services/api-main/taxonomy-base";
import { transformTaxonomyMenuList } from "@/services/api-main/taxonomy-base/transformers/transformers";

import { BudgetMobileBottomBar } from "./_components/main_catalog/budget-mobile-bottom-bar";
import { CartSummaryPanel } from "./_components/main_catalog/cart-summary-panel";
import { ProductGrid } from "./_components/main_catalog/product-grid";
import { ProductList } from "./_components/main_catalog/product-list";
import { ProductLoadMoreV2 } from "./_components/main_catalog/product-load-more-v2";
import { ProductSearchBar } from "./_components/main_catalog/product-search-bar";
import { ProductViewSwitcher } from "./_components/main_catalog/product-view-switcher";

const logger = createLogger("dashboard-page");

const DEFAULT_PRODUCT_LIMIT = 50;

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

interface DashboardPageProps {
  searchParams: Promise<{
    search?: string;
    orderId?: string;
    brandId?: string;
    taxonomyId?: string;
    flagStock?: string;
    limit?: string;
  }>;
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
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

  const shouldUseSearchEndpoint = search && !brandId && !taxonomyId;

  const productsPromise = shouldUseSearchEndpoint
    ? productPdvServiceApi
        .findProductsPdvSearch({
          pe_search: search,
          pe_customer_id: customerId,
          pe_flag_stock: flagStock,
          pe_limit: productLimit,
          ...apiContext,
        })
        .then((response) =>
          transformProductPdvSearchList(
            productPdvServiceApi.extractProductsPdvSearch(response),
          ),
        )
    : productPdvServiceApi
        .findAllProductsPdv({
          pe_search: search,
          pe_brand_id: brandId,
          pe_taxonomy_id: taxonomyId,
          pe_flag_stock: flagStock,
          pe_records_quantity: productLimit,
          ...apiContext,
        })
        .then((response) =>
          transformProductPdvList(
            productPdvServiceApi.extractProductsPdv(response),
          ),
        );

  const brandsPromise = brandServiceApi
    .findAllBrands({
      pe_inactive: 0,
      pe_limit: 50,
      ...apiContext,
    })
    .then((response) =>
      transformBrandList(brandServiceApi.extractBrands(response)),
    );

  const categoriesPromise = taxonomyBaseServiceApi
    .findTaxonomyMenu({
      pe_type_id: 2,
      pe_parent_id: 0,
      ...apiContext,
    })
    .then((response) =>
      transformTaxonomyMenuList(
        taxonomyBaseServiceApi.extractTaxonomyMenu(response),
      ),
    );

  const orderCartPromise = getOrderCart(orderId ?? 0, dashboardParams).catch(
    (error) => {
      logger.error("Erro ao carregar carrinho do pedido:", error);
      return undefined;
    },
  );

  const [productResult, brands, categories, orderCart] = await Promise.all([
    productsPromise.catch((error) => {
      logger.error("Erro ao carregar produtos:", error);
      return {
        items: [],
        isApiUnavailable: isApiAvailabilityError(error),
      };
    }),
    brandsPromise.catch((error) => {
      logger.error("Erro ao carregar marcas:", error);
      return [];
    }),
    categoriesPromise.catch((error) => {
      logger.error("Erro ao carregar categorias:", error);
      return [];
    }),
    orderCartPromise,
  ]);

  const products = Array.isArray(productResult)
    ? productResult
    : productResult.items;
  const isProductApiUnavailable =
    !Array.isArray(productResult) && productResult.isApiUnavailable;
  const cartItems = orderCart?.items ?? [];
  const summary = orderCart?.summary;
  const selectedPaymentId = orderCart?.details?.paymentFormId;
  const effectiveOrderId = orderCart?.details?.orderId ?? orderId;

  return (
    <div className="flex flex-1 flex-col pb-[calc(env(safe-area-inset-bottom)+5rem)] xl:pb-0">
      <SiteHeaderWithBreadcrumb
        title="Catálogo de produtos"
        breadcrumbItems={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Catálogo de produtos", isActive: true },
        ]}
        mobileSearchBar={
          <ProductSearchBar
            defaultValue={search}
            flagStock={flagStock}
            brands={brands}
            selectedBrandId={brandId}
            categories={categories}
            selectedTaxonomyId={taxonomyId}
          />
        }
      />

      <main className="flex flex-1 flex-col gap-4 p-4 pt-0 lg:p-6 lg:pt-0">
        <div className="mx-auto grid w-full max-w-350 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="flex min-w-0 flex-col gap-4">
            <ProductViewSwitcher
              searchProps={{
                defaultValue: search,
                flagStock,
                brands,
                selectedBrandId: brandId,
                categories,
                selectedTaxonomyId: taxonomyId,
              }}
              grid={
                <ProductGrid
                  products={products}
                  orderId={effectiveOrderId}
                  isApiUnavailable={isProductApiUnavailable}
                />
              }
              list={
                <ProductList
                  products={products}
                  orderId={effectiveOrderId}
                  isApiUnavailable={isProductApiUnavailable}
                />
              }
            />

            {!isProductApiUnavailable && (
              <ProductLoadMoreV2
                currentLimit={productLimit}
                totalLoaded={products.length}
              />
            )}
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
