import Link from "next/link";

export default function Breadcrumbs({
  items,
  dark = false,
  className = "",
}: {
  items: { label: string; href?: string }[];
  dark?: boolean;
  className?: string;
}) {
  const link = dark
    ? "text-white/70 transition-colors hover:text-white"
    : "text-ink/50 transition-colors hover:text-ink";
  const current = dark ? "text-white" : "text-ink";
  const sep = dark ? "text-white/40" : "text-ink/30";

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.2em]">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-2">
              {i > 0 && (
                <span aria-hidden="true" className={sep}>
                  /
                </span>
              )}
              {item.href && !last ? (
                <Link href={item.href} className={link}>
                  {item.label}
                </Link>
              ) : (
                <span aria-current="page" className={current}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
