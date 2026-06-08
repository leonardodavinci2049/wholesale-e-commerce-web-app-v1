import { publicEnvs } from "@/core/config/envs.client";
import { JsonLdScript, SCHEMA_IDS } from "@/lib/seo/json-ld";

/**
 * Componente para dados estruturados do WebSite (Schema.org)
 * Habilita Sitelinks Search Box no Google
 */
export function WebSiteJsonLd() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": SCHEMA_IDS.website,
    name: publicEnvs.NEXT_PUBLIC_COMPANY_NAME,
    url: publicEnvs.NEXT_PUBLIC_BASE_URL_APP,
    description: publicEnvs.NEXT_PUBLIC_COMPANY_META_DESCRIPTION,
    publisher: {
      "@id": SCHEMA_IDS.organization,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${publicEnvs.NEXT_PUBLIC_BASE_URL_APP}/products?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return <JsonLdScript data={websiteSchema} />;
}
