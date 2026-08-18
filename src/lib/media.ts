/**
 * Media configuration.
 *
 * Video is served from Cloudflare R2, never from the repo and never from
 * Lovable's `/__l5e/assets-v1/*` proxy. That proxy is a dev-server-only plugin
 * (`apply: "serve"`) and 404s in every production build, which is why the hero
 * video silently failed to play on Vercel.
 *
 * Two levels of indirection, so media can be replaced without touching
 * component code:
 *
 *   1. `VITE_MEDIA_BASE_URL` — the R2 public bucket origin. Set per
 *      environment; nothing else needs to change when the bucket moves.
 *   2. The `VIDEO` registry below — logical names (`hero`) mapped to object
 *      keys inside the bucket. Each key is overridable by its own env var, so
 *      swapping a cut is a dashboard change and a redeploy, with no code edit.
 *
 * If `VITE_MEDIA_BASE_URL` is unset, `mediaUrl` returns null and video-backed
 * components fall back to their poster image. That is the intended behaviour
 * for a misconfigured environment: a still frame, never a broken player or a
 * stream of 404s.
 *
 * See docs/MEDIA.md for encoding recipes and upload instructions.
 */

/** R2 public bucket origin, e.g. https://media.unfoldmediacorp.com. */
const MEDIA_BASE_URL = (import.meta.env.VITE_MEDIA_BASE_URL ?? "").trim().replace(/\/+$/, "");

/** True when a media origin is configured. Components degrade to posters if not. */
export const hasMediaOrigin = MEDIA_BASE_URL.length > 0;

/**
 * Resolves an object key inside the media bucket to an absolute URL.
 * Returns null when no origin is configured, which callers treat as
 * "poster only".
 *
 * Absolute URLs are passed through untouched, so a registry entry can point at
 * an external host during a migration without special-casing.
 */
export function mediaUrl(key: string): string | null {
  const trimmed = key.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (!hasMediaOrigin) return null;
  return `${MEDIA_BASE_URL}/${trimmed.replace(/^\/+/, "")}`;
}

/** One encoded rendition of a video. */
export type VideoSource = {
  /** Object key in the bucket, or an absolute URL. */
  key: string;
  /** MIME type, used for the <source type> hint so browsers can skip formats. */
  type: string;
  /**
   * Optional media query. The browser picks the first matching <source>, so
   * narrower queries must be listed first in `sources`.
   */
  media?: string;
};

export type VideoAsset = {
  sources: VideoSource[];
  /** Intrinsic size of the desktop rendition, used to reserve aspect ratio. */
  width: number;
  height: number;
};

// Env overrides. Vite only substitutes statically-written `import.meta.env.X`
// references, so each one must be spelled out literally — a dynamic lookup
// would silently resolve to undefined in the client bundle.
const HERO_DESKTOP_MP4 = (import.meta.env.VITE_MEDIA_HERO_DESKTOP ?? "").trim();
const HERO_DESKTOP_WEBM = (import.meta.env.VITE_MEDIA_HERO_DESKTOP_WEBM ?? "").trim();
const HERO_MOBILE_MP4 = (import.meta.env.VITE_MEDIA_HERO_MOBILE ?? "").trim();

/** Breakpoint for the mobile rendition. Matches Tailwind's `md`. */
const MOBILE_QUERY = "(max-width: 767px)";

/**
 * Logical media registry. Components reference these by name; only this file
 * and the environment know about object keys.
 *
 * Order matters: the browser takes the first <source> whose `media` matches and
 * whose `type` it can play, so mobile renditions and WebM come first.
 */
export const VIDEO = {
  hero: {
    width: 1920,
    height: 818,
    sources: [
      // No mobile WebM: at 960px VP9 encoded larger than H.264 for this
      // footage, so it would cost mobile users bytes for nothing. Desktop
      // WebM is kept because it is ~19% smaller than the desktop MP4.
      { key: HERO_MOBILE_MP4 || "hero/hero-mobile-v2.mp4", type: "video/mp4", media: MOBILE_QUERY },
      { key: HERO_DESKTOP_WEBM || "hero/hero-desktop-v2.webm", type: "video/webm" },
      { key: HERO_DESKTOP_MP4 || "hero/hero-desktop-v2.mp4", type: "video/mp4" },
    ],
  },
} satisfies Record<string, VideoAsset>;

export type VideoAssetName = keyof typeof VIDEO;

/** Resolves a registry entry to absolute URLs, dropping anything unresolvable. */
export function resolveVideoSources(
  name: VideoAssetName,
): Array<{ src: string; type: string; media?: string }> {
  return VIDEO[name].sources.flatMap((source) => {
    const src = mediaUrl(source.key);
    if (!src) return [];
    return [{ src, type: source.type, media: source.media }];
  });
}
