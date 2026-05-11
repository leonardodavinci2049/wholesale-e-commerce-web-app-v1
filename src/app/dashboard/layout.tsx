import { Suspense } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { AppSidebar } from "./_components/app-sidebar/app-sidebar";
import { AuthGate } from "./_components/auth-gate";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense
      fallback={
        <div className="brand-shell-surface flex min-h-screen items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <AuthGate>
        <TooltipProvider>
          <SidebarProvider className="bg-transparent">
            <AppSidebar />
            <SidebarInset className="brand-shell-surface">
              {children}
            </SidebarInset>
          </SidebarProvider>
        </TooltipProvider>
      </AuthGate>
    </Suspense>
  );
}
