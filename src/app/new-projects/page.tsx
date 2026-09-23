import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "New Projects — Wood Farm, Edgefield",
  description:
    "Fifteen luxury homes from £545,000 to £1,095,000 at Wood Farm, Edgefield — now available through Savills.",
};

export default function NewProjects() {
  return (
    <>
      <section className="relative flex min-h-[85svh] items-end">
        <Image
          src="/images/project-1.jpeg"
          alt="Wood Farm, Edgefield"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/25 to-ink/10" />
        <div className="relative mx-auto w-full max-w-7xl px-6 pb-20 pt-40 lg:px-10">
          <Reveal>
            <p className="mb-6 text-xs uppercase tracking-[0.35em] text-sand">
              Current release
            </p>
            <h1 className="font-display max-w-3xl text-6xl font-medium leading-[1.05] text-white md:text-8xl">
              Wood Farm, <em className="italic">Edgefield</em>
            </h1>
            <p className="mt-6 max-w-xl text-base text-white/85 md:text-lg">
              15 luxury homes from £545,000 to £1,095,000 — now available
              through Savills.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-36">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="mb-6 text-xs uppercase tracking-[0.3em] text-rust">
              The development
            </p>
            <h2 className="font-display text-4xl font-medium leading-tight md:text-5xl">
              27 acres of North Norfolk countryside
            </h2>
            <dl className="mt-12 space-y-6 border-t border-mist pt-8">
              {[
                ["Location", "Edgefield, three miles from Holt"],
                ["Collection", "15 individually designed homes"],
                ["Guide price", "£545,000 – £1,095,000"],
                ["Agent", "Savills"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-6 text-sm">
                  <dt className="uppercase tracking-[0.18em] text-ink/50">
                    {k}
                  </dt>
                  <dd className="text-right text-ink/80">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="space-y-6 text-base leading-relaxed text-ink/75">
            <p>
              Set within 27 acres of beautiful North Norfolk countryside, Wood
              Farm is an exclusive collection of fifteen individually designed
              homes, combining the character of traditional Norfolk barns with
              the comfort, efficiency and quality expected of modern luxury
              living.
            </p>
            <p>
              Located in the sought-after village of Edgefield, just three
              miles from Holt and a short drive from the renowned North Norfolk
              coastline, Wood Farm offers a rare opportunity to enjoy a
              peaceful rural lifestyle without compromising on convenience.
            </p>
            <p>
              The development comprises a carefully curated mix of extensively
              renovated barn conversions and newly created homes — every
              property finished to an exceptional standard with high-quality
              materials, energy-efficient construction, premium specifications
              and generous outdoor space.
            </p>
            <p>
              Extensive landscaping, native tree planting and carefully
              considered design have transformed the former farmstead into a
              distinctive collection of homes that respect their rural setting
              while delivering modern standards of living.
            </p>
            <p>
              Just minutes from Holt and within easy reach of Blakeney, Cley,
              Wells-next-the-Sea and the wider North Norfolk coast, residents
              can enjoy some of the region&rsquo;s finest restaurants, beaches,
              countryside walks and independent shops.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-1 px-1 md:grid-cols-2">
        {[
          "/images/story-barn-20.jpg",
          "/images/barn-12.jpg",
          "/images/story-barn-8.jpg",
          "/images/barn-14.jpg",
        ].map((src) => (
          <div key={src} className="relative aspect-[16/10] overflow-hidden">
            <Image
              src={src}
              alt="Wood Farm home"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        ))}
      </section>

      {/* Location */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <Reveal>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="mb-6 text-xs uppercase tracking-[0.3em] text-rust">
                Location
              </p>
              <h2 className="font-display text-4xl font-medium leading-tight md:text-5xl">
                Minutes from Holt, close to the coast
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-ink/75">
                Edgefield sits three miles from the Georgian market town of
                Holt, with Blakeney, Cley and Wells-next-the-Sea all within
                easy reach along the North Norfolk coast.
              </p>
              <ul className="mt-8 space-y-3 text-sm text-ink/70">
                {[
                  "Holt — 3 miles",
                  "Blakeney & Cley — ~15 mins",
                  "Wells-next-the-Sea — ~25 mins",
                  "Norwich — ~40 mins",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-3">
                    <span className="h-1 w-1 rounded-full bg-rust" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden border border-mist">
              <iframe
                title="Wood Farm, Edgefield location map"
                src="https://maps.google.com/maps?q=Wood%20Farm%2C%20Plumstead%20Road%2C%20Edgefield%2C%20Norfolk%20NR24%202AQ&output=embed"
                className="absolute inset-0 h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </Reveal>
      </section>

      <section className="bg-sage text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 md:grid-cols-2 lg:px-10 lg:py-32">
          <div>
            <h2 className="font-display text-4xl font-medium leading-tight md:text-5xl">
              Register your interest
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-white/75">
              With homes ranging from £545,000 to £1,095,000, Wood Farm is a
              unique opportunity to own a beautifully crafted home in one of
              North Norfolk&rsquo;s most desirable locations.
            </p>
          </div>
          <address className="space-y-4 self-center text-base not-italic leading-relaxed text-white/80">
            <p>
              Wood Farm, Plumstead Road,
              <br />
              Edgefield, Norfolk, NR24 2AQ
            </p>
            <p>
              <a href="tel:+447979997355" className="hover:text-white">
                07979 997355
              </a>
            </p>
            <p>
              <a
                href="mailto:jonathan@theabbeygroupnorfolk.com"
                className="hover:text-white"
              >
                jonathan@theabbeygroupnorfolk.com
              </a>
            </p>
            <Link
              href="/contact"
              className="mt-4 inline-block bg-white px-8 py-4 text-xs font-normal uppercase tracking-[0.2em] text-ink transition-colors hover:bg-sand"
            >
              Enquire now
            </Link>
          </address>
        </div>
      </section>
    </>
  );
}
