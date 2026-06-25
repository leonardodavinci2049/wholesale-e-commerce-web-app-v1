import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import FooterAuth from "@/components/auth/common/FooterAuth";
import HeaderAuth from "@/components/auth/common/HeaderAuth";
import { auth } from "@/lib/auth/auth";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-transparent">
      {/* Main Content */}
      <HeaderAuth />

      <Suspense
        fallback={<div className="flex flex-1 items-center justify-center" />}
      >
        <AuthLayoutContent>{children}</AuthLayoutContent>
      </Suspense>

      {/* Footer */}
      <FooterAuth />
    </div>
  );
}

async function AuthLayoutContent({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session != null) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-1 items-center justify-center">{children}</div>
  );
}
