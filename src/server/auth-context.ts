import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";

type AuthSession = NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>;

export type AuthContextWarning = {
  title: string;
  description: string;
};

export type AuthContext = {
  session: AuthSession;
  authWarning: AuthContextWarning | null;
  apiContext: {
    pe_system_client_id: number;
    pe_organization_id: string;
    pe_user_id: string;
    pe_user_name: string;
    pe_user_role: string;
    pe_person_id: number;
  };
};

export async function getAuthContext(): Promise<AuthContext> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");
  if (session.user.role !== "admin") {
    redirect("/sign-in?reason=access-denied");
  }

  return {
    session,
    authWarning: null,
    apiContext: {
      pe_system_client_id: 0,
      pe_organization_id: "0",
      pe_user_id: session.user.id ?? "0",
      pe_user_name: session.user.name ?? "",
      pe_user_role: session.user.role ?? "admin",
      pe_person_id: 0,
    },
  };
}
