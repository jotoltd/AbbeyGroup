"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { formatPrice, type Property } from "@/data/properties";

const badge: Record<Property["status"], string> = {
  "For Sale": "bg-sage text-white",
  "Sold STC": "bg-ink/80 text-white",
  Sold: "bg-ink/60 text-white",
  Draft: "bg-mist text-ink",
};

function BedIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-4 w-4"
      aria-hidden
    >
      <path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6M3 18h18M3 18v2m18-2v2M6 10V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-4 w-4"
      aria-hidden
    >
      <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

const statuses = ["All", "Available", "Sold/STC"];

export default function PropertyGrid({
  properties,
}: {
  properties: Property[];
}) {
  const [dev, setDev] = useState("All");
  const [status, setStatus] = useState("All");
  const developments = [
    "All",
    ...Array.from(new Set(properties.map((p) => p.development))),
  ];

  const filtered = properties.filter(
    (p) =>
      (dev === "All" || p.development === dev) &&
      (status === "All" ||
        (status === "Available" ? p.status === "For Sale" : p.status !== "For Sale")),
  );

  const selectCls =
    "border border-mist bg-white px-4 py-3 text-xs uppercase tracking-[0.18em] text-ink focus:border-rust focus:outline-none";

  return (
    <>
      <div className="mb-12 flex flex-wrap gap-4">
        <select
          value={dev}
          onChange={(e) => setDev(e.target.value)}
          className={selectCls}
          aria-label="Filter by development"
        >
          {developments.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className={selectCls}
          aria-label="Filter by status"
        >
          {statuses.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <p className="self-center text-xs uppercase tracking-[0.18em] text-ink/50">
          {filtered.length} {filtered.length === 1 ? "home" : "homes"}
        </p>
      </div>

      <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <Link
            key={p.slug}
            href={`/for-sale/${p.slug}`}
            className="group block"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-mist">
              <Image
                src={p.img}
                alt={p.name}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {p.gallery[1] && (
                <Image
                  src={p.gallery[1]}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
              )}
              <span
                className={`absolute left-4 top-4 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] ${badge[p.status]}`}
              >
                {p.status}
              </span>
            </div>
            <div className="mt-4 flex items-baseline justify-between gap-3">
              <h3 className="font-display text-2xl font-medium transition-colors group-hover:text-rust">
                {p.name}
              </h3>
              <p className="shrink-0 text-sm text-ink/70">
                <span className="mr-1 text-[10px] uppercase tracking-[0.15em] text-ink/45">
                  Guide price
                </span>
                {formatPrice(p.price)}
              </p>
            </div>
            <div className="mt-2 flex items-center gap-4 text-[11px] uppercase tracking-[0.15em] text-ink/50">
              <span className="flex items-center gap-1.5">
                <PinIcon />
                {p.development}
              </span>
              <span className="flex items-center gap-1.5">
                <BedIcon />
                {p.beds} bed
              </span>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-16 text-center text-sm text-ink/50">
          No homes match those filters.
        </p>
      )}
    </>
  );
}
