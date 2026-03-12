import type { FC } from "react";
import Link from "next/link";

interface LinkItem {
  href: string;
  label: string;
}

interface InternalLinksProps {
  title?: string;
  links: LinkItem[];
}

const InternalLinks: FC<InternalLinksProps> = ({
  title = "Explore More Renovation Resources",
  links,
}) => (
  <section className="py-8 border-t border-slate-200 mt-8">
    <h2 className="text-xl font-bold text-slate-900 mb-4">{title}</h2>
    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
      {links.map((link, idx) => (
        <li key={idx}>
          <Link
            href={link.href}
            className="block bg-white border border-slate-200 rounded-lg px-4 py-3 text-teal-700 font-medium hover:bg-teal-50 hover:border-teal-300 transition-colors text-sm"
          >
            → {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </section>
);

export default InternalLinks;
