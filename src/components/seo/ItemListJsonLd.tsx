import { publicEnvs } from "@/core/config/envs.client";
import { JsonLdScript } from "@/lib/seo/json-ld";

interface ItemListProduct {
  name: string;
  url: string;
  image?: string;
  position?: number;
}

interface ItemListJsonLdProps {
  name: string;
  items: ItemListProduct[];
}

/**
 * Componente de Dados Estruturados JSON-LD para ItemList
 * Gera schema ItemList para grids de produtos em listagens e categorias
 *
 * @see https://schema.org/ItemList
 * @see https://developers.google.com/search/docs/appearance/structured-data/carousel
 */
export function ItemListJsonLd({ name, items }: ItemListJsonLdProps) {
  const baseUrl = publicEnvs.NEXT_PUBLIC_BASE_URL_APP;

  const toAbsoluteUrl = (url: string) =>
    url.startsWith("http") ? url : `${baseUrl}${url}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: item.position ?? index + 1,
      url: toAbsoluteUrl(item.url),
      name: item.name,
      item: {
        "@type": "Product",
        name: item.name,
        url: toAbsoluteUrl(item.url),
        ...(item.image ? { image: toAbsoluteUrl(item.image) } : {}),
      },
    })),
  };

  return <JsonLdScript data={jsonLd} />;
}
