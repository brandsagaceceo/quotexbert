import { ALL_CATEGORIES, SIMPLE_CATEGORIES } from "@/lib/categories";

const allowedCategoryIds = new Map(ALL_CATEGORIES.map((category) => [category.id.toLowerCase(), category.id]));
const allowedSimpleCategories = new Map(SIMPLE_CATEGORIES.map((category) => [category.toLowerCase(), category]));

export function normalizeSubscriptionCategoryValue(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  return allowedCategoryIds.get(trimmed.toLowerCase()) ?? allowedSimpleCategories.get(trimmed.toLowerCase()) ?? null;
}

export function normalizeSubscriptionCategoryList(values: unknown): string[] {
  const arrayValues = Array.isArray(values) ? values : [values];
  const categories = arrayValues
    .map(normalizeSubscriptionCategoryValue)
    .filter((value): value is string => Boolean(value));

  return Array.from(new Set(categories));
}

export function parseSubscriptionMetadataCategories(raw: unknown): string[] {
  if (typeof raw !== "string" || raw.trim().length === 0) return [];

  try {
    return normalizeSubscriptionCategoryList(JSON.parse(raw));
  } catch {
    return normalizeSubscriptionCategoryList(raw.split(","));
  }
}