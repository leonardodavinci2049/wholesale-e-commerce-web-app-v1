import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import { auth } from "@/lib/auth/auth";

export default function UsersLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <UsersLayoutContent>{children}</UsersLayoutContent>
    </Suspense>
  );
}

async function UsersLayoutContent({ children }: { children: ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session == null) return redirect("/sign-in");
  if (session.user.role !== "admin") return redirect("/dashboard");

  return <>{children}</>;
}
