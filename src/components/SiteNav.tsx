"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/our-story", label: "Our Story" },
  { href: "/for-sale", label: "For Sale" },
  { href: "/new-projects", label: "New Projects" },
  { href: "/contact", label: "Contact" },
];

export default function SiteNav() {
  const pathname = usePathname();
  const [menu, setMenu] = useState({ open: false, path: pathname });
  if (menu.path !== pathname) setMenu({ open: false, path: pathname });
  const open = menu.open;
  const setOpen = (v: boolean) => setMenu({ open: v, path: pathname });
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b border-mist bg-white/95 backdrop-blur transition-all duration-300 ${
        scrolled || open ? "shadow-sm" : ""
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Link
          href="/"
          className="relative block h-14 w-56 shrink-0 md:h-20 md:w-80"
        >
          <Image
            src="/images/logo.png"
            alt="The Abbey Group"
            fill
            sizes="320px"
            className="object-contain object-left"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`nav-link text-[13px] font-normal uppercase tracking-[0.18em] transition-colors ${
                pathname === l.href
                  ? "active text-rust"
                  : "text-ink/70 hover:text-ink"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="bg-sage px-5 py-2 text-[13px] uppercase tracking-[0.18em] text-white transition-colors hover:bg-sage-dark"
          >
            Enquire
          </Link>
        </nav>

        <button
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span
            className={`h-px w-6 bg-ink transition-transform ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
          />
          <span
            className={`h-px w-6 bg-ink transition-transform ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`}
          />
        </button>
      </div>

      {open && (
        <nav className="border-t border-mist bg-cream px-6 pb-6 pt-2 md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`block border-b border-mist py-4 text-sm uppercase tracking-[0.18em] ${
                pathname === l.href ? "text-rust" : "text-ink/80"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
