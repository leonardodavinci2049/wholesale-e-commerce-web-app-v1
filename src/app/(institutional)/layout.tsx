import type { Metadata } from "next";
import { Suspense } from "react";
import { companyInfo } from "@/data/info-company";

import FooterHome from "../(home)/_components/footer/FooterHome";
import { MainHeader } from "../(home)/_components/header/MainHeader";
import { MobileMainHeader } from "../(home)/_components/header/MobileMainHeader";

export const metadata: Metadata = {
  title: `Empresa - ${companyInfo.name}`,
};

export default async function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <MobileMainHeader />
      <MainHeader />

      <div className="grow">{children}</div>
      <Suspense fallback={<div>Loading...</div>}>
        <FooterHome />
      </Suspense>
    </div>
  );
}
