import { SiteHeaderWithBreadcrumb } from "@/components/dashboard/header/site-header-with-breadcrumb";

const BudgetListPage = () => {
  return (
    <>
      <SiteHeaderWithBreadcrumb
        title="Lista de Orçamentos"
        breadcrumbItems={[
          { label: "Dashboard", href: "#" },
          { label: "Lista de Orçamentos", isActive: true },
        ]}
      />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-6">
          <div className="flex flex-col gap-6 py-6">
            <div className="px-4 lg:px-6">
              <div className="space-y-6">
                {/* Cabeçalho */}
                <div>
                  <h1 className="text-3xl font-bold">Lista de Orçamentos</h1>
                  <p className="text-muted-foreground mt-2">
                    Confira seus orçamentos
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BudgetListPage;
