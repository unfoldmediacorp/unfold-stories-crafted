// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

type LovableConfig = NonNullable<Parameters<typeof defineConfig>[0]>;

// @lovable.dev/vite-tanstack-config types its `nitro` option as only
// { preset, output, cloudflare }, but at runtime it spreads the whole object
// straight into Nitro's options (see its dist/index.js). `routeRules` is valid
// Nitro config and is verified to reach both the Vercel and Cloudflare presets;
// this cast only works around the too-narrow declared type. Drop it if Lovable
// widens the type upstream.
// Content-Security-Policy, scoped to what the site actually loads:
// - Google Fonts stylesheet + font files (see src/routes/__root.tsx)
// - the Google Maps embed iframe on /contact
// - the Supabase REST API (anon key, browser-side inserts from the contact form)
// - the R2 media origin(s) for video/image assets (r2.dev today, the
//   unfoldmediacorp.com subdomain once the custom domain cutover lands)
// 'unsafe-inline' on script-src covers the inline JSON-LD tag and TanStack
// Start's hydration bootstrap script, which aren't nonce'd; 'unsafe-inline'
// on style-src covers Tailwind's inline styles. Both are scoped to 'self'
// otherwise, so this still blocks loading script/style from a third-party
// origin, which is the primary XSS/exfiltration vector CSP defends against
// here.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: https:",
  "media-src 'self' https://*.r2.dev https://*.unfoldmediacorp.com",
  "connect-src 'self' https://iixpuvgvonftfugvqvxo.supabase.co https://*.r2.dev https://*.unfoldmediacorp.com",
  "frame-src https://www.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join("; ");

const nitro = {
  routeRules: {
    "/**": {
      headers: {
        "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "X-Frame-Options": "SAMEORIGIN",
        "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
        "Cross-Origin-Opener-Policy": "same-origin",
        "Content-Security-Policy": CSP,
      },
    },
    // Nitro already emits an immutable rule for hashed /assets/*; these are
    // the unhashed public files, which need a shorter, revalidating TTL.
    "/favicon.ico": { headers: { "Cache-Control": "public, max-age=604800" } },
    "/robots.txt": { headers: { "Cache-Control": "public, max-age=86400" } },
    "/sitemap.xml": { headers: { "Cache-Control": "public, max-age=86400" } },
  },
} as LovableConfig["nitro"];

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  // Headers are declared here rather than in a host-specific file. Nitro
  // translates routeRules into whatever the active preset needs — Vercel's
  // `.vercel/output/config.json` routes, or Cloudflare's `_headers` — so one
  // declaration covers both.
  //
  // This must NOT be a `public/_headers` file: that is a Cloudflare convention,
  // and on Vercel it is copied into the static output as an inert text file that
  // applies nothing. Production is Vercel.
  //
  // Note the Cloudflare `defaultPreset` in this package is only a local fallback.
  // On Vercel's builders `VERCEL=1` is set and Nitro auto-selects the vercel
  // preset, so the deploy target is correct without configuring it here.
  nitro,
});
