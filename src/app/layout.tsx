import type { Metadata, Viewport } from "next";
import { Poppins, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import {
  OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_LOCALE,
  SITE_NAME,
  SITE_URL,
  organizationJsonLd,
  websiteJsonLd,
} from "@/lib/seo";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

// Revalidate prerendered pages periodically as a safety net; admin saves
// also call revalidatePath for instant updates.
export const revalidate = 300;

export const viewport: Viewport = {
  themeColor: "#747d71",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Fine Homes & Property Development, Norfolk`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: `${SITE_NAME} | Design-Led Property Development, Norfolk`,
    description:
      "Design-led luxury property development in the heart of Norfolk.",
    url: "/",
    siteName: SITE_NAME,
    locale: SITE_LOCALE,
    images: [OG_IMAGE],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-GB"
      className={`${poppins.variable} ${display.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-5 focus:py-3 focus:text-xs focus:uppercase focus:tracking-[0.2em] focus:text-white"
        >
          Skip to content
        </a>
        <JsonLd data={organizationJsonLd} />
        <JsonLd data={websiteJsonLd} />
        <SiteNav />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
