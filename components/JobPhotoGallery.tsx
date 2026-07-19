"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface JobPhotoGalleryProps {
  photos?: string[] | string | null | undefined;
  title?: string;
  className?: string;
}

function normalizePhotos(photos: JobPhotoGalleryProps["photos"]): string[] {
  const raw = typeof photos === "string" ? (() => {
    try {
      return JSON.parse(photos);
    } catch {
      return [];
    }
  })() : photos;

  return Array.isArray(raw)
    ? raw.filter((photo): photo is string => typeof photo === "string" && photo.trim().length > 0)
    : [];
}

export default function JobPhotoGallery({ photos, title = "Project photos", className = "" }: JobPhotoGalleryProps) {
  const photoUrls = normalizePhotos(photos);
  const [activePhoto, setActivePhoto] = useState<string | null>(null);
  const [failedPhotos, setFailedPhotos] = useState<Set<string>>(new Set());
  const visiblePhotos = photoUrls.filter((photo) => !failedPhotos.has(photo));

  if (visiblePhotos.length === 0) {
    return (
      <div className={`rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500 ${className}`}>
        No project photos uploaded.
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {visiblePhotos.map((photo, index) => (
          <button
            key={`${photo}-${index}`}
            type="button"
            onClick={() => setActivePhoto(photo)}
            className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-600"
            aria-label={`Open ${title.toLowerCase()} ${index + 1}`}
          >
            <img
              src={photo}
              alt={`${title} ${index + 1}`}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
              loading="lazy"
              onError={() => setFailedPhotos((prev) => new Set(prev).add(photo))}
            />
          </button>
        ))}
      </div>

      {activePhoto && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 p-4" onClick={() => setActivePhoto(null)}>
          <div className="relative max-h-[calc(100dvh-2rem)] max-w-5xl overflow-hidden rounded-2xl bg-black">
            <button
              type="button"
              onClick={() => setActivePhoto(null)}
              className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-2 text-slate-900 shadow-lg hover:bg-white"
              aria-label="Close photo preview"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={activePhoto}
              alt={title}
              className="max-h-[calc(100dvh-2rem)] w-auto max-w-full object-contain"
              onClick={(event) => event.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}