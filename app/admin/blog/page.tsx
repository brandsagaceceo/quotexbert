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
  updatedAt: string;
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
  };
  searchConsole: {
    verificationTokenConfigured: boolean;
    metricsConnected: boolean;
    credentialsConfigured: boolean;
    propertyConfigured: boolean;
    propertyUrl: string;
    sitemapUrl: string;
    error: string | null;
    metrics: {
      clicks: number;
      impressions: number;
      ctr: number;
      position: number;
      queries: Array<{
        query: string;
        clicks: number;
        impressions: number;
        ctr: number;
        position: number;
      }>;
    };
  };
}

interface PublishingData {
  autoPublish: boolean;
  paused: boolean;
  weeklyLimit: number;
  scheduled: Array<{ id: string; title: string; scheduledFor: string | null }>;
  events: Array<{
    id: string;
    action: string;
    detail: string | null;
    articleId: string | null;
    actorId: string | null;
    createdAt: string;
  }>;
  eventPage: number;
  eventPageCount: number;
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
  const [editing, setEditing] = useState(false);
  const [publishing, setPublishing] = useState<PublishingData | null>(null);
  const [scheduleDate, setScheduleDate] = useState("");
  const requestSequence = useRef(0);
  const editorRef = useRef<HTMLElement>(null);

  const refresh = useCallback(async () => {
    const sequence = ++requestSequence.current;
    const [response, publishingResponse] = await Promise.all([
      fetch(`/api/admin/seo-articles?status=${filter}&page=${page}`, {
        cache: "no-store",
      }),
      fetch("/api/admin/seo-publishing", { cache: "no-store" }),
    ]);
    const data = await response.json();
    const publishingData = await publishingResponse.json();
    if (sequence !== requestSequence.current) return;
    if (!response.ok) throw new Error(data.error || "Unable to load articles");
    if (!publishingResponse.ok)
      throw new Error(
        publishingData.error || "Unable to load publishing controls",
      );
    setArticles(data.articles);
    setStudio(data);
    setPublishing(publishingData);
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

  useEffect(() => {
    if (selectedId) editorRef.current?.focus();
  }, [selectedId]);

  useEffect(() => {
    if (selectedId || busy) return;
    const timer = setInterval(() => {
      refresh().catch((cause: unknown) =>
        setError(
          cause instanceof Error ? cause.message : "Unable to refresh articles",
        ),
      );
    }, 60_000);
    return () => clearInterval(timer);
  }, [selectedId, busy, refresh]);

  function discardEditor() {
    if (dirty && !window.confirm("Discard your unsaved edits?")) return false;
    setSelectedId(null);
    setEdit(null);
    setDirty(false);
    setEditing(false);
    setScheduleDate("");
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
    setEditing(false);
  }

  async function saveArticle() {
    if (!selectedId || !edit) return;
    await performAction(async () => {
      const response = await fetch(`/api/admin/seo-articles/${selectedId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...edit,
          ifUpdatedAt: selectedArticle?.updatedAt,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to save article");
      await refresh();
      setDirty(false);
      setSelectedId(null);
      setEdit(null);
      setEditing(false);
      setMessage(
        "Draft saved privately. Any previous approval was cleared; review it again before publishing.",
      );
    });
  }

  async function setArticleStatus(
    id: string,
    action: "approve" | "reject" | "publish" | "schedule" | "cancel",
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
      schedule: "Schedule this approved article for publication?",
      cancel:
        "Cancel this scheduled publication? The approved article will remain private.",
    }[action];
    const article = articles.find((item) => item.id === id);
    if (!article) {
      setError(
        "Article is no longer in this view. Refresh and review it again.",
      );
      return;
    }
    if (!window.confirm(confirmation)) return;

    await performAction(async () => {
      const response = await fetch(`/api/admin/seo-articles/${id}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          ifUpdatedAt: article.updatedAt,
          ...(action === "schedule" && scheduleDate
            ? { scheduledFor: new Date(scheduleDate).toISOString() }
            : {}),
        }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || `Unable to ${action} article`);
      await refresh();
      setMessage(
        action === "publish"
          ? "Article is now public."
          : action === "approve"
            ? "Article approved and still private. Automatic publishing may schedule it if enabled."
            : action === "schedule"
              ? "Article scheduled; it remains private until publication."
              : action === "cancel"
                ? "Schedule cancelled; the approved article remains private."
                : "Article rejected.",
      );
      if (selectedId === id) {
        setSelectedId(null);
        setEdit(null);
        setDirty(false);
      }
    });
  }

  async function updatePublishing(
    control: "autoPublish" | "paused",
    enabled: boolean,
  ) {
    const prompt =
      control === "paused"
        ? enabled
          ? "Pause all publishing, including Publish now?"
          : "Resume publishing? Missed articles will be rescheduled gradually."
        : enabled
          ? "Enable automatic scheduling of approved articles? This does not enable AI generation."
          : "Turn automatic publishing off?";
    if (!(control === "paused" && enabled) && !window.confirm(prompt)) return;
    await performAction(async () => {
      const response = await fetch("/api/admin/seo-publishing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ control, enabled }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Unable to update publishing");
      await refresh();
      setMessage(
        control === "paused"
          ? enabled
            ? "All publishing paused."
            : "Publishing resumed."
          : enabled
            ? "Automatic publishing enabled."
            : "Automatic publishing disabled.",
      );
    });
  }

  async function loadMoreHistory() {
    if (!publishing) return;
    await performAction(async () => {
      const response = await fetch(
        `/api/admin/seo-publishing?page=${publishing.eventPage + 1}`,
        { cache: "no-store" },
      );
      const data: PublishingData & { error?: string } = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Unable to load publishing history");
      setPublishing((current) =>
        current
          ? {
              ...current,
              events: [...current.events, ...data.events],
              eventPage: data.eventPage,
              eventPageCount: data.eventPageCount,
            }
          : current,
      );
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
            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              AI Blog Studio
            </h1>
            <p className="mt-2 max-w-3xl text-slate-600">
              Review and approve articles before publication. Automatic
              publishing never enables AI generation.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={generateArticle}
              disabled={busy || !studio?.capabilities.canGenerate}
              className="min-h-12 rounded-lg bg-[#800020] px-4 py-3 font-medium text-white disabled:opacity-50"
            >
              {generating
                ? "Generating private draft..."
                : "Generate private draft"}
            </button>
            <button
              onClick={() => performAction(refresh)}
              disabled={busy}
              className="min-h-12 rounded-lg border border-slate-300 bg-white px-4 py-3 font-medium disabled:opacity-50"
            >
              Refresh
            </button>
          </div>
        </div>

        <nav
          aria-label="Admin navigation"
          className="mb-6 flex flex-wrap gap-2"
        >
          {(
            [
              ["/admin", "Dashboard"],
              ["/admin/insights", "Analytics"],
              ["/admin/leads", "Leads"],
              ["/admin/contractors", "Contractors"],
            ] as const
          ).map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="inline-flex min-h-12 items-center rounded-lg border border-rose-200 bg-white px-4 font-medium text-[#800020] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#800020]"
            >
              {label}
            </Link>
          ))}
        </nav>

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
                  <p className="text-sm text-slate-600">
                    {statusLabel(status)}
                  </p>
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
                Automatic AI drafting:{" "}
                {studio.capabilities.scheduledDraftingEnabled
                  ? "enabled"
                  : "disabled"}
                . Publishing never enables AI drafting.
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
            {publishing && (
              <section
                aria-label="Publishing controls"
                className="mb-6 rounded-xl border border-rose-200 bg-white p-5"
              >
                <h2 className="text-xl font-bold text-[#800020]">
                  Publishing controls
                </h2>
                <p className="mt-2">
                  Automatic publishing:{" "}
                  <strong>{publishing.autoPublish ? "ON" : "OFF"}</strong> · All
                  publishing:{" "}
                  <strong>{publishing.paused ? "PAUSED" : "active"}</strong> ·
                  Limit: {publishing.weeklyLimit} articles per rolling 7 days,
                  including manual posts.
                </p>
                <p className="mt-2 text-sm text-slate-700">
                  Only human-approved articles can be scheduled automatically
                  because factual claims cannot be verified automatically.
                  Scheduled publishing runs daily at 14:00 UTC, so posts may
                  appear after their selected time. Preview never publishes
                  publicly.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    disabled={busy || !studio.capabilities.canEdit}
                    onClick={() =>
                      updatePublishing("paused", !publishing.paused)
                    }
                    className="min-h-12 rounded-lg bg-[#800020] px-5 py-3 font-semibold text-white disabled:opacity-50"
                  >
                    {publishing.paused
                      ? "Resume publishing"
                      : "Pause all publishing"}
                  </button>
                  <button
                    disabled={busy || !studio.capabilities.canEdit}
                    onClick={() =>
                      updatePublishing("autoPublish", !publishing.autoPublish)
                    }
                    className="min-h-12 rounded-lg border border-[#800020] px-5 py-3 font-semibold text-[#800020] disabled:opacity-50"
                  >
                    Turn automatic publishing{" "}
                    {publishing.autoPublish ? "off" : "on"}
                  </button>
                </div>
                <h3 className="mt-5 font-semibold">Next scheduled articles</h3>
                {publishing.scheduled.length ? (
                  <ul className="mt-2 space-y-2">
                    {publishing.scheduled.map((item) => (
                      <li key={item.id}>
                        {item.title} — {formatDate(item.scheduledFor)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-slate-600">No scheduled articles.</p>
                )}
                <details className="mt-4">
                  <summary className="min-h-12 cursor-pointer py-3 font-semibold text-[#800020]">
                    Recent publishing activity
                  </summary>
                  {publishing.events.length ? (
                    <ul className="space-y-2">
                      {publishing.events.map((event) => (
                        <li key={event.id}>
                          {formatDate(event.createdAt)} ·{" "}
                          {event.action.replace(/_/g, " ")} ·{" "}
                          {event.actorId || "system"}
                          {event.articleId
                            ? ` · Article ${event.articleId}`
                            : ""}
                          {event.detail ? ` · ${event.detail}` : ""}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No publishing activity yet.</p>
                  )}
                  {publishing.eventPage < publishing.eventPageCount && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={loadMoreHistory}
                      className="mt-3 min-h-12 rounded-lg border px-4 py-3"
                    >
                      Load older activity
                    </button>
                  )}
                </details>
              </section>
            )}
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
              className={`min-h-12 rounded-lg border px-4 py-3 text-sm font-medium ${filter === status ? "border-[#800020] bg-[#800020] text-white" : "border-slate-300 bg-white text-slate-700"}`}
            >
              {statusLabel(status)}
            </button>
          ))}
        </nav>

        <div className="grid gap-6">
          <section
            aria-label="SEO article drafts"
            className={edit ? "hidden" : "space-y-3"}
          >
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
                        <button
                          onClick={() => startEditing(article)}
                          disabled={busy}
                          className="min-h-12 text-left text-lg text-[#800020] underline"
                        >
                          {article.title}
                        </button>
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        {article.category} · {article.slug}
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium uppercase text-slate-700">
                      {statusLabel(article.status)}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-slate-600">
                    {article.author} · Created: {formatDate(article.createdAt)}
                    {article.status === "scheduled" && article.scheduledFor
                      ? ` · Scheduled: ${formatDate(article.scheduledFor)}`
                      : ""}
                    {article.status === "published"
                      ? ` · Published: ${formatDate(article.publishedAt)}`
                      : ""}
                  </p>
                  {article.generationError && (
                    <p className="mt-2 text-sm text-red-700">
                      Requires attention: {article.generationError}
                    </p>
                  )}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {[
                      "draft",
                      "approved",
                      "scheduled",
                      "failed",
                      "rejected",
                      "published",
                    ].includes(article.status) && (
                      <button
                        onClick={() => startEditing(article)}
                        disabled={busy}
                        className="min-h-12 rounded-lg border border-slate-300 px-4 py-3 text-sm font-medium disabled:opacity-50"
                      >
                        {article.status === "published"
                          ? "Read article"
                          : "Review / edit"}
                      </button>
                    )}
                    {article.status === "draft" && (
                      <button
                        disabled={busy || !studio?.capabilities.canEdit}
                        onClick={() => setArticleStatus(article.id, "approve")}
                        className="min-h-12 rounded-lg bg-emerald-700 px-4 py-3 text-sm font-medium text-white disabled:opacity-50"
                      >
                        Approve
                      </button>
                    )}
                    {article.status === "approved" && (
                      <button
                        disabled={
                          busy ||
                          !studio?.capabilities.canPublish ||
                          publishing?.paused
                        }
                        onClick={() => setArticleStatus(article.id, "publish")}
                        className="min-h-12 rounded-lg bg-rose-800 px-4 py-3 text-sm font-medium text-white disabled:opacity-50"
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
                        className="min-h-12 rounded-lg border border-red-300 px-4 py-3 text-sm font-medium text-red-700 disabled:opacity-50"
                      >
                        Reject
                      </button>
                    )}
                    {article.status === "published" && (
                      <Link
                        href={`/blog/${article.slug}`}
                        target="_blank"
                        className="inline-flex min-h-12 items-center rounded-lg border border-slate-300 px-4 py-3 text-sm"
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
                  className="min-h-12 rounded-lg border px-4 py-3 disabled:opacity-50"
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
                  className="min-h-12 rounded-lg border px-4 py-3 disabled:opacity-50"
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
            ref={editorRef}
            tabIndex={-1}
            className={
              edit
                ? "min-h-screen rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
                : "hidden"
            }
          >
            {!edit ? (
              <p className="text-slate-600">
                Select an article to review or edit.
              </p>
            ) : !editing ? (
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">
                  {edit.title}
                </h2>
                <p className="mt-3 text-lg text-slate-600">{edit.excerpt}</p>
                <div className="mt-6 whitespace-pre-wrap text-base leading-7 text-slate-800">
                  {edit.content}
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    disabled={
                      busy ||
                      !studio?.capabilities.canEdit ||
                      !["draft", "approved", "rejected", "failed"].includes(
                        selectedArticle?.status || "",
                      )
                    }
                    className="min-h-12 rounded-lg bg-[#800020] px-5 py-3 font-medium text-white disabled:opacity-50"
                  >
                    Edit article
                  </button>
                  {selectedArticle?.status === "draft" && (
                    <button
                      type="button"
                      onClick={() =>
                        setArticleStatus(selectedArticle.id, "approve")
                      }
                      disabled={busy || !studio?.capabilities.canEdit}
                      className="min-h-12 rounded-lg bg-emerald-700 px-5 py-3 font-medium text-white disabled:opacity-50"
                    >
                      Approve draft
                    </button>
                  )}
                  {selectedArticle?.status === "approved" && (
                    <>
                      <label className="block text-sm font-medium">
                        Schedule date and time
                        <input
                          type="datetime-local"
                          value={scheduleDate}
                          onChange={(event) =>
                            setScheduleDate(event.target.value)
                          }
                          className="ml-2 min-h-12 rounded border p-3"
                        />
                      </label>
                      <button
                        type="button"
                        disabled={
                          busy || !scheduleDate || !studio?.capabilities.canEdit
                        }
                        onClick={() =>
                          setArticleStatus(selectedArticle.id, "schedule")
                        }
                        className="min-h-12 rounded-lg bg-[#800020] px-5 py-3 text-white disabled:opacity-50"
                      >
                        Schedule
                      </button>
                      <button
                        type="button"
                        disabled={
                          busy ||
                          !studio?.capabilities.canPublish ||
                          publishing?.paused
                        }
                        onClick={() =>
                          setArticleStatus(selectedArticle.id, "publish")
                        }
                        className="min-h-12 rounded-lg bg-[#800020] px-5 py-3 text-white disabled:opacity-50"
                      >
                        Publish now
                      </button>
                    </>
                  )}
                  {selectedArticle?.status === "scheduled" && (
                    <button
                      type="button"
                      disabled={busy || !studio?.capabilities.canEdit}
                      onClick={() =>
                        setArticleStatus(selectedArticle.id, "cancel")
                      }
                      className="min-h-12 rounded-lg border px-5 py-3"
                    >
                      Cancel schedule
                    </button>
                  )}
                  {selectedArticle &&
                    ["draft", "approved", "failed"].includes(
                      selectedArticle.status,
                    ) && (
                      <button
                        type="button"
                        disabled={busy || !studio?.capabilities.canEdit}
                        onClick={() =>
                          setArticleStatus(selectedArticle.id, "reject")
                        }
                        className="min-h-12 rounded-lg border border-red-300 px-5 py-3 text-red-700"
                      >
                        Reject
                      </button>
                    )}
                  <button
                    type="button"
                    onClick={discardEditor}
                    className="min-h-12 rounded-lg border px-5 py-3"
                  >
                    Close
                  </button>
                </div>
              </div>
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
                    className="mt-1 min-h-12 w-full rounded border p-3"
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
                    className="mt-1 min-h-12 w-full rounded border p-3"
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
                    className="mt-1 min-h-12 w-full rounded border p-3 font-mono text-base"
                  />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  SEO title
                  <input
                    value={edit.seoTitle}
                    onChange={(event) =>
                      updateEdit("seoTitle", event.target.value)
                    }
                    className="mt-1 min-h-12 w-full rounded border p-3"
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
                    className="mt-1 min-h-12 w-full rounded border p-3"
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
                    className="mt-1 min-h-12 w-full rounded border p-3"
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
                        className="mt-2 flex min-h-12 items-center gap-3 text-base"
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
                    className="min-h-12 rounded-lg bg-[#800020] px-5 py-3 text-white disabled:opacity-50"
                  >
                    Save changes
                  </button>
                  <button
                    onClick={discardEditor}
                    className="min-h-12 rounded-lg border px-5 py-3"
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
              Search metrics are shown in Analytics &amp; Insights after the
              read-only Google connection is authorized. No impressions, clicks,
              rankings or keyword data are fabricated.
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
            <p className="mt-2">
              Read-only API credentials:{" "}
              {studio.searchConsole.credentialsConfigured
                ? "configured"
                : "not configured"}
              . Search Console property:{" "}
              {studio.searchConsole.propertyConfigured
                ? "configured"
                : "not configured"}
              .
            </p>
            {studio.searchConsole.metricsConnected ? (
              <div className="mt-4 rounded border border-slate-200 p-4">
                <p className="font-semibold">
                  Verified 30-day Search Console signals
                </p>
                <p className="mt-1">
                  {studio.searchConsole.metrics.clicks.toLocaleString()} clicks
                  · {studio.searchConsole.metrics.impressions.toLocaleString()}{" "}
                  impressions ·{" "}
                  {Math.round(studio.searchConsole.metrics.ctr * 1000) / 10}%
                  CTR · average position{" "}
                  {studio.searchConsole.metrics.position.toFixed(1)}
                </p>
                {studio.searchConsole.metrics.queries.length > 0 ? (
                  <ul className="mt-3 list-disc pl-5">
                    {studio.searchConsole.metrics.queries
                      .slice(0, 10)
                      .map((row) => (
                        <li key={row.query}>
                          {row.query}: {row.clicks} clicks, {row.impressions}{" "}
                          impressions, {Math.round(row.ctr * 1000) / 10}% CTR,{" "}
                          position {row.position.toFixed(1)}
                        </li>
                      ))}
                  </ul>
                ) : (
                  <p className="mt-2">
                    No query rows were returned for this period.
                  </p>
                )}
              </div>
            ) : (
              <p className="mt-4 text-amber-800">
                Live Search Console metrics are not connected
                {studio.searchConsole.error
                  ? `: ${studio.searchConsole.error}`
                  : "."}
              </p>
            )}
            <div className="mt-3 flex flex-wrap gap-4">
              <a
                className="inline-flex min-h-12 items-center text-rose-800 underline"
                href={studio.searchConsole.sitemapUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open existing sitemap
              </a>
              <a
                className="inline-flex min-h-12 items-center text-rose-800 underline"
                href="https://search.google.com/search-console"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open Search Console
              </a>
            </div>
            <p className="mt-3">
              Grant the configured service account read access to the Search
              Console property; credentials are never returned to this page.
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

function statusLabel(status: "total" | "all" | SeoArticleStatus) {
  const labels: Record<typeof status, string> = {
    total: "Total",
    all: "All",
    draft: "Needs Review",
    approved: "Approved",
    scheduled: "Scheduled",
    published: "Published",
    generating: "Generating",
    failed: "Failed",
    rejected: "Rejected",
  };
  return labels[status];
}
