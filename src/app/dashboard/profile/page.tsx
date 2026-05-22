import { notFound } from "next/navigation";
import { connection } from "next/server";
import { SiteHeaderWithBreadcrumb } from "@/components/dashboard/header/site-header-with-breadcrumb";
import { getAuthContext } from "@/server/auth-context";
import { getCustomerById } from "@/services/api-main/customer-general/customer-general-cached-service";
import { CustomerDetailHeader } from "./_components/customer-detail-header";
import { CustomerDetailSections } from "./_components/customer-detail-sections";

export default async function ProfilePage() {
  await connection();

  const { apiContext, session } = await getAuthContext();
  const customerId = session.user.personId ?? 0;

  if (customerId <= 0) {
    notFound();
  }

  const result = await getCustomerById(customerId, apiContext);

  if (!result) {
    notFound();
  }

  const { customer, seller } = result;

  return (
    <>
      <SiteHeaderWithBreadcrumb
        title="Meu Perfil"
        breadcrumbItems={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Meu Perfil", isActive: true },
        ]}
      />

      <div className="flex flex-1 flex-col">
        <div className="@container/main mx-auto w-full max-w-[1400px] flex-1 flex-col gap-6 px-4 lg:px-6 py-6">
          <CustomerDetailHeader customer={customer} />

          <div className="space-y-6">
            <CustomerDetailSections customer={customer} seller={seller} />
          </div>
        </div>
      </div>
    </>
  );
}
