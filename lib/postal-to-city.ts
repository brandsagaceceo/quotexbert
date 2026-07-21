/**
 * Canadian Postal Code → City lookup
 *
 * Converts a postal code FSA (first 3 characters) to a city name for Ontario.
 * Used to display human-readable locations in notifications without requiring
 * an external geocoding API call on every notification send.
 *
 * Only covers the most common Ontario markets served by QuoteXbert.
 * Returns null for unknown FSAs — callers should fall back to showing the raw
 * postal code in that case.
 */

const FSA_TO_CITY: Record<string, string> = {
  // ─── Durham Region ────────────────────────────────────────────────────────
  L1B: 'Bowmanville', L1C: 'Bowmanville', L1E: 'Bowmanville', L1F: 'Newcastle',
  L0B: 'Newcastle',   L0A: 'Port Hope',   L0H: 'Port Perry',
  L1G: 'Oshawa',      L1H: 'Oshawa',      L1J: 'Oshawa',      L1K: 'Oshawa',
  L1L: 'Brooklin',    L1M: 'Whitby',      L1N: 'Whitby',      L1P: 'Whitby',
  L1R: 'Whitby',
  L1S: 'Ajax',        L1T: 'Ajax',
  L1V: 'Pickering',   L1W: 'Pickering',   L1X: 'Pickering',   L1Y: 'Pickering', L1Z: 'Pickering',
  // ─── City of Toronto ──────────────────────────────────────────────────────
  M1B: 'Scarborough', M1C: 'Scarborough', M1E: 'Scarborough', M1G: 'Scarborough',
  M1H: 'Scarborough', M1J: 'Scarborough', M1K: 'Scarborough', M1L: 'Scarborough',
  M1M: 'Scarborough', M1N: 'Scarborough', M1P: 'Scarborough', M1R: 'Scarborough',
  M1S: 'Scarborough', M1T: 'Scarborough', M1V: 'Scarborough', M1W: 'Scarborough',
  M1X: 'Scarborough',
  M2H: 'North York',  M2J: 'North York',  M2K: 'North York',  M2L: 'North York',
  M2M: 'North York',  M2N: 'North York',  M2P: 'North York',  M2R: 'North York',
  M3A: 'North York',  M3B: 'North York',  M3C: 'Toronto',     M3H: 'North York',
  M3J: 'North York',  M3K: 'North York',  M3L: 'North York',  M3M: 'North York',
  M3N: 'North York',
  M4A: 'Toronto',     M4B: 'Toronto',     M4C: 'Toronto',     M4E: 'Toronto',
  M4G: 'Toronto',     M4H: 'Toronto',     M4J: 'Toronto',     M4K: 'Toronto',
  M4L: 'Toronto',     M4M: 'Toronto',     M4N: 'Toronto',     M4P: 'Toronto',
  M4R: 'Toronto',     M4S: 'Toronto',     M4T: 'Toronto',     M4V: 'Toronto',
  M4W: 'Toronto',     M4X: 'Toronto',     M4Y: 'Toronto',
  M5A: 'Toronto',     M5B: 'Toronto',     M5C: 'Toronto',     M5E: 'Toronto',
  M5G: 'Toronto',     M5H: 'Toronto',     M5J: 'Toronto',     M5K: 'Toronto',
  M5L: 'Toronto',     M5M: 'Toronto',     M5N: 'Toronto',     M5P: 'Toronto',
  M5R: 'Toronto',     M5S: 'Toronto',     M5T: 'Toronto',     M5V: 'Toronto',
  M5W: 'Toronto',     M5X: 'Toronto',
  M6A: 'Toronto',     M6B: 'Toronto',     M6C: 'Toronto',     M6E: 'Toronto',
  M6G: 'Toronto',     M6H: 'Toronto',     M6J: 'Toronto',     M6K: 'Toronto',
  M6L: 'Toronto',     M6M: 'Toronto',     M6N: 'Toronto',     M6P: 'Toronto',
  M6R: 'Toronto',     M6S: 'Toronto',
  M7A: 'Toronto',     M7R: 'Toronto',     M7Y: 'Toronto',
  M8V: 'Etobicoke',   M8W: 'Etobicoke',   M8X: 'Etobicoke',   M8Y: 'Etobicoke',   M8Z: 'Etobicoke',
  M9A: 'Etobicoke',   M9B: 'Etobicoke',   M9C: 'Etobicoke',   M9L: 'Etobicoke',
  M9M: 'Etobicoke',   M9N: 'Etobicoke',   M9P: 'Etobicoke',   M9R: 'Etobicoke',
  M9V: 'Etobicoke',   M9W: 'Etobicoke',
  // ─── Peel Region ──────────────────────────────────────────────────────────
  L4T: 'Mississauga', L4W: 'Mississauga', L4X: 'Mississauga', L4Y: 'Mississauga', L4Z: 'Mississauga',
  L5A: 'Mississauga', L5B: 'Mississauga', L5C: 'Mississauga', L5E: 'Mississauga',
  L5G: 'Mississauga', L5H: 'Mississauga', L5J: 'Mississauga', L5K: 'Mississauga',
  L5L: 'Mississauga', L5M: 'Mississauga', L5N: 'Mississauga', L5P: 'Mississauga',
  L5R: 'Mississauga', L5S: 'Mississauga', L5T: 'Mississauga', L5V: 'Mississauga', L5W: 'Mississauga',
  L6P: 'Brampton',    L6R: 'Brampton',    L6S: 'Brampton',    L6T: 'Brampton',
  L6V: 'Brampton',    L6W: 'Brampton',    L6X: 'Brampton',    L6Y: 'Brampton',    L6Z: 'Brampton',
  L7A: 'Brampton',
  // ─── York Region ──────────────────────────────────────────────────────────
  L3R: 'Markham',     L3S: 'Markham',     L3T: 'Markham',
  L6B: 'Markham',     L6C: 'Markham',     L6E: 'Markham',     L6G: 'Markham',
  L3Y: 'Newmarket',   L3X: 'Newmarket',
  L4B: 'Richmond Hill', L4C: 'Richmond Hill', L4E: 'Richmond Hill', L4S: 'Richmond Hill',
  L4H: 'Vaughan',     L4J: 'Vaughan',     L4K: 'Vaughan',     L4L: 'Vaughan',
  L6A: 'Vaughan',
  // ─── Halton Region ────────────────────────────────────────────────────────
  L6H: 'Oakville',    L6J: 'Oakville',    L6K: 'Oakville',    L6L: 'Oakville',    L6M: 'Oakville',
  L7L: 'Burlington',  L7M: 'Burlington',  L7N: 'Burlington',  L7P: 'Burlington',
  L7R: 'Burlington',  L7S: 'Burlington',  L7T: 'Burlington',
  // ─── Hamilton ─────────────────────────────────────────────────────────────
  L8E: 'Hamilton',    L8G: 'Hamilton',    L8H: 'Hamilton',    L8J: 'Hamilton',
  L8K: 'Hamilton',    L8L: 'Hamilton',    L8M: 'Hamilton',    L8N: 'Hamilton',
  L8P: 'Hamilton',    L8R: 'Hamilton',    L8S: 'Hamilton',    L8T: 'Hamilton',
  L8V: 'Hamilton',    L8W: 'Hamilton',    L9A: 'Hamilton',    L9B: 'Hamilton',
  L9C: 'Hamilton',    L9G: 'Ancaster',    L9H: 'Dundas',
  // ─── Ottawa ───────────────────────────────────────────────────────────────
  K1A: 'Ottawa',      K1B: 'Ottawa',      K1C: 'Ottawa',      K1E: 'Ottawa',
  K1G: 'Ottawa',      K1H: 'Ottawa',      K1J: 'Ottawa',      K1K: 'Ottawa',
  K1L: 'Ottawa',      K1M: 'Ottawa',      K1N: 'Ottawa',      K1P: 'Ottawa',
  K1R: 'Ottawa',      K1S: 'Ottawa',      K1T: 'Ottawa',      K1V: 'Ottawa',
  K1W: 'Ottawa',      K1X: 'Ottawa',      K1Y: 'Ottawa',      K1Z: 'Ottawa',
  K2A: 'Ottawa',      K2B: 'Ottawa',      K2C: 'Ottawa',      K2E: 'Ottawa',
  K2G: 'Ottawa',      K2H: 'Ottawa',      K2J: 'Ottawa',      K2K: 'Ottawa',
  K2L: 'Ottawa',      K2M: 'Ottawa',      K2P: 'Ottawa',      K2R: 'Ottawa',
  K2S: 'Ottawa',      K2T: 'Ottawa',      K2V: 'Ottawa',      K2W: 'Ottawa',
  // ─── Kitchener / Waterloo ─────────────────────────────────────────────────
  N2A: 'Kitchener',   N2B: 'Kitchener',   N2C: 'Kitchener',   N2E: 'Kitchener',
  N2G: 'Kitchener',   N2H: 'Kitchener',   N2K: 'Kitchener',   N2M: 'Kitchener',
  N2N: 'Kitchener',   N2P: 'Kitchener',   N2R: 'Kitchener',
  N2J: 'Waterloo',    N2L: 'Waterloo',    N2T: 'Waterloo',    N2V: 'Waterloo',
  N3A: 'Cambridge',   N3C: 'Cambridge',   N3E: 'Cambridge',   N3H: 'Cambridge',
  // ─── London ───────────────────────────────────────────────────────────────
  N5V: 'London',      N5W: 'London',      N5X: 'London',      N5Y: 'London',
  N5Z: 'London',      N6A: 'London',      N6B: 'London',      N6C: 'London',
  N6E: 'London',      N6G: 'London',      N6H: 'London',      N6J: 'London',
  N6K: 'London',      N6L: 'London',      N6M: 'London',      N6N: 'London',
  N6P: 'London',
};

/**
 * Convert a Canadian postal code to a city name.
 * Returns the city string (e.g. "Bowmanville") or null if not recognized.
 * The lookup uses the Forward Sortation Area (first 3 chars), case-insensitive.
 *
 * @example
 * postalCodeToCity('L1C 3X4') // → 'Bowmanville'
 * postalCodeToCity('M5H 2N2') // → 'Toronto'
 * postalCodeToCity('X0A 0A0') // → null
 */
export function postalCodeToCity(postalCode: string | null | undefined): string | null {
  if (!postalCode) return null;
  const fsa = postalCode.replace(/\s+/g, '').substring(0, 3).toUpperCase();
  return FSA_TO_CITY[fsa] ?? null;
}

/**
 * Format a location display string: "City, ON" or falls back to the raw postal code.
 */
export function formatJobLocation(
  postalCode: string | null | undefined,
  cityOverride?: string | null,
): string {
  const city = cityOverride || postalCodeToCity(postalCode);
  if (city) return `${city}, ON`;
  return postalCode || 'Location not specified';
}
