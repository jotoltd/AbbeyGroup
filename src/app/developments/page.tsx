import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import Breadcrumbs from "@/components/Breadcrumbs";
import { developmentLabel } from "@/data/developments";
import { getDevelopments } from "@/data/server";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Developments",
  description:
    "Current and past developments by The Abbey Group — Wood Farm, Edgefield and Abbey Farm, Alby, in the heart of North Norfolk.",
  path: "/developments",
});

export default async function Developments() {
  const developments = await getDevelopments();
  return (
    <section className="mx-auto max-w-7xl px-6 pb-24 pt-40 lg:px-10 lg:pt-52">
      <Reveal>
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Developments" }]}
          className="mb-10"
        />
        <p className="mb-6 text-xs uppercase tracking-[0.3em] text-rust">
          Developments
        </p>
        <h1 className="font-display max-w-4xl text-5xl font-medium leading-[1.05] md:text-7xl">
          Places worth <em className="italic text-sage">calling home</em>
        </h1>
        <p className="mt-8 max-w-2xl text-base leading-relaxed text-ink/70">
          Every Abbey Group development begins with the land — carefully chosen
          Norfolk sites, thoughtfully designed and built entirely in-house.
        </p>
      </Reveal>

      <div className="mt-16 grid gap-10 md:grid-cols-2">
        {developments.map((d, i) => (
          <Reveal key={d.slug} delay={i * 120}>
            <Link
              href={`/developments/${d.slug}`}
              className="group block"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-mist">
                <Image
                  src={d.hero}
                  alt={developmentLabel(d)}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="mt-6 flex items-baseline justify-between gap-4">
                <h2 className="font-display text-3xl font-medium transition-colors group-hover:text-rust">
                  {d.name}
                </h2>
                <p className="shrink-0 text-sm text-ink/60">{d.location}</p>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">
                {d.strapline}
              </p>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
