import { ArrowLeft } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/lib/auth/auth";
import { AccountService } from "@/services/db/account/account.service";
import { SessionService } from "@/services/db/session/session.service";
import { UserAuthService } from "@/services/db/user/user.service";

import { SiteHeaderWithBreadcrumb } from "../../_components/header/site-header-with-breadcrumb";
import { UserAccountsCard } from "./_components/security/user-accounts-card";
import { UserPasswordCard } from "./_components/security/user-password-card";
import { UserSessionsCard } from "./_components/security/user-sessions-card";
import { UserDeletion } from "./_components/user-deletion";
import { UserDetailsCard } from "./_components/user-details-card";

type Params = Promise<{ id: string }>;

export default async function UserPage({ params }: { params: Params }) {
  await connection();
  const { id } = await params;

  const session = await auth.api.getSession({ headers: await headers() });

  if (session == null) return redirect("/sign-in");

  const userResponse = await UserAuthService.findUserById({ userId: id });
  const user = userResponse.data;

  const sessionsResponse = await SessionService.findSessionsByUserId({
    userId: id,
  });
  const sessions = sessionsResponse.data || [];

  const accountsResponse = await AccountService.findAccountsByUserId({
    userId: id,
  });
  const accounts = accountsResponse.data || [];

  if (!user) {
    return notFound();
  }

  return (
    <>
      <SiteHeaderWithBreadcrumb
        title={user.name || "Usuário"}
        breadcrumbItems={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Usuários", href: "/dashboard/users" },
          { label: user.name || "Detalhes", isActive: true },
        ]}
      />

      <div className="container mx-auto py-10 px-4 space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
            <p className="text-muted-foreground">
              Gerencie as informações deste usuário.
            </p>
          </div>
          <Link href="/dashboard/users">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
          </Link>
        </div>

        <div className="space-y-6">
          <UserDetailsCard user={user} />

          <Tabs defaultValue="configuracoes" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto md:h-9">
              <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
              <TabsTrigger value="sessoes">Sessões</TabsTrigger>
              <TabsTrigger value="contas">Contas</TabsTrigger>
              <TabsTrigger value="senha">Senha</TabsTrigger>
              <TabsTrigger value="excluir">Excluir</TabsTrigger>
            </TabsList>

            <TabsContent value="configuracoes" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações</CardTitle>
                  <CardDescription>
                    Ajustar as preferências do usuário. Recurso em
                    desenvolvimento.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Em breve</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sessoes" className="space-y-4 pt-4">
              <UserSessionsCard sessions={sessions} />
            </TabsContent>

            <TabsContent value="contas" className="pt-4">
              <UserAccountsCard accounts={accounts} />
            </TabsContent>

            <TabsContent value="senha" className="space-y-4 pt-4">
              <div className="md:w-1/2">
                <UserPasswordCard email={user.email} />
              </div>
            </TabsContent>

            <TabsContent value="excluir" className="pt-4">
              <UserDeletion
                userId={user.id}
                userName={user.name || "Usuário"}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
