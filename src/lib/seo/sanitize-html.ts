import DOMPurify from "isomorphic-dompurify";

// ============================================================================
// Shared HTML sanitization for API/CMS content
// ============================================================================

/**
 * Safe protocols allowed in `<a href>` attributes.
 * Blocks `javascript:`, `data:`, `vbscript:` and other dangerous schemes.
 */
const ALLOWED_URI_PROTOCOLS = ["http", "https", "mailto", "tel"];

/**
 * Tags allowed in sanitized HTML from the API.
 *
 * Blocked intentionally:
 * - `h1` — page must have a single semantic H1; API content must not introduce another
 * - `h2` — will be downgraded to `h3` via hook (see below)
 * - `h3` — will be downgraded to `h4` via hook
 * - `div`, `span` — structural wrappers that add no semantic value
 * - `style` — inline styles pollute rendering and hurt consistency
 *
 * `table` and children are kept because some product descriptions use spec tables.
 */
const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "h3",
  "h4",
  "h5",
  "h6",
  "ul",
  "ol",
  "li",
  "a",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
];

/**
 * Attributes allowed on sanitized elements.
 * `style` and `class` are intentionally excluded.
 */
const ALLOWED_ATTR = ["href", "target", "rel"];

/**
 * Heading downgrade map: `h2` → `h3`, `h3` → `h4`.
 * Preserves heading hierarchy without conflicting with page-level headings.
 */
const HEADING_DOWNGRADE: Record<string, string> = {
  H2: "H3",
  H3: "H4",
};

/**
 * DOMPurify configuration for sanitizing HTML content from the API/CMS.
 */
const SANITIZE_CONFIG = {
  ALLOWED_TAGS,
  ALLOWED_ATTR,
  ALLOWED_URI_REGEXP: new RegExp(
    `^(?:${ALLOWED_URI_PROTOCOLS.join("|")}):`,
    "i",
  ),
  RETURN_TRUSTED_TYPE: false as const,
};

// ============================================================================
// DOMPurify hooks (registered once at module level — isomorphic-dompurify is a singleton)
// ============================================================================

let hooksRegistered = false;

function registerDOMPurifyHooks(): void {
  if (hooksRegistered) return;
  hooksRegistered = true;

  // ---------------------------------------------------------------------------
  // Hook: downgrade h2 → h3, h3 → h4
  // Uses nodeType === 1 instead of `instanceof Element` because Node.js
  // does not expose a global `Element` constructor (JSDOM keeps it internal).
  // ---------------------------------------------------------------------------
  DOMPurify.addHook("afterSanitizeElements", (node) => {
    if (node.nodeType === 1) {
      const el = node as unknown as HTMLElement;
      const replacement = HEADING_DOWNGRADE[el.tagName];
      if (replacement && el.ownerDocument && el.parentNode) {
        const newElement = el.ownerDocument.createElement(replacement);
        while (el.firstChild) {
          newElement.appendChild(el.firstChild);
        }
        el.parentNode.replaceChild(newElement, el);
      }
    }
  });

  // ---------------------------------------------------------------------------
  // Hook: normalize links — add rel/target for external, block dangerous protocols
  // ---------------------------------------------------------------------------
  DOMPurify.addHook("afterSanitizeAttributes", (node) => {
    if (node.tagName !== "A") return;

    const href = node.getAttribute("href");

    // Remove links with blocked protocols (javascript:, data:, vbscript:)
    if (href) {
      const normalizedHref = href.trim().toLowerCase();
      const hasBlockedProtocol =
        normalizedHref.startsWith("javascript:") ||
        normalizedHref.startsWith("data:") ||
        normalizedHref.startsWith("vbscript:");

      if (hasBlockedProtocol) {
        node.removeAttribute("href");
        return;
      }

      // External links: add rel and target attributes
      const isExternal =
        normalizedHref.startsWith("http://") ||
        normalizedHref.startsWith("https://");

      if (isExternal) {
        node.setAttribute("rel", "nofollow noopener noreferrer");
        node.setAttribute("target", "_blank");
      }
    }
  });
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Checks whether a string contains HTML tags.
 */
export function containsHtml(content: string): boolean {
  return /<[a-z][\s\S]*>/i.test(content);
}

/**
 * Sanitizes HTML content from the API/CMS for safe rendering in the app.
 *
 * - Strips dangerous tags (`script`, `iframe`, `h1`, `div`, `span`, etc.)
 * - Removes `style` and `class` attributes
 * - Downgrades `h2` → `h3`, `h3` → `h4` to preserve heading hierarchy
 * - Blocks `javascript:` and other dangerous protocols in links
 * - Adds `rel="nofollow noopener noreferrer"` and `target="_blank"` to external links
 * - Restricts link protocols to http, https, mailto, tel
 *
 * Returns both the sanitized HTML and a flag indicating whether the original was HTML.
 * Non-HTML strings are returned as-is.
 */
export function sanitizeApiHtml(html: string): {
  sanitizedHtml: string;
  isHtml: boolean;
} {
  const isHtml = containsHtml(html);

  if (!isHtml) {
    return { sanitizedHtml: html, isHtml: false };
  }

  registerDOMPurifyHooks();

  return {
    sanitizedHtml: DOMPurify.sanitize(html, SANITIZE_CONFIG) as string,
    isHtml: true,
  };
}
