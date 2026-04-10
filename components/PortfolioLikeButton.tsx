"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";

interface PortfolioLikeButtonProps {
  itemId: string;
  /** If true, renders a read-only count (for the contractor's own profile view) */
  readOnly?: boolean;
}

export default function PortfolioLikeButton({ itemId, readOnly = false }: PortfolioLikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/portfolio/${itemId}/like`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data) {
          setLiked(data.liked);
          setLikeCount(data.likeCount);
        }
      })
      .catch(() => {});
  }, [itemId]);

  const handleToggle = async () => {
    if (loading || readOnly) return;
    setLoading(true);
    // Optimistic update
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikeCount((c) => wasLiked ? Math.max(0, c - 1) : c + 1);
    try {
      const res = await fetch(`/api/portfolio/${itemId}/like`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setLiked(data.liked);
        setLikeCount(data.likeCount);
      } else {
        // Revert on error
        setLiked(wasLiked);
        setLikeCount((c) => wasLiked ? c + 1 : Math.max(0, c - 1));
      }
    } catch {
      setLiked(wasLiked);
      setLikeCount((c) => wasLiked ? c + 1 : Math.max(0, c - 1));
    } finally {
      setLoading(false);
    }
  };

  if (readOnly) {
    return (
      <div className="flex items-center gap-1 text-xs text-gray-400">
        <Heart className="w-3.5 h-3.5 fill-rose-300 text-rose-300" />
        <span>{likeCount}</span>
      </div>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      aria-label={liked ? "Unlike" : "Like"}
      className={`flex items-center gap-1.5 text-xs font-medium transition-colors px-2 py-1 rounded-full ${
        liked
          ? "text-rose-600 bg-rose-50 hover:bg-rose-100"
          : "text-gray-400 hover:text-rose-500 hover:bg-rose-50"
      } disabled:opacity-60`}
    >
      <Heart className={`w-3.5 h-3.5 transition-transform ${liked ? "fill-rose-500 text-rose-500 scale-110" : ""}`} />
      <span>{likeCount > 0 ? likeCount : ""}</span>
    </button>
  );
}
