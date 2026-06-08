import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { publicEnvs } from "@/core/config/envs.client";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  metadataBase: new URL(publicEnvs.NEXT_PUBLIC_APP_URL),
  title: `${publicEnvs.NEXT_PUBLIC_COMPANY_META_TITLE_MAIN} | ${publicEnvs.NEXT_PUBLIC_COMPANY_META_TITLE_CAPTION}`,
  description: publicEnvs.NEXT_PUBLIC_COMPANY_META_DESCRIPTION,
  keywords: [publicEnvs.NEXT_PUBLIC_COMPANY_META_KEYWORDS],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: publicEnvs.NEXT_PUBLIC_APP_URL,
    siteName: publicEnvs.NEXT_PUBLIC_COMPANY_NAME,
    title: `${publicEnvs.NEXT_PUBLIC_COMPANY_META_TITLE_MAIN} | ${publicEnvs.NEXT_PUBLIC_COMPANY_META_TITLE_CAPTION}`,
    description: publicEnvs.NEXT_PUBLIC_COMPANY_META_DESCRIPTION,
    images: [
      {
        url: "/images/logo/logo-horizontal-header.png",
        width: 1200,
        height: 630,
        alt: publicEnvs.NEXT_PUBLIC_COMPANY_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${publicEnvs.NEXT_PUBLIC_COMPANY_META_TITLE_MAIN} | ${publicEnvs.NEXT_PUBLIC_COMPANY_META_TITLE_CAPTION}`,
    description: publicEnvs.NEXT_PUBLIC_COMPANY_META_DESCRIPTION,
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
