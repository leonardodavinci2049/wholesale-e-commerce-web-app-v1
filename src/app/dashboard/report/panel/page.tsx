import { Suspense } from "react";
import { SiteHeaderWithBreadcrumb } from "@/app/dashboard/_components/header/site-header-with-breadcrumb";
import { ReportPanelContent } from "./_components/report-panel-content";
import { SectionCards } from "./_components/section-cards";

const Page = () => {
  return (
    <>
      <SiteHeaderWithBreadcrumb
        title="Dashboard"
        breadcrumbItems={[
          { label: "Dashboard", href: "#" },
          { label: "Relatório Geral", isActive: true },
        ]}
      />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <Suspense>
              <SectionCards />
            </Suspense>
            <Suspense>
              <ReportPanelContent />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
