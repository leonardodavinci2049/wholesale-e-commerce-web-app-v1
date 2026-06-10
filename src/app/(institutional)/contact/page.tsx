import { ContactSection } from "@/app/(home)/_components/sections/contact";
import { LocationSection } from "@/app/(home)/_components/sections/location";
import { companyInfo } from "@/core/config-tenant/info-company";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: `Contato e loja fisica- ${companyInfo.name}`,
  description: `Fale com a ${companyInfo.name} pelo WhatsApp, telefone ou visite nossa loja fisica em ${companyInfo.addressLocation} para comprar ${companyInfo.meta.keywords} `,
  path: "/contact",
  keywords: ["contato", "loja fisica"],
});

export default function ContactPage() {
  return (
    <main>
      <ContactSection />
      {/* Location Section */}
      <LocationSection />
    </main>
  );
}
