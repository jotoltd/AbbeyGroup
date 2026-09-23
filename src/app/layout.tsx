import type { Metadata } from "next";
import { Poppins, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://www.theabbeygroupnorfolk.com"),
  title: {
    default: "The Abbey Group | Fine Homes & Property Development, Norfolk",
    template: "%s | The Abbey Group",
  },
  description:
    "The Abbey Group creates design-led luxury homes across Norfolk. With over 50 years of combined experience in design and construction, we build exceptional residential spaces.",
  openGraph: {
    title: "The Abbey Group | Design-Led Property Development, Norfolk",
    description:
      "Design-led luxury property development in the heart of Norfolk.",
    images: ["/images/hero.jpg"],
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${display.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SiteNav />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
