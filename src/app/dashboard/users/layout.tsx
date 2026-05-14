import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { auth } from "@/lib/auth/auth";

export default async function UsersLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session == null) return redirect("/sign-in");
  if (session.user.role !== "admin") return redirect("/dashboard");

  return <>{children}</>;
}
