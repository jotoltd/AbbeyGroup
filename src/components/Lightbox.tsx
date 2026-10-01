"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export default function Gallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [open, setOpen] = useState<number | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const step = useCallback(
    (dir: -1 | 1) =>
      setOpen((i) =>
        i === null ? null : (i + dir + images.length) % images.length,
      ),
    [images.length],
  );

  const isOpen = open !== null;

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    const trigger = triggerRef.current;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      trigger?.focus();
      triggerRef.current = null;
    };
  }, [isOpen, step]);

  return (
    <>
      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {images.map((src, i) => (
          <button
            key={src}
            onClick={(e) => {
              triggerRef.current = e.currentTarget;
              setOpen(i);
            }}
            className={`relative cursor-zoom-in overflow-hidden ${
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
          role="dialog"
          aria-modal="true"
          aria-label={`${alt} photo gallery`}
          className="animate-[fadeIn_0.2s_ease-out] fixed inset-0 z-[70] flex cursor-zoom-out items-center justify-center bg-ink/90 p-6"
          onClick={() => setOpen(null)}
        >
          <button
            ref={closeRef}
            className="absolute right-6 top-6 p-2 text-2xl text-white/70 transition-colors hover:text-white"
            onClick={() => setOpen(null)}
            aria-label="Close gallery"
          >
            ✕
          </button>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 p-4 text-3xl text-white/70 transition-colors hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            aria-label="Previous photo"
          >
            ‹
          </button>
          <div
            className="relative h-[80vh] w-full max-w-5xl cursor-default"
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
            className="absolute right-4 top-1/2 -translate-y-1/2 p-4 text-3xl text-white/70 transition-colors hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            aria-label="Next photo"
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
