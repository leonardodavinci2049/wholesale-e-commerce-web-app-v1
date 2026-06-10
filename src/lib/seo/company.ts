import { publicEnvs } from "@/core/config/envs.client";
import { companyInfo } from "@/data/info-company";
import { PAYMENT_ACCEPTED_SCHEMA } from "@/data/payment-methods";
import { SCHEMA_IDS } from "./json-ld";

const HOURS_SEPARATOR = /\s*-\s*/;
const GEO_PATTERN = /@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/;
const POSTAL_CODE_PATTERN = /\b\d{5}-?\d{3}\b/;
const REGION_PATTERN = /,\s*([A-Z]{2})\b/;

function splitOpeningHours(
  hours: string,
  fallbackOpen: string,
  fallbackClose: string,
) {
  const [opens = fallbackOpen, closes = fallbackClose] = hours
    .split(HOURS_SEPARATOR)
    .map((value) => value.trim())
    .filter(Boolean);

  return { opens, closes };
}

function getRegionFromLocation() {
  return companyInfo.addressLocation.match(REGION_PATTERN)?.[1];
}

function getPostalCodeFromAddress() {
  const match = companyInfo.address.match(POSTAL_CODE_PATTERN);

  return match?.[0]?.replace(/(\d{5})(\d{3})/, "$1-$2");
}

function getGeoFromMapsUrl() {
  const match = companyInfo.links.mapsEmbedUrl.match(GEO_PATTERN);

  if (!match) {
    return undefined;
  }

  return {
    "@type": "GeoCoordinates",
    latitude: Number(match[1]),
    longitude: Number(match[2]),
  };
}

export const COMPANY_LOGO_URL = `${publicEnvs.NEXT_PUBLIC_BASE_URL_APP}/images/logo/logo-horizontal-header.png`;

export const DEFAULT_OG_IMAGE_URL = `${publicEnvs.NEXT_PUBLIC_BASE_URL_APP}/opengraph-image`;

export const COMPANY_SAME_AS = [
  companyInfo.links.facebookUrl,
  companyInfo.links.instagramUrl,
  companyInfo.links.linktreeUrl,
  companyInfo.links.whatsappUrl,
].filter(Boolean);

export const COMPANY_POSTAL_ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: companyInfo.address,
  addressLocality: companyInfo.addressLocation,
  addressRegion: getRegionFromLocation(),
  postalCode: getPostalCodeFromAddress(),
  addressCountry: "BR",
};

export const COMPANY_CONTACT_POINTS = [
  {
    "@type": "ContactPoint",
    telephone: companyInfo.phone,
    email: companyInfo.email,
    contactType: "sales",
    areaServed: "BR",
    availableLanguage: ["pt-BR", "Portuguese"],
    url: `${publicEnvs.NEXT_PUBLIC_BASE_URL_APP}/contact`,
  },
  {
    "@type": "ContactPoint",
    telephone: companyInfo.whatsapp,
    contactType: "customer service",
    areaServed: "BR",
    availableLanguage: ["pt-BR", "Portuguese"],
    url: companyInfo.links.whatsappUrl,
  },
];

export const COMPANY_OPENING_HOURS = [
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    ...splitOpeningHours(companyInfo.openingHours, "08:00", "18:00"),
  },
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: "Saturday",
    ...splitOpeningHours(companyInfo.openingSaturday, "08:00", "12:00"),
  },
];

export function getCompanyGeo() {
  return getGeoFromMapsUrl();
}

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": SCHEMA_IDS.organization,
    name: companyInfo.name,
    url: publicEnvs.NEXT_PUBLIC_BASE_URL_APP,
    logo: COMPANY_LOGO_URL,
    image: COMPANY_LOGO_URL,
    description: companyInfo.about,
    email: companyInfo.email,
    telephone: companyInfo.phone,
    taxID: companyInfo.cnpj,
    sameAs: COMPANY_SAME_AS,
    contactPoint: COMPANY_CONTACT_POINTS,
    address: COMPANY_POSTAL_ADDRESS,
    foundingDate: companyInfo.yearFoundation,
  };
}

export function getLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Store",
    "@id": SCHEMA_IDS.localBusiness,
    name: companyInfo.name,
    url: publicEnvs.NEXT_PUBLIC_BASE_URL_APP,
    image: COMPANY_LOGO_URL,
    logo: COMPANY_LOGO_URL,
    description: companyInfo.about,
    email: companyInfo.email,
    telephone: companyInfo.phone,
    taxID: companyInfo.cnpj,
    address: COMPANY_POSTAL_ADDRESS,
    geo: getCompanyGeo(),
    hasMap: companyInfo.links.mapsEmbedUrl,
    sameAs: COMPANY_SAME_AS,
    parentOrganization: {
      "@id": SCHEMA_IDS.organization,
    },
    openingHoursSpecification: COMPANY_OPENING_HOURS,
    priceRange: "$$",
    currenciesAccepted: "BRL",
    paymentAccepted: PAYMENT_ACCEPTED_SCHEMA,
  };
}
