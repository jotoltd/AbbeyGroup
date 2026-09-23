import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { formatPrice, properties } from "@/data/properties";
import Gallery from "@/components/Lightbox";
import ViewingRequest from "@/components/ViewingRequest";

export function generateStaticParams() {
  return properties
    .filter((p) => p.status !== "Draft")
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/for-sale/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = properties.find((x) => x.slug === slug);
  if (!p) return {};
  return {
    title: `${p.name} — ${formatPrice(p.price)}`,
    description: `${p.beds}-bedroom ${p.type.toLowerCase()} at ${p.development}. ${p.status}.`,
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
  const p = properties.find((x) => x.slug === slug);
  if (!p || p.status === "Draft") notFound();

  return (
    <>
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
          <Link
            href="/for-sale"
            className="mb-6 inline-block text-xs uppercase tracking-[0.2em] text-white/70 hover:text-white"
          >
            ← Back to all homes
          </Link>
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
                {p.development}
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

      {/* Sticky mobile CTA */}
      <div className="print:hidden fixed inset-x-0 bottom-0 z-40 border-t border-mist bg-white/95 px-4 py-3 backdrop-blur md:hidden">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-display text-lg font-medium leading-tight">
              {p.name}
            </p>
            <p className="text-xs text-ink/60">{formatPrice(p.price)}</p>
          </div>
          <ViewingRequest slug={p.slug} property={p.name} compact />
        </div>
      </div>
    </>
  );
}
