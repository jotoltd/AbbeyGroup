import Image from "next/image";
import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with The Abbey Group to discuss our current Norfolk developments.",
};

export default async function Contact({
  searchParams,
}: PageProps<"/contact">) {
  const { property } = await searchParams;
  const subject =
    typeof property === "string" && property
      ? `Viewing enquiry — ${property}`
      : "";
  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pb-16 pt-40 lg:px-10 lg:pt-52">
        <p className="mb-6 text-xs uppercase tracking-[0.3em] text-rust">
          Contact us
        </p>
        <h1 className="font-display max-w-3xl text-5xl font-medium leading-[1.08] md:text-7xl">
          Let&rsquo;s talk about your next home
        </h1>
        <p className="mt-8 max-w-2xl text-base leading-relaxed text-ink/70">
          Get in touch today to discuss our current developments, arrange a
          viewing or register your interest in forthcoming releases.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-10 lg:pb-36">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <dl className="space-y-8">
              <div>
                <dt className="mb-2 text-xs uppercase tracking-[0.25em] text-ink/50">
                  Visit
                </dt>
                <dd className="text-base leading-relaxed text-ink/80">
                  Wood Farm, Plumstead Road,
                  <br />
                  Edgefield, Norfolk, NR24 2AQ
                </dd>
              </div>
              <div>
                <dt className="mb-2 text-xs uppercase tracking-[0.25em] text-ink/50">
                  Email
                </dt>
                <dd>
                  <a
                    href="mailto:jonathan@theabbeygroupnorfolk.com"
                    className="text-base text-rust hover:text-ink"
                  >
                    jonathan@theabbeygroupnorfolk.com
                  </a>
                </dd>
              </div>
              <div>
                <dt className="mb-2 text-xs uppercase tracking-[0.25em] text-ink/50">
                  Call
                </dt>
                <dd>
                  <a
                    href="tel:+447979997355"
                    className="text-base text-rust hover:text-ink"
                  >
                    +44 7979 997355
                  </a>
                </dd>
              </div>
            </dl>

            <div className="relative mt-12 aspect-[4/3] overflow-hidden">
              <Image
                src="/images/contact-img.png"
                alt="The Abbey Group"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="border border-mist bg-white/60 p-8 lg:p-12">
            <h2 className="font-display mb-8 text-3xl font-medium">
              Send us a message
            </h2>
            <ContactForm defaultSubject={subject} />
          </div>
        </div>
      </section>
    </>
  );
}
