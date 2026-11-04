import type { ReactNode } from "react";
import { APPROVED_AFFILIATE_PRODUCTS } from "@/lib/seo/affiliate-products";

interface Props {
  content: string;
}

export default function SeoArticleMarkdown({ content }: Props) {
  const blocks = content.trim().split(/\n\s*\n/);
  return (
    <div className="space-y-5">
      {blocks.map((block, index) => {
        const lines = block
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);
        if (!lines.length) return null;

        const heading = lines[0]?.match(/^(#{2,3})\s+(.+)$/);
        const headingLevel = heading?.[1];
        const headingText = heading?.[2];
        if (headingLevel && headingText && lines.length === 1) {
          const Heading = headingLevel.length === 2 ? "h2" : "h3";
          return (
            <Heading key={index} className="font-bold text-slate-900">
              {renderInline(headingText)}
            </Heading>
          );
        }

        if (lines.every((line) => /^[-*]\s+/.test(line))) {
          return (
            <ul key={index} className="list-disc space-y-2 pl-6 text-slate-700">
              {lines.map((line, itemIndex) => (
                <li key={itemIndex}>
                  {renderInline(line.replace(/^[-*]\s+/, ""))}
                </li>
              ))}
            </ul>
          );
        }

        if (lines.every((line) => /^\d+\.\s+/.test(line))) {
          return (
            <ol
              key={index}
              className="list-decimal space-y-2 pl-6 text-slate-700"
            >
              {lines.map((line, itemIndex) => (
                <li key={itemIndex}>
                  {renderInline(line.replace(/^\d+\.\s+/, ""))}
                </li>
              ))}
            </ol>
          );
        }

        return (
          <p key={index} className="text-slate-700">
            {renderInline(lines.join(" "))}
          </p>
        );
      })}
    </div>
  );
}

function renderInline(text: string): ReactNode[] {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    const label = link?.[1];
    const target = link?.[2];
    if (label && target) {
      const href = getSafeHref(target);
      return href ? (
        <a
          key={index}
          href={href}
          rel={href.startsWith("/") ? undefined : "sponsored nofollow noopener"}
          target={href.startsWith("/") ? undefined : "_blank"}
          className="text-orange-700 underline"
        >
          {label}
        </a>
      ) : (
        label
      );
    }

    const strong = part.match(/^\*\*([^*]+)\*\*$/);
    return strong ? <strong key={index}>{strong[1]}</strong> : part;
  });
}

function getSafeHref(href: string) {
  if (href.startsWith("/") && !href.startsWith("//") && !href.includes("..")) {
    return href;
  }
  if (!APPROVED_AFFILIATE_PRODUCTS.some((product) => product.url === href))
    return null;
  try {
    const url = new URL(href);
    return url.protocol === "https:" && !url.username && !url.password
      ? href
      : null;
  } catch {
    return null;
  }
}
