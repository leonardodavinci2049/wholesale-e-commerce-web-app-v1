import { getOrganizationSchema } from "@/lib/seo/company";
import { JsonLdScript } from "@/lib/seo/json-ld";

/**
 * Componente para dados estruturados da Organização (Schema.org)
 * Melhora o SEO e permite Knowledge Panel no Google
 */
export function OrganizationJsonLd() {
  return <JsonLdScript data={getOrganizationSchema()} />;
}
