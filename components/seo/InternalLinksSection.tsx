import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface LinkItem {
  href: string;
  label: string;
}

interface InternalLinksSectionProps {
  title?: string;
  links: LinkItem[];
  columns?: 2 | 3 | 4;
}

export default function InternalLinksSection({
  title = "Explore More Renovation Resources",
  links,
  columns = 3,
}: InternalLinksSectionProps) {
  const gridClass =
    columns === 4
      ? "grid-cols-2 sm:grid-cols-4"
      : columns === 3
      ? "grid-cols-2 sm:grid-cols-3"
      : "grid-cols-1 sm:grid-cols-2";

  return (
    <section className="py-12 px-4 bg-gray-50 border-t border-gray-100">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{title}</h2>
        <div className={`grid ${gridClass} gap-3`}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center justify-between gap-2 px-4 py-3 bg-white rounded-xl border border-gray-200 hover:border-rose-300 hover:bg-rose-50 transition-all group text-sm font-medium text-gray-700 hover:text-rose-600"
            >
              <span>{link.label}</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
