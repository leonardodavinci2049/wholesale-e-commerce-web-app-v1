import { getLocalBusinessSchema } from "@/lib/seo/company";
import { JsonLdScript } from "@/lib/seo/json-ld";

/**
 * Componente de Dados Estruturados JSON-LD para LocalBusiness
 * Complementa Organization com dados de loja física para SEO local
 *
 * @see https://schema.org/LocalBusiness
 * @see https://developers.google.com/search/docs/appearance/structured-data/local-business
 */
export function LocalBusinessJsonLd() {
  return <JsonLdScript data={getLocalBusinessSchema()} />;
}
