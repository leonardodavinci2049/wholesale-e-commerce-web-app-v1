import { FAQPageJsonLd } from "@/components/seo";
import { publicEnvs } from "@/core/config/envs.client";
import { createPageMetadata } from "@/lib/seo/metadata";
import { BenefitsSection } from "./_components/sections/benefits";
import { ContactSection } from "./_components/sections/contact";
import { CTASection } from "./_components/sections/cta";
import { FAQSection, RESELLER_FAQ_DATA } from "./_components/sections/faq";
import HeroSliderV2 from "./_components/sections/hero-slider-v2";
import { LocationSection } from "./_components/sections/location";
import { ProductsSection } from "./_components/sections/products";
import { StatsSection } from "./_components/sections/stats";
import { WhyChooseUsSection } from "./_components/sections/why-choose-us";

export const metadata = createPageMetadata({
  title: "Revenda atacadista em Ribeirao Preto | Mundial Megastore",
  description:
    "Cadastre sua empresa para comprar no atacado com a Mundial Megastore. Revenda eletronicos, informatica e perfumes importados com suporte comercial e loja fisica em Ribeirao Preto.",
  path: "/reseller",
  keywords: [
    "revenda atacadista ribeirao preto",
    "distribuidor de eletronicos",
    "atacado de perfumes importados",
  ],
});

const ResellerPage = () => {
  return (
    <main className="bg-background">
      <FAQPageJsonLd questions={RESELLER_FAQ_DATA} />
      <h1 className="sr-only">
        {publicEnvs.NEXT_PUBLIC_COMPANY_NAME} revenda atacadista e varejo
      </h1>
      <HeroSliderV2 />
      <StatsSection />
      <ProductsSection />
      <WhyChooseUsSection />
      <BenefitsSection />
      <FAQSection />
      <LocationSection />
      <CTASection />
      <ContactSection />
    </main>
  );
};

export default ResellerPage;
