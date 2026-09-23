import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import { formatPrice } from "@/data/properties";
import { getDevelopments, getProperties } from "@/data/server";

export async function generateStaticParams() {
  return (await getDevelopments()).map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/developments/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = (await getDevelopments()).find((x) => x.slug === slug);
  if (!d) return {};
  return { title: `${d.name}, ${d.location}`, description: d.strapline };
}

export default async function DevelopmentPage({
  params,
}: PageProps<"/developments/[slug]">) {
  const { slug } = await params;
  const d = (await getDevelopments()).find((x) => x.slug === slug);
  if (!d) notFound();

  const homes = (await getProperties()).filter(
    (p) =>
      p.status !== "Draft" &&
      p.development.toLowerCase().startsWith(d.name.toLowerCase()),
  );

  return (
    <>
      <section className="relative flex min-h-[80svh] items-end overflow-hidden">
        <Image
          src={d.hero}
          alt={`${d.name}, ${d.location}`}
          fill
          priority
          sizes="100vw"
          className="animate-kenburns object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/25 to-ink/10" />
        <div className="relative mx-auto w-full max-w-7xl px-6 pb-20 pt-40 lg:px-10">
          <Reveal>
            <p className="mb-6 text-xs uppercase tracking-[0.35em] text-sand">
              {d.location}
            </p>
            <h1 className="font-display max-w-3xl text-6xl font-medium leading-[1.02] text-white md:text-8xl">
              {d.name}
            </h1>
            <p className="mt-6 max-w-xl text-base text-white/85 md:text-lg">
              {d.strapline}
            </p>
            {homes.length > 0 && (
              <p className="mt-8 inline-block border border-white/40 px-5 py-2.5 text-[11px] uppercase tracking-[0.25em] text-white">
                {homes.filter((h) => h.status === "For Sale").length} of{" "}
                {homes.length} homes available
              </p>
            )}
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.4fr]">
          <Reveal>
            <p className="mb-6 text-xs uppercase tracking-[0.3em] text-rust">
              The development
            </p>
            <dl className="space-y-6 border-t border-mist pt-8">
              {d.facts.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-6 text-sm">
                  <dt className="uppercase tracking-[0.18em] text-ink/50">
                    {k}
                  </dt>
                  <dd className="text-right text-ink/80">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal delay={120}>
            <div className="space-y-6 text-base leading-loose text-ink/75">
              {d.description.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {homes.length > 0 && (
        <section className="bg-sage/10">
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
            <Reveal>
              <h2 className="font-display mb-12 text-4xl font-medium md:text-5xl">
                Homes at {d.name}
              </h2>
            </Reveal>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="border-b border-mist text-[11px] uppercase tracking-[0.2em] text-ink/50">
                    <th className="pb-4 pr-6 font-normal">Home</th>
                    <th className="pb-4 pr-6 font-normal">Beds</th>
                    <th className="pb-4 pr-6 font-normal">Guide price</th>
                    <th className="pb-4 font-normal">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {homes.map((p) => (
                    <tr
                      key={p.slug}
                      className="border-b border-mist/60 transition-colors hover:bg-white/60"
                    >
                      <td className="py-4 pr-6">
                        <Link
                          href={`/for-sale/${p.slug}`}
                          className="font-medium hover:text-rust"
                        >
                          {p.name}
                        </Link>
                      </td>
                      <td className="py-4 pr-6">{p.beds}</td>
                      <td className="py-4 pr-6">{formatPrice(p.price)}</td>
                      <td
                        className={`py-4 ${p.status === "For Sale" ? "text-rust" : "text-ink/50"}`}
                      >
                        {p.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <Reveal>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="mb-6 text-xs uppercase tracking-[0.3em] text-rust">
                Location
              </p>
              <h2 className="font-display text-4xl font-medium leading-tight md:text-5xl">
                The best of North Norfolk on your doorstep
              </h2>
              <ul className="mt-8 space-y-3 text-sm text-ink/70">
                {d.nearby.map((t) => (
                  <li key={t} className="flex items-center gap-3">
                    <span className="h-1 w-1 rounded-full bg-rust" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden border border-mist">
              <iframe
                title={`${d.name} location map`}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(d.mapQuery)}&output=embed`}
                className="absolute inset-0 h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </Reveal>
      </section>

      <section className="bg-sage text-white">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center lg:px-10 lg:py-28">
          <h2 className="font-display mx-auto max-w-2xl text-4xl font-medium leading-tight md:text-5xl">
            Interested in {d.name}?
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-white/80">
            Call{" "}
            <a href="tel:+447979997355" className="underline">
              07979 997355
            </a>{" "}
            or send us a message to arrange a viewing.
          </p>
          <Link
            href={`/contact?property=${encodeURIComponent(d.name)}`}
            className="mt-8 inline-block bg-white px-10 py-4 text-xs font-normal uppercase tracking-[0.2em] text-ink transition-colors hover:bg-sand"
          >
            Enquire
          </Link>
        </div>
      </section>
    </>
  );
}
