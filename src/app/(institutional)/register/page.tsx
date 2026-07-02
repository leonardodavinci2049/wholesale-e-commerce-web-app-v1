import { FAQPageJsonLd } from "@/components/seo";
import { companyInfo } from "@/data/info-company";
import { createPageMetadata } from "@/lib/seo/metadata";
import { REGISTER_FAQ_DATA } from "./_components/register-faq";
import { RegisterLandingContent } from "./_components/register-landing-content";

export const metadata = createPageMetadata({
  title: `Cadastro de Revendedor Atacado - ${companyInfo.name}`,
  description: `Faça seu pré-cadastro na ${companyInfo.name} para comprar produtos no atacado, acessar catálogo exclusivo e receber atendimento comercial para revenda.`,
  path: "/register",
  keywords: [
    "cadastro de revendedor",
    "atacado",
    "distribuidora",
    "eletrônicos",
    "informática",
    "peças para celular",
    "Ribeirão Preto",
  ],
});

export default function RegisterPage() {
  return (
    <>
      <FAQPageJsonLd questions={REGISTER_FAQ_DATA} />
      <RegisterLandingContent />
    </>
  );
}
