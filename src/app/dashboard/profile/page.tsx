import { notFound } from "next/navigation";
import { connection } from "next/server";
import { SiteHeaderWithBreadcrumb } from "@/components/dashboard/header/site-header-with-breadcrumb";
import { getAuthContext } from "@/server/auth-context";
import { customerGeneralServiceApi } from "@/services/api-main/customer-general";
import {
  transformCustomerDetail,
  transformSellerInfo,
} from "@/services/api-main/customer-general/transformers/transformers";
import { CustomerDetailHeader } from "./_components/customer-detail-header";
import { CustomerDetailSections } from "./_components/customer-detail-sections";

export default async function ProfilePage() {
  await connection();

  const { apiContext, session } = await getAuthContext();
  const customerId = session.user.personId ?? 0;

  if (customerId <= 0) {
    notFound();
  }

  const response = await customerGeneralServiceApi.findCustomerById({
    pe_customer_id: customerId,
    ...apiContext,
  });
  const customerEntity =
    customerGeneralServiceApi.extractCustomerById(response);

  if (!customerEntity) {
    notFound();
  }

  const sellerEntity = customerGeneralServiceApi.extractSellerInfo(response);
  const customer = transformCustomerDetail(customerEntity);
  const seller = sellerEntity ? transformSellerInfo(sellerEntity) : null;

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
