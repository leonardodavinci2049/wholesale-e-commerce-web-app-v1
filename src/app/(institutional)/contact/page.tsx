import { ContactSection } from "@/app/(home)/_components/sections/contact";
import { LocationSection } from "@/app/(home)/_components/sections/location";
import { publicEnvs } from "@/core/config/envs.client";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: `Contato e loja fisica- ${publicEnvs.NEXT_PUBLIC_COMPANY_NAME}`,
  description: `Fale com a ${publicEnvs.NEXT_PUBLIC_COMPANY_NAME} pelo WhatsApp, telefone ou visite nossa loja fisica em ${publicEnvs.NEXT_PUBLIC_COMPANY_ADDRESS_LOCATION} para comprar ${publicEnvs.NEXT_PUBLIC_COMPANY_META_KEYWORDS} `,
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
