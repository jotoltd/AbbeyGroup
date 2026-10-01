"use client";

import { useEffect, useState } from "react";
import ViewingRequest from "@/components/ViewingRequest";

export default function StickyCta({
  name,
  price,
  slug,
}: {
  name: string;
  price: string;
  slug: string;
}) {
  const [hidden, setHidden] = useState(false);

  // Slide the bar away when the footer is visible so it never covers links
  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const obs = new IntersectionObserver(([e]) => setHidden(e.isIntersecting));
    obs.observe(footer);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      className={`print:hidden fixed inset-x-0 bottom-0 z-40 border-t border-mist bg-white/95 px-4 py-3 shadow-[0_-4px_16px_rgba(30,30,30,0.08)] backdrop-blur transition-transform duration-300 md:hidden ${
        hidden ? "translate-y-full" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-display text-lg font-medium leading-tight">
            {name}
          </p>
          <p className="text-xs text-ink/60">{price}</p>
        </div>
        <ViewingRequest slug={slug} property={name} compact />
      </div>
    </div>
  );
}
