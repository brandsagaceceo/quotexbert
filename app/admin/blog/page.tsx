"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { APPROVED_AFFILIATE_PRODUCTS } from "@/lib/seo/affiliate-products";
import {
  SEO_ARTICLE_STATUSES,
  type SeoArticleStatus,
} from "@/lib/seo/article-validation";

interface SeoArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  affiliateProductIds: string[];
  status: SeoArticleStatus;
  scheduledFor: string | null;
  publishedAt: string | null;
  generationError: string | null;
  createdAt: string;
}

interface StudioData {
  articles: SeoArticle[];
  summary: Record<string, number>;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    pageCount: number;
  };
  capabilities: {
    canEdit: boolean;
    canPublish: boolean;
    canGenerate: boolean;
    scheduledDraftingEnabled: boolean;
    automaticPublishingEnabled: boolean;
  };
  searchConsole: {
    verificationTokenConfigured: boolean;
    metricsConnected: boolean;
    propertyUrl: string;
    sitemapUrl: string;
  };
}

type EditableArticle = Pick<
  SeoArticle,
  | "title"
  | "excerpt"
  | "content"
  | "seoTitle"
  | "seoDescription"
  | "tags"
  | "affiliateProductIds"
>;

export default function BlogStudioPage() {
  const [articles, setArticles] = useState<SeoArticle[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [edit, setEdit] = useState<EditableArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [studio, setStudio] = useState<StudioData | null>(null);
  const [filter, setFilter] = useState<"all" | SeoArticleStatus>("all");
  const [page, setPage] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [dirty, setDirty] = useState(false);
  const requestSequence = useRef(0);

  const refresh = useCallback(async () => {
    const sequence = ++requestSequence.current;
    const response = await fetch(
      `/api/admin/seo-articles?status=${filter}&page=${page}`,
      {
        cache: "no-store",
      },
    );
    const data = await response.json();
    if (sequence !== requestSequence.current) return;
    if (!response.ok) throw new Error(data.error || "Unable to load articles");
    setArticles(data.articles);
    setStudio(data);
  }, [filter, page]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    setStudio(null);
    setArticles([]);
    refresh()
      .catch(
        (cause: unknown) =>
          active &&
          setError(
            cause instanceof Error ? cause.message : "Unable to load articles",
          ),
      )
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
      requestSequence.current += 1;
    };
  }, [refresh]);

  useEffect(() => {
    if (
      !generating &&
      !articles.some((article) => article.status === "generating")
    )
      return;
    const timer = setInterval(() => {
      refresh().catch((cause: unknown) =>
        setError(
          `Background refresh failed: ${cause instanceof Error ? cause.message : "Unable to refresh generation status"}. Use Refresh to retry.`,
        ),
      );
    }, 5000);
    return () => clearInterval(timer);
  }, [articles, generating, refresh]);

  function discardEditor() {
    if (dirty && !window.confirm("Discard your unsaved edits?")) return false;
    setSelectedId(null);
    setEdit(null);
    setDirty(false);
    return true;
  }

  function startEditing(article: SeoArticle) {
    if (!discardEditor()) return;
    setSelectedId(article.id);
    setEdit({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      seoTitle: article.seoTitle,
      seoDescription: article.seoDescription,
      tags: article.tags,
      affiliateProductIds: article.affiliateProductIds,
    });
    setMessage("");
  }

  async function saveArticle() {
    if (!selectedId || !edit) return;
    await performAction(async () => {
      const response = await fetch(`/api/admin/seo-articles/${selectedId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(edit),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to save article");
      await refresh();
      setDirty(false);
      setMessage(
        "Draft saved privately. Any previous approval was cleared; review it again before publishing.",
      );
    });
  }

  async function setArticleStatus(
    id: string,
    action: "approve" | "reject" | "publish",
  ) {
    if (dirty && selectedId === id) {
      setError(
        "Save your edits before approving, rejecting or publishing this article.",
      );
      return;
    }
    const confirmation = {
      approve: "Approve this draft for human-reviewed publication?",
      reject: "Reject this draft? It will not be published.",
      publish: "Publish this approved article publicly now?",
    }[action];
    if (!window.confirm(confirmation)) return;

    await performAction(async () => {
      const response = await fetch(`/api/admin/seo-articles/${id}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || `Unable to ${action} article`);
      await refresh();
      setMessage(
        action === "publish"
          ? "Article is now public."
          : action === "approve"
            ? "Article approved; it remains private until explicitly published."
            : "Article rejected.",
      );
      if (selectedId === id && action !== "approve") {
        setSelectedId(null);
        setEdit(null);
        setDirty(false);
      }
    });
  }

  async function generateArticle() {
    if (
      !window.confirm(
        "Use the configured AI budget to generate one private draft? This shares the existing one-attempt-per-UTC-day limit with scheduled drafting. It will not publish.",
      )
    )
      return;
    setGenerating(true);
    await performAction(async () => {
      setMessage(
        "Generating a private draft. This can take up to a minute; do not submit again.",
      );
      const response = await fetch("/api/admin/seo-articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate" }),
      });
      const data = await response.json();
      try {
        await refresh();
      } catch (cause) {
        const outcome = response.ok
          ? "Draft created privately."
          : data.error || "Unable to generate an article.";
        throw new Error(
          `${outcome} Queue refresh failed: ${cause instanceof Error ? cause.message : "Unknown refresh error"}. Use Refresh to retry.`,
        );
      }
      if (!response.ok)
        throw new Error(data.error || "Unable to generate an article");
      setMessage(
        "Private draft created. Review and approve it, then explicitly publish when ready.",
      );
    });
    setGenerating(false);
  }

  async function performAction(action: () => Promise<void>) {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await action();
    } catch (cause) {
      setMessage("");
      setError(cause instanceof Error ? cause.message : "The action failed");
    } finally {
      setBusy(false);
    }
  }

  const selectedArticle = articles.find((article) => article.id === selectedId);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 [overflow-wrap:anywhere]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link
              href="/admin"
              className="text-sm text-rose-800 hover:underline"
            >
              Back to administration
            </Link>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              AI Blog Studio
            </h1>
            <p className="mt-2 max-w-3xl text-slate-600">
              Generated articles remain private drafts. Approval does not
              publish; a second, explicit publish action is required.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={generateArticle}
              disabled={busy || !studio?.capabilities.canGenerate}
              className="rounded-lg bg-[#800020] px-4 py-2 font-medium text-white disabled:opacity-50"
            >
              {generating
                ? "Generating private draft..."
                : "Generate private draft"}
            </button>
            <button
              onClick={() => performAction(refresh)}
              disabled={busy}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium disabled:opacity-50"
            >
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <p role="alert" className="mb-4 rounded bg-red-50 p-3 text-red-800">
            {error}
          </p>
        )}
        {message && (
          <p
            role="status"
            className="mb-4 rounded bg-green-50 p-3 text-green-800"
          >
            {message}
          </p>
        )}

        {studio && (
          <>
            <section
              aria-label="Article totals"
              className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4"
            >
              {(["total", ...SEO_ARTICLE_STATUSES] as const).map((status) => (
                <div
                  key={status}
                  className="rounded-lg border border-slate-200 bg-white p-4"
                >
                  <p className="text-sm capitalize text-slate-600">{status}</p>
                  <p className="text-2xl font-bold text-[#800020]">
                    {studio.summary[status] || 0}
                  </p>
                </div>
              ))}
            </section>
            <section
              className="mb-6 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-700"
              aria-label="Studio configuration"
            >
              <p>
                Scheduled drafting:{" "}
                {studio.capabilities.scheduledDraftingEnabled
                  ? "enabled"
                  : "disabled"}
                . Automatic publishing: disabled.
              </p>
              <p>
                Manual generation:{" "}
                {studio.capabilities.canGenerate
                  ? "enabled with the existing AI budget and daily slot limit"
                  : "disabled pending explicit AI spending authorization and environment configuration"}
                .
              </p>
              {!studio.capabilities.canEdit && (
                <p className="mt-2 font-medium text-rose-900">
                  Read-only preview. Enable SEO_PREVIEW_WRITES_ENABLED only
                  after configuring an authorized isolated database. No
                  production database writes are enabled here.
                </p>
              )}
              <p className="mt-2">
                These totals cover database-backed SEO articles, not legacy
                static blog posts. View analytics are not connected.
              </p>
            </section>
          </>
        )}

        <nav
          className="mb-5 flex flex-wrap gap-2"
          aria-label="Filter articles by status"
        >
          {(["all", ...SEO_ARTICLE_STATUSES] as const).map((status) => (
            <button
              key={status}
              disabled={busy}
              aria-pressed={filter === status}
              onClick={() => {
                if (discardEditor()) {
                  setFilter(status);
                  setPage(1);
                }
              }}
              className={`rounded border px-3 py-2 text-sm capitalize ${filter === status ? "border-[#800020] bg-[#800020] text-white" : "border-slate-300 bg-white text-slate-700"}`}
            >
              {status}
            </button>
          ))}
        </nav>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
          <section aria-label="SEO article drafts" className="space-y-3">
            {loading ? (
              <p className="rounded-lg bg-white p-5 text-slate-600">
                Loading review queue…
              </p>
            ) : !studio ? (
              <p className="rounded-lg bg-white p-5 text-slate-600">
                Articles could not be loaded. Use Refresh to retry; no sample
                data is shown.
              </p>
            ) : articles.length === 0 ? (
              <p className="rounded-lg bg-white p-5 text-slate-600">
                No articles match this view. Generation stays disabled until
                explicitly authorized.
              </p>
            ) : (
              articles.map((article) => (
                <article
                  key={article.id}
                  className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-semibold text-slate-900">
                        {article.title}
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        {article.category} · {article.slug}
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium uppercase text-slate-700">
                      {article.status}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-slate-600">
                    {article.author} · Created: {formatDate(article.createdAt)}
                    {article.scheduledFor
                      ? ` · Planned: ${formatDate(article.scheduledFor)} (does not publish automatically)`
                      : ""}
                    {article.status === "published"
                      ? ` · Published: ${formatDate(article.publishedAt)}`
                      : ""}
                  </p>
                  {article.generationError && (
                    <p className="mt-2 text-sm text-red-700">
                      Generation failure: {article.generationError}
                    </p>
                  )}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {["draft", "approved", "rejected"].includes(
                      article.status,
                    ) && (
                      <button
                        onClick={() => startEditing(article)}
                        disabled={busy}
                        className="rounded border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50 disabled:opacity-50"
                      >
                        Review / edit
                      </button>
                    )}
                    {article.status === "draft" && (
                      <button
                        disabled={busy || !studio?.capabilities.canEdit}
                        onClick={() => setArticleStatus(article.id, "approve")}
                        className="rounded bg-emerald-700 px-3 py-1.5 text-sm text-white disabled:opacity-50"
                      >
                        Approve
                      </button>
                    )}
                    {article.status === "approved" && (
                      <button
                        disabled={busy || !studio?.capabilities.canPublish}
                        onClick={() => setArticleStatus(article.id, "publish")}
                        className="rounded bg-rose-800 px-3 py-1.5 text-sm text-white disabled:opacity-50"
                      >
                        Publish now
                      </button>
                    )}
                    {["draft", "approved", "failed"].includes(
                      article.status,
                    ) && (
                      <button
                        disabled={busy || !studio?.capabilities.canEdit}
                        onClick={() => setArticleStatus(article.id, "reject")}
                        className="rounded border border-red-300 px-3 py-1.5 text-sm text-red-700 disabled:opacity-50"
                      >
                        Reject
                      </button>
                    )}
                    {article.status === "published" && (
                      <Link
                        href={`/blog/${article.slug}`}
                        target="_blank"
                        className="rounded border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50"
                      >
                        View published article
                      </Link>
                    )}
                  </div>
                </article>
              ))
            )}
            {studio && (
              <nav
                aria-label="Article pages"
                className="flex items-center justify-between gap-2 py-3 text-sm"
              >
                <button
                  disabled={busy || page <= 1}
                  className="rounded border px-3 py-2 disabled:opacity-50"
                  onClick={() => {
                    if (discardEditor()) setPage((current) => current - 1);
                  }}
                >
                  Previous
                </button>
                <span>
                  Page {page} of {studio.pagination.pageCount} ·{" "}
                  {studio.pagination.total} articles
                </span>
                <button
                  disabled={busy || page >= studio.pagination.pageCount}
                  className="rounded border px-3 py-2 disabled:opacity-50"
                  onClick={() => {
                    if (discardEditor()) setPage((current) => current + 1);
                  }}
                >
                  Next
                </button>
              </nav>
            )}
          </section>

          <section
            aria-label="Edit SEO article"
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
          >
            {!edit ? (
              <p className="text-slate-600">
                Select an article to review or edit.
              </p>
            ) : (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-slate-900">
                  Edit{" "}
                  {selectedArticle?.status === "published"
                    ? "article"
                    : "draft"}
                </h2>
                <label className="block text-sm font-medium text-slate-700">
                  Title
                  <input
                    value={edit.title}
                    onChange={(event) =>
                      updateEdit("title", event.target.value)
                    }
                    className="mt-1 w-full rounded border p-2"
                  />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Excerpt
                  <textarea
                    value={edit.excerpt}
                    onChange={(event) =>
                      updateEdit("excerpt", event.target.value)
                    }
                    rows={3}
                    className="mt-1 w-full rounded border p-2"
                  />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Article content (Markdown)
                  <textarea
                    value={edit.content}
                    onChange={(event) =>
                      updateEdit("content", event.target.value)
                    }
                    rows={18}
                    className="mt-1 w-full rounded border p-2 font-mono text-sm"
                  />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  SEO title
                  <input
                    value={edit.seoTitle}
                    onChange={(event) =>
                      updateEdit("seoTitle", event.target.value)
                    }
                    className="mt-1 w-full rounded border p-2"
                  />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Meta description
                  <textarea
                    value={edit.seoDescription}
                    onChange={(event) =>
                      updateEdit("seoDescription", event.target.value)
                    }
                    rows={2}
                    className="mt-1 w-full rounded border p-2"
                  />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Tags (comma-separated)
                  <input
                    value={edit.tags.join(", ")}
                    onChange={(event) =>
                      updateEdit(
                        "tags",
                        event.target.value
                          .split(",")
                          .map((tag) => tag.trim())
                          .filter(Boolean),
                      )
                    }
                    className="mt-1 w-full rounded border p-2"
                  />
                </label>
                <fieldset>
                  <legend className="text-sm font-medium text-slate-700">
                    Approved affiliate products
                  </legend>
                  {APPROVED_AFFILIATE_PRODUCTS.length === 0 ? (
                    <p className="mt-1 text-sm text-slate-500">
                      No approved products are configured.
                    </p>
                  ) : (
                    APPROVED_AFFILIATE_PRODUCTS.map((product) => (
                      <label
                        key={product.id}
                        className="mt-2 flex items-center gap-2 text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={edit.affiliateProductIds.includes(
                            product.id,
                          )}
                          onChange={(event) =>
                            updateEdit(
                              "affiliateProductIds",
                              event.target.checked
                                ? [...edit.affiliateProductIds, product.id]
                                : edit.affiliateProductIds.filter(
                                    (id) => id !== product.id,
                                  ),
                            )
                          }
                        />
                        {product.name}
                      </label>
                    ))
                  )}
                </fieldset>
                <div className="flex gap-2">
                  <button
                    disabled={
                      busy ||
                      !studio?.capabilities.canEdit ||
                      selectedArticle?.status === "published"
                    }
                    onClick={saveArticle}
                    className="rounded bg-slate-900 px-4 py-2 text-white disabled:opacity-50"
                  >
                    Save changes
                  </button>
                  <button
                    onClick={discardEditor}
                    className="rounded border px-4 py-2"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
        {studio && (
          <section
            aria-label="Google Search Console setup"
            className="mt-8 rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-700"
          >
            <h2 className="text-lg font-semibold text-slate-900">
              Google Search Console
            </h2>
            <p className="mt-2">
              Metrics are not connected. No impressions, clicks, rankings or
              keyword data are fabricated.
            </p>
            <p>Site: {studio.searchConsole.propertyUrl}</p>
            <p>
              Verification token:{" "}
              {studio.searchConsole.verificationTokenConfigured
                ? "configured; verify ownership in Search Console"
                : "not configured. Supply GOOGLE_SITE_VERIFICATION for an HTML-tag property, or use DNS verification"}
              .
            </p>
            <p className="mt-2">
              The existing sitemap includes eligible published content only.
              Submit it after verifying the property.
            </p>
            <div className="mt-3 flex flex-wrap gap-4">
              <a
                className="text-rose-800 underline"
                href={studio.searchConsole.sitemapUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open existing sitemap
              </a>
              <a
                className="text-rose-800 underline"
                href="https://search.google.com/search-console"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open Search Console
              </a>
            </div>
            <p className="mt-3">
              API metrics require separately authorized Google access. This
              package does not request credentials or activate a new service.
            </p>
          </section>
        )}
      </div>
    </main>
  );

  function updateEdit<Key extends keyof EditableArticle>(
    key: Key,
    value: EditableArticle[Key],
  ) {
    setDirty(true);
    setEdit((current) => (current ? { ...current, [key]: value } : current));
  }
}

function formatDate(value: string | null) {
  if (!value) return "Not scheduled";
  return new Date(value).toLocaleString("en-CA", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
