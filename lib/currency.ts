/**
 * Single source of truth for rendering a Lead/job `budget` value.
 *
 * Root cause this fixes: `Lead.budget` is a free-form String that has been written
 * in two different shapes over the app's history —
 *   • a plain number string, e.g. "5100"           (AI-estimate → job-board flow)
 *   • an already-"$"-prefixed range, e.g. "$5,000 - $8,000"  (submitLead + seed data)
 * Several render paths (notably app/api/jobs/route.ts) then prepend another "$",
 * producing the "$$12,500" double-dollar bug for the pre-formatted values.
 *
 * `formatBudgetDisplay()` normalizes ANY of those shapes to exactly one leading "$"
 * per number, with consistent thousands separators, preserving ranges. It is safe to
 * call on values that are already correctly formatted (idempotent).
 */
export function formatBudgetDisplay(raw: string | number | null | undefined): string {
  if (raw === null || raw === undefined || String(raw).trim() === '') {
    return 'Budget TBD';
  }

  const str = String(raw).trim();

  // Preserve ranges ("A - B") by formatting each side independently.
  const parts = str.split(/\s*[-–—]\s*/);
  const formatted = parts
    .map((part) => {
      const digits = part.replace(/[^0-9.]/g, '');
      if (!digits) return null;
      const num = parseFloat(digits);
      if (!Number.isFinite(num)) return null;
      return `$${Math.round(num).toLocaleString('en-CA')}`;
    })
    .filter((v): v is string => v !== null);

  if (formatted.length === 0) return 'Budget TBD';
  return formatted.join(' – ');
}
