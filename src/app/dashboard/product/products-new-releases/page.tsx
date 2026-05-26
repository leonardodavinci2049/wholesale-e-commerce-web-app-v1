import DevelopmentPage from "@/components/common/DevelopmentPage";
import { SiteHeaderWithBreadcrumb } from "../../_components/header/site-header-with-breadcrumb";

const ProductsNewReleasesPage = () => {
  return (
    <>
      <SiteHeaderWithBreadcrumb
        title="Dashboard"
        breadcrumbItems={[
          { label: "Dashboard", href: "#" },
          { label: "Novos Lançamentos", isActive: true },
        ]}
      />
      <DevelopmentPage />
    </>
  );
};

export default ProductsNewReleasesPage;
