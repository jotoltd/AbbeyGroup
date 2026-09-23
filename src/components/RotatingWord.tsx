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
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setI((v) => (v + 1) % words.length);
        setFading(false);
      }, 350);
    }, 3000);
    return () => clearInterval(t);
  }, [words.length]);

  return (
    <em
      className={`inline-block italic transition-all duration-300 ${
        fading ? "-translate-y-2 opacity-0" : "translate-y-0 opacity-100"
      } ${className}`}
    >
      {words[i]}
    </em>
  );
}
