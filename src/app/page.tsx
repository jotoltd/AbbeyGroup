import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import RotatingWord from "@/components/RotatingWord";
import { content } from "@/data/content";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-svh items-end overflow-hidden">
        <Image
          src="/images/hero.jpg"
          alt="Wood Farm, Edgefield from the air"
          fill
          priority
          sizes="100vw"
          className="animate-kenburns object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-ink/10" />
        <div className="relative mx-auto w-full max-w-7xl px-6 pb-24 pt-40 lg:px-10">
          <Reveal>
            <h1 className="font-display max-w-5xl text-6xl font-medium leading-[1.02] text-white md:text-[7rem]">
              Exceptional{" "}
              <RotatingWord
                words={["homes", "barns", "farmhouses", "estates"]}
                className="text-sand"
              />
              <br />
              in the Norfolk countryside
            </h1>
          </Reveal>
          <Reveal delay={150}>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
              {content.home.heroSubline}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/for-sale"
                className="bg-rust px-8 py-4 text-xs font-normal uppercase tracking-[0.2em] text-white transition-colors hover:bg-copper hover:text-ink"
              >
                Explore our properties
              </Link>
              <Link
                href="/our-story"
                className="border border-white/60 px-8 py-4 text-xs font-normal uppercase tracking-[0.2em] text-white transition-colors hover:bg-white hover:text-ink"
              >
                Our story
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Intro */}
      <section className="relative overflow-hidden">
        <Image
          src="/images/contact-img.png"
          alt=""
          fill
          sizes="100vw"
          className="object-contain object-bottom opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/70 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-36">
          <div className="grid items-start gap-16 lg:grid-cols-2">
            <Reveal>
              <p className="mb-6 text-xs uppercase tracking-[0.3em] text-rust">
                About The Abbey Group
              </p>
              <h2 className="font-display text-5xl font-medium leading-[1.05] md:text-6xl">
                Fifty years of craft,{" "}
                <em className="italic text-sage">one vision</em> for Norfolk
              </h2>
            </Reveal>
            <Reveal delay={150}>
              <div className="space-y-6 text-base leading-loose text-ink/75">
                <p>{content.home.aboutP1}</p>
                <p>{content.home.aboutP2}</p>
                <Link
                  href="/our-story"
                  className="inline-block border-b border-rust pb-1 text-xs uppercase tracking-[0.2em] text-rust transition-colors hover:text-ink"
                >
                  Learn more about us
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Image strip */}
      <section className="grid gap-1 px-1 md:grid-cols-3">
        {[
          {
            src: "/images/barn-12.jpg",
            alt: "Abbey Farm Barns interior",
            caption: "Abbey Farm Barns, Alby",
          },
          {
            src: "/images/barn-9.jpg",
            alt: "Abbey Farm Barns living space",
            caption: "Open-plan living",
          },
          {
            src: "/images/barn-14.jpg",
            alt: "Abbey Farm Barns detail",
            caption: "Crafted detail",
          },
        ].map((img, i) => (
          <Reveal key={img.src} delay={i * 120} className="h-full">
            <figure className="group relative aspect-[4/3] h-full overflow-hidden">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <figcaption className="absolute bottom-0 left-0 bg-ink/55 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                {img.caption}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </section>

      {/* Developments */}
      <section className="bg-sage text-white">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-36">
          <Reveal>
            <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="mb-6 text-xs uppercase tracking-[0.3em] text-sand">
                  Current developments
                </p>
                <h2 className="font-display text-5xl font-medium leading-[1.05] md:text-6xl">
                  Places worth <em className="italic">calling home</em>
                </h2>
              </div>
              <Link
                href="/for-sale"
                className="border-b border-white pb-1 text-xs uppercase tracking-[0.2em] transition-colors hover:text-sand"
              >
                View all for sale
              </Link>
            </div>
          </Reveal>

          <div className="grid gap-10 md:grid-cols-2">
            <Reveal>
              <Link href="/developments/wood-farm" className="group block">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src="/images/project-1.jpeg"
                    alt="Wood Farm, Edgefield"
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute left-5 top-5 bg-white px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-ink">
                    Now selling
                  </span>
                </div>
                <div className="mt-6 flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-3xl font-medium">
                    Wood Farm, Edgefield
                  </h3>
                  <p className="shrink-0 text-sm text-white/70">
                    £545k – £1.095m
                  </p>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-white/75">
                  Fifteen individually designed homes within 27 acres of North
                  Norfolk countryside, minutes from Holt.
                </p>
              </Link>
            </Reveal>

            <Reveal delay={150}>
              <Link href="/developments/abbey-farm" className="group block">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src="/images/story-barn-1.jpg"
                    alt="Abbey Farm, Alby"
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute left-5 top-5 bg-white px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-ink">
                    Final homes remaining
                  </span>
                </div>
                <div className="mt-6 flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-3xl font-medium">
                    Abbey Farm, Alby
                  </h3>
                  <p className="shrink-0 text-sm text-white/70">£475k – £1m+</p>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-white/75">
                  A collection of beautifully converted barns blending rustic
                  character with modern comfort.
                </p>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-36">
        <div className="grid gap-12 md:grid-cols-3">
          {[
            {
              n: "01",
              title: "Design first",
              body: "Every project begins with design. Our in-house team shapes homes that are beautiful, functional and tailored to their setting.",
            },
            {
              n: "02",
              title: "Built by us",
              body: "Designers and builders working seamlessly together, controlling the entire process from concept to completion.",
            },
            {
              n: "03",
              title: "Rooted in Norfolk",
              body: "A deep understanding of the local landscape and a commitment to the region's rich architectural heritage.",
            },
          ].map((v, i) => (
            <Reveal key={v.n} delay={i * 120}>
              <div className="border-t border-mist pt-8">
                <p className="font-display mb-6 text-2xl italic text-rust">
                  {v.n}
                </p>
                <h3 className="mb-4 text-lg font-normal uppercase tracking-[0.15em]">
                  {v.title}
                </h3>
                <p className="text-sm leading-relaxed text-ink/70">{v.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <Image
          src="/images/story-barn-21.jpg"
          alt="Abbey Farm barn conversion"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-sage/80" />
        <div className="relative mx-auto max-w-7xl px-6 py-28 text-center lg:px-10 lg:py-40">
          <Reveal>
            <h2 className="font-display mx-auto max-w-3xl text-5xl font-medium leading-[1.05] text-white md:text-7xl">
              Find your <em className="italic">place</em> in the Norfolk
              countryside
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base text-white/85">
              Get in touch to discuss our current developments and forthcoming
              releases.
            </p>
            <Link
              href="/contact"
              className="mt-10 inline-block bg-white px-10 py-4 text-xs font-normal uppercase tracking-[0.2em] text-ink transition-colors hover:bg-sand"
            >
              Contact us
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
