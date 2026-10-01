import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { formatPrice } from "@/data/properties";
import { getDevelopments, getProperties } from "@/data/server";
import Breadcrumbs from "@/components/Breadcrumbs";
import Gallery from "@/components/Lightbox";
import StickyCta from "@/components/StickyCta";
import ViewingRequest from "@/components/ViewingRequest";
import JsonLd from "@/components/JsonLd";
import {
  SITE_LOCALE,
  SITE_NAME,
  absoluteUrl,
  breadcrumbJsonLd,
} from "@/lib/seo";

export async function generateStaticParams() {
  return (await getProperties())
    .filter((p) => p.status !== "Draft")
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/for-sale/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = (await getProperties()).find((x) => x.slug === slug);
  if (!p) return {};
  const title = `${p.name} — ${formatPrice(p.price)}`;
  const description = `${p.beds}-bedroom ${p.type.toLowerCase()} at ${p.development}. ${p.status}.`;
  return {
    title,
    description,
    alternates: { canonical: `/for-sale/${p.slug}` },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: `/for-sale/${p.slug}`,
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      images: [p.img],
      type: "website",
    },
  };
}

const badge: Record<string, string> = {
  "For Sale": "bg-sage text-white",
  "Sold STC": "bg-ink/80 text-white",
  Sold: "bg-ink/60 text-white",
  Draft: "bg-mist text-ink",
};

export default async function PropertyPage({
  params,
}: PageProps<"/for-sale/[slug]">) {
  const { slug } = await params;
  const p = (await getProperties()).find((x) => x.slug === slug);
  if (!p || p.status === "Draft") notFound();

  const development = (await getDevelopments()).find((d) =>
    p.development.toLowerCase().startsWith(d.name.toLowerCase()),
  );
  const more = (await getProperties())
    .filter((x) => x.slug !== p.slug && x.status !== "Draft")
    .sort(
      (a, b) =>
        Number(b.development === p.development) -
        Number(a.development === p.development),
    )
    .slice(0, 3);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: `${p.name}, ${p.development}`,
          description: p.blurb,
          image: Array.from(new Set([p.img, ...p.gallery])).map(absoluteUrl),
          category: p.type,
          additionalProperty: [
            {
              "@type": "PropertyValue",
              name: "Bedrooms",
              value: p.beds,
            },
          ],
          offers: {
            "@type": "Offer",
            url: absoluteUrl(`/for-sale/${p.slug}`),
            priceCurrency: "GBP",
            price: p.price,
            availability:
              p.status === "For Sale"
                ? "https://schema.org/InStock"
                : "https://schema.org/SoldOut",
            seller: { "@id": absoluteUrl("/#organization") },
          },
        }}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "For Sale", path: "/for-sale" },
          { name: p.name, path: `/for-sale/${p.slug}` },
        ])}
      />
      <section className="relative flex min-h-[70svh] items-end">
        <Image
          src={p.img}
          alt={p.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/20 to-ink/10" />
        <div className="relative mx-auto w-full max-w-7xl px-6 pb-16 pt-40 lg:px-10">
          <Breadcrumbs
            dark
            className="mb-6"
            items={[
              { label: "Home", href: "/" },
              { label: "For Sale", href: "/for-sale" },
              { label: p.name },
            ]}
          />
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <span
                className={`mb-4 inline-block px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] ${badge[p.status]}`}
              >
                {p.status}
              </span>
              <h1 className="font-display text-5xl font-medium leading-none text-white md:text-7xl">
                {p.name}
              </h1>
              <p className="mt-3 text-sm uppercase tracking-[0.2em] text-white/75">
                {development ? (
                  <Link
                    href={`/developments/${development.slug}`}
                    className="underline-offset-4 transition-colors hover:text-white hover:underline"
                  >
                    {p.development}
                  </Link>
                ) : (
                  p.development
                )}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-[0.25em] text-white/60">
                Guide price
              </p>
              <p className="font-display text-4xl font-medium text-white md:text-5xl">
                {formatPrice(p.price)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <div className="grid gap-16 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <h2 className="font-display mb-6 text-3xl font-medium md:text-4xl">
              About this home
            </h2>
            <p className="max-w-2xl text-base leading-loose text-ink/75">
              {p.blurb}
            </p>

            {p.gallery.length > 0 && <Gallery images={p.gallery} alt={p.name} />}
          </div>

          <aside className="h-fit border border-mist bg-white p-8 lg:sticky lg:top-28">
            <h3 className="mb-6 text-xs font-normal uppercase tracking-[0.25em] text-ink/50">
              Key details
            </h3>
            <dl className="space-y-4 text-sm">
              {[
                ["Guide price", formatPrice(p.price)],
                ["Bedrooms", String(p.beds)],
                ["Type", p.type],
                ["Development", p.development],
                ["Status", p.status],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex justify-between gap-4 border-b border-mist pb-4"
                >
                  <dt className="uppercase tracking-[0.15em] text-ink/50">
                    {k}
                  </dt>
                  <dd className="text-right text-ink">{v}</dd>
                </div>
              ))}
            </dl>
            <ViewingRequest slug={p.slug} property={p.name} />
            <a
              href="tel:+447979997355"
              className="mt-3 block border border-ink/20 px-6 py-4 text-center text-xs font-normal uppercase tracking-[0.2em] text-ink transition-colors hover:border-ink"
            >
              Call 07979 997355
            </a>
            <p className="mt-6 text-center text-[11px] uppercase tracking-[0.18em] text-ink/45">
              Private viewings by appointment
              {p.development.startsWith("Wood Farm") && " · via Savills"}
            </p>
          </aside>
        </div>
      </section>

      {more.length > 0 && (
        <section className="bg-sage/10">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
            <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
              <h2 className="font-display text-4xl font-medium md:text-5xl">
                More homes
              </h2>
              <Link
                href="/for-sale"
                className="border-b border-ink/30 pb-1 text-xs uppercase tracking-[0.2em] text-ink/70 transition-colors hover:text-rust"
              >
                View all for sale
              </Link>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((x) => (
                <Link
                  key={x.slug}
                  href={`/for-sale/${x.slug}`}
                  className="group block"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-mist">
                    <Image
                      src={x.img}
                      alt={x.name}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-4 flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-2xl font-medium transition-colors group-hover:text-rust">
                      {x.name}
                    </h3>
                    <p className="shrink-0 text-sm text-ink/70">
                      {formatPrice(x.price)}
                    </p>
                  </div>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-ink/50">
                    {x.development}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sticky mobile CTA */}
      <StickyCta name={p.name} price={formatPrice(p.price)} slug={p.slug} />
    </>
  );
}
