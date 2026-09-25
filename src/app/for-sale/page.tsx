import type { Metadata } from "next";
import PropertyGrid from "@/components/PropertyGrid";
import Reveal from "@/components/Reveal";
import { getProperties } from "@/data/server";

export const metadata: Metadata = {
  title: "For Sale",
  description:
    "Luxury barn conversions and homes for sale in Norfolk — Wood Farm, Edgefield and Abbey Farm, Alby.",
};

export default async function ForSale() {
  const properties = await getProperties();
  return (
    <section className="mx-auto max-w-7xl px-6 pb-24 pt-40 lg:px-10 lg:pt-52">
      <Reveal>
        <p className="mb-6 text-xs uppercase tracking-[0.3em] text-rust">
          For sale
        </p>
        <h1 className="font-display max-w-4xl text-5xl font-medium leading-[1.05] md:text-7xl">
          A collection of <em className="italic text-sage">fine homes</em>
        </h1>
        <p className="mt-8 max-w-2xl text-base leading-relaxed text-ink/70">
          Two-to-five bedroom new-builds and barn conversions at Wood Farm,
          Edgefield and Abbey Farm, Alby — guide prices from £475,000 to
          £1,495,000. Private viewings by appointment.
        </p>
      </Reveal>

      <div className="mt-16">
        <PropertyGrid
          properties={properties
            .filter((p) => p.status !== "Draft")
            .sort((a, b) => Number(b.featured) - Number(a.featured))}
        />
      </div>
    </section>
  );
}
