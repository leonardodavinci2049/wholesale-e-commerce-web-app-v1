import type { Metadata } from "next";
import { Suspense } from "react";

import { fetchCategoriesAction } from "@/app/actions/product";
import { publicEnvs } from "@/core/config/envs.client";
import FooterHome from "../(home)/_components/_components/";
import { MobileBottomMenu } from "../_components/footer/MobileBottomMenu";
import { MainHeader } from "../(home)/_components/header/MainHeader";
import { MobileMainHeader } from "../(home)/_components/header/MobileMainHeader";
import { NavigationMenu } from "../(home)/_components/navegation/NavigationMenu";

export const metadata: Metadata = {
  title: `Empresa - ${publicEnvs.NEXT_PUBLIC_COMPANY_NAME}`,
};

export default async function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await fetchCategoriesAction();

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <MobileMainHeader />
      <MainHeader />
      <NavigationMenu />
      <div className="grow">{children}</div>
      <Suspense fallback={<div>Loading...</div>}>
        <FooterHome />
      </Suspense>
      <MobileBottomMenu categories={categories} />
    </div>
  );
}
