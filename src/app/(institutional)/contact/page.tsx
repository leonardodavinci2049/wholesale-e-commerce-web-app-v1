import { ContactSection } from "@/app/(home)/_components/sections/contact";
import { LocationSection } from "@/app/(home)/_components/sections/location";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Contato e loja fisica | Mundial Megastore Ribeirao Preto",
  description:
    "Fale com a Mundial Megastore pelo WhatsApp, telefone ou visite nossa loja fisica em Ribeirao Preto para comprar informatica, eletronicos e perfumes importados.",
  path: "/contact",
  keywords: [
    "contato mundial megastore",
    "loja de informatica em ribeirao preto",
    "whatsapp mundial megastore",
  ],
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
