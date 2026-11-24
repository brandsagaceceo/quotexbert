import type {
  SearchConsolePageMetric,
  SearchConsolePageQueryMetric,
} from "@/lib/google-admin-metrics";

export interface SeoKnownPage {
  path: string;
  title: string;
  intents: string[];
  articleId?: string;
}

export interface SeoOpportunity {
  path: string;
  title: string;
  articleId: string | null;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  previousClicks: number | null;
  previousImpressions: number | null;
  recommendation: string;
  reasons: string[];
  supportingQueries: string[];
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/^https?:\/\/[^/]+/, "")
    .replace(/\/+$/, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function pagePath(value: string) {
  try {
    return new URL(value).pathname.replace(/\/+$/, "") || "/";
  } catch {
    return (value.split("?")[0] || "/").replace(/\/+$/, "") || "/";
  }
}

function overlapsIntent(query: string, page: SeoKnownPage) {
  const normalized = normalize(query);
  return page.intents.some((intent) => {
    const known = normalize(intent);
    return known === normalized || known.includes(normalized);
  });
}

export function buildSeoOpportunities(
  pages: SearchConsolePageMetric[],
  previousPages: SearchConsolePageMetric[],
  pageQueries: SearchConsolePageQueryMetric[],
  knownPages: SeoKnownPage[],
): SeoOpportunity[] {
  const knownByPath = new Map(
    knownPages.map((page) => [page.path.replace(/\/+$/, "") || "/", page]),
  );
  const previousByPath = new Map(
    previousPages.map((row) => [pagePath(row.page), row]),
  );

  return pages
    .map((metrics) => {
      const path = pagePath(metrics.page);
      const known = knownByPath.get(path);
      if (!known || metrics.impressions <= 0) return null;
      const reasons: string[] = [];
      if (metrics.clicks > 0)
        reasons.push("This published page is already earning Google clicks.");
      if (metrics.impressions >= 20 && metrics.ctr < 0.03)
        reasons.push(
          "High impressions and a low CTR indicate a title or description improvement opportunity.",
        );
      if (metrics.position >= 4 && metrics.position <= 20)
        reasons.push(
          "Average position is between 4 and 20, within practical improvement range.",
        );
      if (!reasons.length) return null;

      const related = pageQueries
        .filter((row) => pagePath(row.page) === path && row.impressions > 0)
        .sort(
          (a, b) =>
            b.clicks - a.clicks ||
            b.impressions - a.impressions ||
            a.query.localeCompare(b.query),
        )
        .map((row) => row.query)
        .filter(
          (query, index, all) =>
            all.indexOf(query) === index &&
            !knownPages.some(
              (page) => page.path !== path && overlapsIntent(query, page),
            ),
        )
        .slice(0, 3);
      const previous = previousByPath.get(path);
      const recommendation =
        metrics.impressions >= 20 && metrics.ctr < 0.03
          ? "Review the search snippet and align the title and description with the queries already producing impressions."
          : metrics.position >= 4 && metrics.position <= 20
            ? "Strengthen this page first with clearer coverage, internal links, and verified up-to-date details."
            : "Protect and improve this successful page before planning unrelated new content.";

      return {
        path,
        title: known.title,
        articleId: known.articleId || null,
        clicks: metrics.clicks,
        impressions: metrics.impressions,
        ctr: metrics.ctr,
        position: metrics.position,
        previousClicks: previous?.clicks ?? null,
        previousImpressions: previous?.impressions ?? null,
        recommendation,
        reasons,
        supportingQueries: related,
      };
    })
    .filter((item): item is SeoOpportunity => Boolean(item))
    .sort(
      (a, b) =>
        Number(b.impressions >= 20 && b.ctr < 0.03) -
          Number(a.impressions >= 20 && a.ctr < 0.03) ||
        Number(b.position >= 4 && b.position <= 20) -
          Number(a.position >= 4 && a.position <= 20) ||
        b.clicks - a.clicks ||
        b.impressions - a.impressions,
    );
}
