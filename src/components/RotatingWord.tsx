"use client";

import { useEffect, useState } from "react";

export default function RotatingWord({
  words,
  className = "",
}: {
  words: string[];
  className?: string;
}) {
  const [i, setI] = useState(0);
  const prev = (i - 1 + words.length) % words.length;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((v) => (v + 1) % words.length), 3000);
    return () => clearInterval(t);
  }, [words.length]);

  return (
    <>
      <span className="sr-only">{words[0]}</span>
      {/* All words share one grid cell so the heading never reflows as they
          rotate — the em is always the width of the longest word. */}
      <em aria-hidden="true" className={`inline-grid ${className}`}>
        {words.map((word, idx) => (
          <span
            key={word}
            className={`col-start-1 row-start-1 whitespace-nowrap transition-all duration-300 ease-out ${
              idx === i
                ? "translate-y-0 opacity-100"
                : idx === prev
                  ? "-translate-y-2 opacity-0"
                  : "translate-y-2 opacity-0"
            }`}
          >
            {word}
          </span>
        ))}
      </em>
    </>
  );
}
