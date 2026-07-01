import type { Metadata } from "next";
import { companyInfo } from "@/data/info-company";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { publicEnvs } from "@/core/config/envs.client";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  metadataBase: new URL(publicEnvs.NEXT_PUBLIC_APP_URL),
  title: `${companyInfo.meta.titleMain} | ${companyInfo.meta.titleCaption}`,
  description: companyInfo.meta.description,
  applicationName: companyInfo.name,
  keywords: [companyInfo.meta.keywords],
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
      },
      {
        url: "/app-icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: companyInfo.name,
  },
  other: {
    "apple-mobile-web-app-title": companyInfo.name,
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: publicEnvs.NEXT_PUBLIC_APP_URL,
    siteName: companyInfo.name,
    title: `${companyInfo.meta.titleMain} | ${companyInfo.meta.titleCaption}`,
    description: companyInfo.meta.description,
    images: [
      {
        url: "/images/logo/logo-horizontal-header.png",
        width: 1200,
        height: 630,
        alt: companyInfo.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${companyInfo.meta.titleMain} | ${companyInfo.meta.titleCaption}`,
    description: companyInfo.meta.description,
    images: ["/images/logo/logo-horizontal-header.png"],
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning={true}
      className={cn("h-full", "antialiased", "font-sans")}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div>{children}</div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
