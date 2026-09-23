"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export default function Gallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [open, setOpen] = useState<number | null>(null);

  const step = useCallback(
    (dir: -1 | 1) =>
      setOpen((i) =>
        i === null ? null : (i + dir + images.length) % images.length,
      ),
    [images.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step]);

  return (
    <>
      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {images.map((src, i) => (
          <button
            key={src}
            onClick={() => setOpen(i)}
            className={`relative overflow-hidden ${
              i === 0 ? "aspect-[16/10] sm:col-span-2" : "aspect-[4/3]"
            }`}
          >
            <Image
              src={src}
              alt={`${alt} — photo ${i + 1}`}
              fill
              sizes="(min-width: 640px) 40vw, 100vw"
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          </button>
        ))}
      </div>

      {open !== null && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/90 p-6"
          onClick={() => setOpen(null)}
        >
          <button
            className="absolute right-6 top-6 text-2xl text-white/70 hover:text-white"
            onClick={() => setOpen(null)}
            aria-label="Close"
          >
            ✕
          </button>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 p-4 text-3xl text-white/70 hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            aria-label="Previous"
          >
            ‹
          </button>
          <div
            className="relative h-[80vh] w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[open]}
              alt={`${alt} — photo ${open + 1}`}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 p-4 text-3xl text-white/70 hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            aria-label="Next"
          >
            ›
          </button>
          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.25em] text-white/60">
            {open + 1} / {images.length}
          </p>
        </div>
      )}
    </>
  );
}
