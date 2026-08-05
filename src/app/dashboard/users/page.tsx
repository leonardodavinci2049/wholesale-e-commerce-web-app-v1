import { headers } from "next/headers";
import { connection } from "next/server";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { auth } from "@/lib/auth/auth";
import { SiteHeaderWithBreadcrumb } from "../_components/header/site-header-with-breadcrumb";
import { AddCustomerUserDialog } from "./_components/add-customer-user-dialog";
import { UserSearch } from "./_components/user-search";
import { UserTable } from "./_components/user-table";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

async function UsersContent({
  searchParams: searchParamsPromise,
}: {
  searchParams: SearchParams;
}) {
  await connection();
  const searchParams = await searchParamsPromise;
  const session = await auth.api.getSession({ headers: await headers() });

  const searchTerm =
    typeof searchParams.search === "string" ? searchParams.search : undefined;

  const users = await auth.api.listUsers({
    headers: await headers(),
    query: {
      limit: 100,
      sortBy: "createdAt",
      sortDirection: "desc",
      ...(searchTerm
        ? {
            filterField: "name",
            filterValue: searchTerm,
            filterOperator: "contains",
          }
        : {}),
    },
  });

  return (
    <>
      <UserSearch />
      <UserTable users={users.users} selfId={session?.user.id ?? ""} />
    </>
  );
}

function UsersContentFallback() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-14 w-full max-w-sm" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

export default function UsersPage(props: { searchParams: SearchParams }) {
  return (
    <>
      <SiteHeaderWithBreadcrumb
        title="Dashboard"
        breadcrumbItems={[
          { label: "Dashboard", href: "" },
          { label: "Usuários", isActive: true },
        ]}
      />

      <div className="container mx-auto py-10 px-4 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold tracking-tight">Usuários</h1>
            <p className="text-muted-foreground">
              Gerencie contas de usuário, funções e permissões.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <AddCustomerUserDialog />
          </div>
        </div>

        <Suspense fallback={<UsersContentFallback />}>
          <UsersContent searchParams={props.searchParams} />
        </Suspense>
      </div>
    </>
  );
}
