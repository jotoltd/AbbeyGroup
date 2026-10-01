import type { Metadata } from "next";

export const SITE_NAME = "The Abbey Group";
export const SITE_URL = "https://www.theabbeygroupnorfolk.com";
export const SITE_DESCRIPTION =
  "The Abbey Group creates design-led luxury homes across Norfolk. With over 50 years of combined experience in design and construction, we build exceptional residential spaces.";
export const SITE_LOCALE = "en_GB";
export const SITE_TITLE = `${SITE_NAME} | Fine Homes & Property Development, Norfolk`;

export const OG_IMAGE = {
  url: "/images/og-image.jpg",
  width: 1200,
  height: 630,
  alt: "The Abbey Group — fine homes and property development in Norfolk",
};

export const absoluteUrl = (path = "/") =>
  path.startsWith("http") ? path : `${SITE_URL}${path}`;

export function serializeJsonLd(data: object) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  "@id": absoluteUrl("/#organization"),
  name: SITE_NAME,
  legalName: "The Abbey Group (Norfolk) Ltd",
  url: SITE_URL,
  logo: absoluteUrl("/images/logo.png"),
  image: absoluteUrl(OG_IMAGE.url),
  email: "jonathan@theabbeygroupnorfolk.com",
  telephone: "+44 7979 997355",
  description: SITE_DESCRIPTION,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Office Building, Barons Hall Farm, Barons Hall Lane",
    addressLocality: "Fakenham",
    addressRegion: "Norfolk",
    postalCode: "NR21 8HB",
    addressCountry: "GB",
  },
  areaServed: "Norfolk, England",
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": absoluteUrl("/#website"),
  name: SITE_NAME,
  url: SITE_URL,
  publisher: { "@id": absoluteUrl("/#organization") },
};

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

// openGraph is shallow-merged in this Next.js version: any page that sets it
// replaces the layout's object entirely, so every page must emit all fields.
export function pageMetadata({
  title,
  description,
  path,
  image,
}: {
  title?: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: {
      title: title ? `${title} | ${SITE_NAME}` : SITE_TITLE,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      images: [image ?? OG_IMAGE],
      type: "website",
    },
  };
}
