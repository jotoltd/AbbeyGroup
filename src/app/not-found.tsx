import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70svh] max-w-7xl flex-col items-start justify-center px-6 pb-24 pt-40 lg:px-10">
      <p className="mb-6 text-xs uppercase tracking-[0.3em] text-rust">
        404 — Page not found
      </p>
      <h1 className="font-display max-w-3xl text-5xl font-medium leading-[1.05] md:text-7xl">
        This page has moved or no longer exists
      </h1>
      <p className="mt-8 max-w-xl text-base leading-relaxed text-ink/70">
        The home or page you were looking for may have been sold or removed.
        Browse our current properties or get in touch and we&rsquo;ll help you
        find what you need.
      </p>
      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          href="/for-sale"
          className="bg-rust px-8 py-4 text-xs font-normal uppercase tracking-[0.2em] text-white transition-colors hover:bg-copper hover:text-ink"
        >
          View homes for sale
        </Link>
        <Link
          href="/"
          className="border border-ink/20 px-8 py-4 text-xs font-normal uppercase tracking-[0.2em] text-ink transition-colors hover:border-ink"
        >
          Back to home
        </Link>
      </div>
    </section>
  );
}
