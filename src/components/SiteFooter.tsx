import Link from "next/link";
import Image from "next/image";

export default function SiteFooter() {
  return (
    <footer className="border-t-2 border-white bg-sage text-white/75">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-10 md:grid-cols-3 lg:px-10">
        <div>
          <div className="relative mb-4 h-14 w-56 bg-white p-1.5">
            <Image
              src="/images/logo.png"
              alt="The Abbey Group"
              fill
              sizes="224px"
              className="object-contain object-left p-1.5"
            />
          </div>
          <p className="max-w-xs text-sm leading-relaxed">
            Fine homes and luxury property development across North Norfolk.
            Private viewings by appointment.
          </p>
        </div>

        <div>
          <h4 className="mb-5 text-xs font-normal uppercase tracking-[0.25em] text-copper">
            Explore
          </h4>
          <ul className="space-y-3 text-sm">
            {[
              ["Home", "/"],
              ["Our Story", "/our-story"],
              ["For Sale", "/for-sale"],
              ["New Projects", "/new-projects"],
              ["Contact", "/contact"],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="transition-colors hover:text-cream">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-5 text-xs font-normal uppercase tracking-[0.25em] text-copper">
            Contact
          </h4>
          <address className="space-y-3 text-sm not-italic leading-relaxed">
            <p>
              Wood Farm, Plumstead Road,
              <br />
              Edgefield, Norfolk, NR24 2AQ
            </p>
            <p>
              <a
                href="mailto:jonathan@theabbeygroupnorfolk.com"
                className="transition-colors hover:text-white"
              >
                jonathan@theabbeygroupnorfolk.com
              </a>
            </p>
            <p>
              <a
                href="tel:+447979997355"
                className="transition-colors hover:text-white"
              >
                +44 7979 997355
              </a>
            </p>
          </address>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="mx-auto max-w-7xl px-6 py-4 text-xs leading-relaxed text-white/50 lg:px-10">
          <p>
            © {new Date().getFullYear()} The Abbey Group (Norfolk) Ltd. All
            rights reserved. Registered in England and Wales (Company No.
            13424305).
          </p>
          <p>
            Registered office: Office Building, Barons Hall Farm, Barons Hall
            Lane, Fakenham, Norfolk, NR21 8HB.
          </p>
        </div>
      </div>
    </footer>
  );
}
