import type { Metadata } from "next";
import { publicEnvs } from "@/core/config/envs.client";
import { companyInfo } from "@/data/info-company";
import { DEFAULT_OG_IMAGE_URL } from "./company";

interface PageMetadataOptions {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}

export function createPageMetadata({
  title,
  description,
  path,
  keywords = [],
}: PageMetadataOptions): Metadata {
  const absoluteUrl = new URL(
    path,
    publicEnvs.NEXT_PUBLIC_BASE_URL_APP,
  ).toString();

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url: absoluteUrl,
      siteName: companyInfo.name,
      title,
      description,
      images: [
        {
          url: DEFAULT_OG_IMAGE_URL,
          width: 1200,
          height: 630,
          alt: companyInfo.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_OG_IMAGE_URL],
    },
  };
}
