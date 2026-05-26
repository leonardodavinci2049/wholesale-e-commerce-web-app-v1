import DevelopmentPage from "@/components/common/DevelopmentPage";
import { SiteHeaderWithBreadcrumb } from "../../_components/header/site-header-with-breadcrumb";

const ProductsOnSalePage = () => {
  return (
    <>
      <SiteHeaderWithBreadcrumb
        title="Dashboard"
        breadcrumbItems={[
          { label: "Dashboard", href: "#" },
          { label: "Produtos Em Promoção", isActive: true },
        ]}
      />
      <DevelopmentPage />
    </>
  );
};

export default ProductsOnSalePage;
