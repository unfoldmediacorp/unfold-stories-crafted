/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Canonical site origin. Overrides the default in src/lib/site.ts. */
  readonly VITE_SITE_URL?: string;

  /**
   * Cloudflare R2 public bucket origin for video, without a trailing slash.
   * When unset, video-backed components fall back to their poster image.
   * See docs/MEDIA.md.
   */
  readonly VITE_MEDIA_BASE_URL?: string;

  /** Optional per-asset overrides. Object keys within the media bucket. */
  readonly VITE_MEDIA_HERO_DESKTOP?: string;
  readonly VITE_MEDIA_HERO_DESKTOP_WEBM?: string;
  readonly VITE_MEDIA_HERO_MOBILE?: string;

  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_PROJECT_ID?: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
