/**
 * Converts a string to a URL-friendly slug.
 * Replaces spaces with hyphens, removes non-word characters, and trims hyphens.
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
}

/**
 * Normalizes a string for comparison by converting to lowercase and removing whitespace.
 */
export function normalizeString(str: string): string {
  return str.toLowerCase().replace(/\s+/g, '')
}
