
import { SiteHeaderWithBreadcrumb } from "./_components/header/site-header-with-breadcrumb";

export default function DashboardPage() {
  return (
    <>
      <SiteHeaderWithBreadcrumb
        title="Dashboard"
        breadcrumbItems={[
          { label: "Dashboard", href: "#" },
          { label: "Indicates", isActive: true },
        ]}
      />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-6">
          <div className="flex flex-col gap-6 py-6">
            <div className="px-4 lg:px-6">
              <div className="space-y-6">
                {/* Cabeçalho */}
                <div>
                  <h1 className="text-3xl font-bold">Lista de Produtos</h1>
         
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
