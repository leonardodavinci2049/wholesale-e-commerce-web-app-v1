import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { auth } from "@/lib/auth/auth";
import { SiteHeaderWithBreadcrumb } from "../_components/header/site-header-with-breadcrumb";
import { CreateUserDialog } from "./_components/create-user-dialog";
import { UserSearch } from "./_components/user-search";
import { UserTable } from "./_components/user-table";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function UsersPage(props: { searchParams: SearchParams }) {
  await connection();
  const searchParams = await props.searchParams;
  const session = await auth.api.getSession({ headers: await headers() });

  if (session == null) return redirect("/sign-in");

  const hasAccess = await auth.api.userHasPermission({
    headers: await headers(),
    body: { permissions: { user: ["list"] } },
  });

  if (!hasAccess.success) return redirect("/");

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
          <CreateUserDialog />
        </div>

        <UserSearch />
        <UserTable users={users.users} selfId={session.user.id} />
      </div>
    </>
  );
}
