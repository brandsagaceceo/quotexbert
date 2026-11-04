"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { APPROVED_AFFILIATE_PRODUCTS } from "@/lib/seo/affiliate-products";

interface SeoArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  affiliateProductIds: string[];
  status: "draft" | "approved" | "rejected" | "published" | "failed";
  scheduledFor: string | null;
  publishedAt: string | null;
  generationError: string | null;
  createdAt: string;
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

export default function SeoArticleReviewPage() {
  const [articles, setArticles] = useState<SeoArticle[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [edit, setEdit] = useState<EditableArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const refresh = useCallback(async () => {
    setError("");
    const response = await fetch("/api/admin/seo-articles", {
      cache: "no-store",
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Unable to load articles");
    setArticles(data.articles);
  }, []);

  useEffect(() => {
    refresh()
      .catch((cause: unknown) =>
        setError(
          cause instanceof Error ? cause.message : "Unable to load articles",
        ),
      )
      .finally(() => setLoading(false));
  }, [refresh]);

  function startEditing(article: SeoArticle) {
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
      setMessage("Draft saved.");
    });
  }

  async function setArticleStatus(
    id: string,
    action: "approve" | "reject" | "publish",
  ) {
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
      }
    });
  }

  async function performAction(action: () => Promise<void>) {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await action();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The action failed");
    } finally {
      setBusy(false);
    }
  }

  const selectedArticle = articles.find((article) => article.id === selectedId);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link
              href="/admin/blog"
              className="text-sm text-rose-800 hover:underline"
            >
              Back to Blog Management
            </Link>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              SEO Article Review
            </h1>
            <p className="mt-2 max-w-3xl text-slate-600">
              Generated articles remain private drafts. Approval does not
              publish; a second, explicit publish action is required.
            </p>
          </div>
          <button
            onClick={() => performAction(refresh)}
            disabled={busy}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium disabled:opacity-50"
          >
            Refresh
          </button>
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

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
          <section aria-label="SEO article drafts" className="space-y-3">
            {loading ? (
              <p className="rounded-lg bg-white p-5 text-slate-600">
                Loading review queue…
              </p>
            ) : articles.length === 0 ? (
              <p className="rounded-lg bg-white p-5 text-slate-600">
                No generated articles yet. The scheduled drafting workflow is
                disabled unless `SEO_DRAFT_AUTOMATION_ENABLED=true`.
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
                    Scheduled: {formatDate(article.scheduledFor)}
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
                    {article.status !== "published" && (
                      <button
                        onClick={() => startEditing(article)}
                        className="rounded border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50"
                      >
                        Edit
                      </button>
                    )}
                    {article.status === "draft" && (
                      <button
                        disabled={busy}
                        onClick={() => setArticleStatus(article.id, "approve")}
                        className="rounded bg-emerald-700 px-3 py-1.5 text-sm text-white disabled:opacity-50"
                      >
                        Approve
                      </button>
                    )}
                    {article.status === "approved" && (
                      <button
                        disabled={busy}
                        onClick={() => setArticleStatus(article.id, "publish")}
                        className="rounded bg-rose-800 px-3 py-1.5 text-sm text-white disabled:opacity-50"
                      >
                        Publish now
                      </button>
                    )}
                    {article.status !== "published" &&
                      article.status !== "rejected" && (
                        <button
                          disabled={busy}
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
                    disabled={busy || selectedArticle?.status === "published"}
                    onClick={saveArticle}
                    className="rounded bg-slate-900 px-4 py-2 text-white disabled:opacity-50"
                  >
                    Save changes
                  </button>
                  <button
                    onClick={() => {
                      setSelectedId(null);
                      setEdit(null);
                    }}
                    className="rounded border px-4 py-2"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );

  function updateEdit<Key extends keyof EditableArticle>(
    key: Key,
    value: EditableArticle[Key],
  ) {
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
