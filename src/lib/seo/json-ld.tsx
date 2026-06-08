import { publicEnvs } from "@/core/config/envs.client";

// ============================================================================
// Stable @id constants for cross-referencing between schemas
// ============================================================================

const baseUrl = publicEnvs.NEXT_PUBLIC_BASE_URL_APP;

/**
 * Stable `@id` identifiers used across JSON-LD schemas.
 * Allows Google to connect Organization ↔ LocalBusiness ↔ WebSite ↔ Product.
 */
export const SCHEMA_IDS = {
  organization: `${baseUrl}/#organization`,
  localBusiness: `${baseUrl}/#localbusiness`,
  website: `${baseUrl}/#website`,
} as const;

// ============================================================================
// Safe JSON-LD serialization
// ============================================================================

/**
 * Safely serializes a JSON-LD object for injection into a `<script>` tag.
 *
 * Escapes characters that could break out of the `<script>` context:
 * - `</script>` → `<\/script>` (prevents premature tag close)
 * - `<` → `\\u003c`
 * - `>` → `\\u003e`
 * - `&` → `\\u0026`
 *
 * @see https://html.spec.whatwg.org/multipage/scripting.html#restrictions-for-contents-of-script-elements
 */
export function serializeJsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data)
    .replace(/<\/script>/gi, "<\\/script>")
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

// ============================================================================
// Reusable JSON-LD script component
// ============================================================================

interface JsonLdScriptProps {
  data: Record<string, unknown>;
}

/**
 * Renders a `<script type="application/ld+json">` tag with safely serialized data.
 *
 * Replaces direct usage of `dangerouslySetInnerHTML` + `JSON.stringify` across
 * all SEO components, ensuring consistent escaping and a single point of change.
 */
export function JsonLdScript({ data }: JsonLdScriptProps) {
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD requires innerHTML; content is safely escaped via serializeJsonLd
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
