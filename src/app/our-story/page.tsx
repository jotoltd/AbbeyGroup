import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import { content } from "@/data/content";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Design-led construction in Norfolk. The Abbey Group combines over 50 years of design and building experience.",
};

const process = [
  {
    n: "01",
    title: "Site Procurement",
    img: "/images/story-barn-20.jpg",
    body: "Having lived and worked in Norfolk our whole lives, we hold an intimate knowledge of the region's neighbourhoods, communities and architectural heritage. That deep-rooted connection lets us identify exceptional sites — hidden gems and untapped potential — with a profound respect for the local environment and the communities they sit within.",
  },
  {
    n: "02",
    title: "Design",
    img: "/images/story-barn-8.jpg",
    body: "Design-led construction is at the core of everything we do. Our in-house designer works hand-in-hand with our construction team, shaping concepts that captivate the imagination while aligning seamlessly with Norfolk's landscapes, architectural styles and local character.",
  },
  {
    n: "03",
    title: "Construction",
    img: "/images/story-barn-1.jpg",
    body: "Our builders and craftsmen take a meticulous approach to every home. From project management and the finest materials to sustainable, energy-efficient practices and the finishing touches that make a building a home — quality and attention to detail are upheld at every stage.",
  },
];

export default function OurStory() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pb-20 pt-40 lg:px-10 lg:pt-52">
        <Reveal>
          <p className="mb-6 text-xs uppercase tracking-[0.3em] text-rust">
            Our story
          </p>
          <h1 className="font-display max-w-4xl text-5xl font-medium leading-[1.05] md:text-7xl">
            Design-led construction,{" "}
            <em className="italic text-sage">rooted</em> in Norfolk
          </h1>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-16 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src="/images/story-barn-21.jpg"
              alt="Abbey Farm barn conversion"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="space-y-6 self-center text-base leading-relaxed text-ink/75">
            <p>{content.story.intro1}</p>
            <p>{content.story.intro2}</p>
            <p>{content.story.intro3}</p>
          </div>
        </div>
      </section>

      {/* Founders */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <Reveal>
          <div className="mb-16 text-center">
            <p className="mb-6 text-xs uppercase tracking-[0.3em] text-rust">
              The founders
            </p>
            <h2 className="font-display mx-auto max-w-2xl text-4xl font-medium leading-tight md:text-5xl">
              Designer and builder,{" "}
              <em className="italic text-sage">one team</em>
            </h2>
          </div>
        </Reveal>
        <div className="grid gap-10 md:grid-cols-2">
          {[
            {
              name: "Jonathan",
              role: "Co-founder",
              bio: content.story.founderJonathan,
            },
            {
              name: "Adam",
              role: "Co-founder",
              bio: content.story.founderAdam,
            },
          ].map((f, i) => (
            <Reveal key={f.name} delay={i * 120}>
              <div className="flex h-full gap-6 border border-mist bg-white/60 p-8">
                <div className="font-display flex h-16 w-16 shrink-0 items-center justify-center bg-sage text-2xl italic text-white">
                  {f.name[0]}
                </div>
                <div>
                  <h3 className="text-lg font-normal">{f.name}</h3>
                  <p className="mb-3 text-[11px] uppercase tracking-[0.2em] text-rust">
                    {f.role}
                  </p>
                  <p className="text-sm leading-relaxed text-ink/70">{f.bio}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={100}>
          <div className="mt-16 grid gap-8 border-y border-mist py-10 text-center sm:grid-cols-3">
            {[
              ["50+", "Years combined experience"],
              ["2", "Signature Norfolk developments"],
              ["100%", "Design-led, built in-house"],
            ].map(([stat, labelText]) => (
              <div key={labelText}>
                <p className="font-display text-5xl font-medium text-sage">
                  {stat}
                </p>
                <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-ink/50">
                  {labelText}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="bg-sage/15">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-36">
          <p className="mb-6 text-xs uppercase tracking-[0.3em] text-rust">
            Our process
          </p>
          <h2 className="font-display mb-20 max-w-2xl text-4xl font-medium leading-tight md:text-5xl">
            From the first sketch to the final finish
          </h2>

          <div className="space-y-24">
            {process.map((step, i) => (
              <Reveal key={step.n}>
              <div
                className={`grid items-center gap-12 lg:grid-cols-2 ${
                  i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div className="relative aspect-[16/11] overflow-hidden">
                  <Image
                    src={step.img}
                    alt={step.title}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-display mb-4 text-2xl italic text-rust">
                    {step.n}
                  </p>
                  <h3 className="font-display mb-6 text-3xl font-medium md:text-4xl">
                    {step.title}
                  </h3>
                  <p className="text-base leading-relaxed text-ink/75">
                    {step.body}
                  </p>
                </div>
              </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 text-center lg:px-10 lg:py-36">
        <h2 className="font-display mx-auto max-w-3xl text-4xl font-medium leading-tight md:text-5xl">
          Shaping the future of Norfolk&rsquo;s architectural landscape
        </h2>
        <Link
          href="/for-sale"
          className="mt-10 inline-block bg-ink px-10 py-4 text-xs font-normal uppercase tracking-[0.2em] text-cream transition-colors hover:bg-rust"
        >
          See our homes
        </Link>
      </section>
    </>
  );
}
