"use client";

import Link from "next/link";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="mx-auto flex min-h-[70svh] max-w-7xl flex-col items-start justify-center px-6 pb-24 pt-40 lg:px-10">
      <p className="mb-6 text-xs uppercase tracking-[0.3em] text-rust">
        Something went wrong
      </p>
      <h1 className="font-display max-w-3xl text-5xl font-medium leading-[1.05] md:text-7xl">
        We couldn&rsquo;t load this page
      </h1>
      <p className="mt-8 max-w-xl text-base leading-relaxed text-ink/70">
        This is usually temporary. Try again, or call us on{" "}
        <a href="tel:+447979997355" className="text-rust hover:text-ink">
          07979 997355
        </a>{" "}
        if the problem continues.
      </p>
      <div className="mt-10 flex flex-wrap gap-4">
        <button
          onClick={reset}
          className="bg-rust px-8 py-4 text-xs font-normal uppercase tracking-[0.2em] text-white transition-colors hover:bg-copper hover:text-ink"
        >
          Try again
        </button>
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
