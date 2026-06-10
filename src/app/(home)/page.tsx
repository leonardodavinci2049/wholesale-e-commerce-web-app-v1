import { FAQPageJsonLd } from "@/components/seo";
import { companyInfo } from "@/core/config-tenant/info-company";
import { createPageMetadata } from "@/lib/seo/metadata";
import { HomeMobileBottomBar } from "./_components/home-mobile-bottom-bar";
import { BenefitsSection } from "./_components/sections/benefits";
import { ContactSection } from "./_components/sections/contact";
import { CTASection } from "./_components/sections/cta";
import { FAQSection, RESELLER_FAQ_DATA } from "./_components/sections/faq";
import HeroSliderV2 from "./_components/sections/hero-slider-v2";
import { LocationSection } from "./_components/sections/location";
import { ProductsServicesSection } from "./_components/sections/products-services";
import { StatsSection } from "./_components/sections/stats";
import { WhyChooseUsSection } from "./_components/sections/why-choose-us";

export const metadata = createPageMetadata({
  title: companyInfo.meta.title,
  description: companyInfo.meta.description,
  path: "/",
  keywords: [companyInfo.meta.keywords],
});

const HomePage = () => {
  return (
    <main className="bg-background pb-[calc(env(safe-area-inset-bottom)+5rem)] md:pb-0">
      <FAQPageJsonLd questions={RESELLER_FAQ_DATA} />
      <h1 className="sr-only">
        {companyInfo.name} revenda atacadista e varejo
      </h1>
      <HeroSliderV2 />
      <StatsSection />
      <ProductsServicesSection />
      <WhyChooseUsSection />
      <BenefitsSection />
      <FAQSection />
      <LocationSection />
      <CTASection />
      <ContactSection />
      <HomeMobileBottomBar />
    </main>
  );
};

export default HomePage;
