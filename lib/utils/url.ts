/**
 * Centralized URL validation and sanitization utility.
 * Ensures only safe web protocols (http:, https:) are allowed.
 * Blocks dangerous protocols like javascript:, data:, vbscript:, file:
 * Rejects empty, whitespace-only, and malformed URLs.
 */
export function sanitizeWebUrl(url?: string | null): string | null {
  if (!url || typeof url !== "string") {
    return null;
  }

  const trimmed = url.trim();
  if (!trimmed) {
    return null;
  }

  // Explicitly block dangerous schemes
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("data:") ||
    lower.startsWith("vbscript:") ||
    lower.startsWith("file:") ||
    lower.startsWith("#") ||
    lower === "javascript:void(0)"
  ) {
    return null;
  }

  // Must have a valid web protocol (http:// or https://)
  if (!/^https?:\/\//i.test(trimmed)) {
    return null;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }
    // Hostname must be present and valid
    if (!parsed.hostname || parsed.hostname.trim().length === 0) {
      return null;
    }
    return trimmed;
  } catch {
    return null;
  }
}

/**
 * Checks whether a URL is a valid, safe web URL.
 */
export function isValidWebUrl(url?: string | null): boolean {
  return sanitizeWebUrl(url) !== null;
}
