import { headers } from "next/headers";
import { connection } from "next/server";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { auth } from "@/lib/auth/auth";
import { SiteHeaderWithBreadcrumb } from "../_components/header/site-header-with-breadcrumb";
import { AddCustomerUserDialog } from "./_components/add-customer-user-dialog";
import { UserSearch } from "./_components/user-search";
import { UserTable } from "./_components/user-table";
import { UsersMobileBottomBar } from "./_components/users-mobile-bottom-bar";

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

function SiteHeaderFallback() {
  return (
    <header className="flex h-(--header-height) w-full shrink-0 items-center border-b border-border/60 bg-background/50 px-4 lg:px-6">
      <Skeleton className="size-9 rounded-full" />
      <Skeleton className="mx-auto h-8 w-36 md:mx-4 md:h-4 md:w-44" />
      <div className="ml-auto flex gap-2">
        <Skeleton className="size-9 rounded-full" />
        <Skeleton className="size-9 rounded-full" />
      </div>
    </header>
  );
}

export default function UsersPage(props: { searchParams: SearchParams }) {
  return (
    <>
      <Suspense fallback={<SiteHeaderFallback />}>
        <SiteHeaderWithBreadcrumb
          title="Dashboard"
          breadcrumbItems={[
            { label: "Dashboard", href: "" },
            { label: "Usuários", isActive: true },
          ]}
        />
      </Suspense>

      <div className="container mx-auto space-y-3 px-4 pt-4 pb-[calc(env(safe-area-inset-bottom)+5rem)] md:space-y-6 md:pt-10 md:pb-10">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5 md:gap-1">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Usuários
            </h1>
            <p className="text-sm leading-snug text-muted-foreground md:text-base md:leading-normal">
              Gerencie contas de usuário, funções e permissões.
            </p>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <AddCustomerUserDialog />
          </div>
        </div>

        <Suspense fallback={<UsersContentFallback />}>
          <UsersContent searchParams={props.searchParams} />
        </Suspense>
      </div>

      <UsersMobileBottomBar />
    </>
  );
}
