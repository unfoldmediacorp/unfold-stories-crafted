# Media (video) architecture

Video is served from a **Cloudflare R2** bucket. It is never committed to this
repository and never served from Lovable's asset proxy.

## Why

The hero video previously pointed at `/__l5e/assets-v1/<id>/hero.mp4`. That path
is handled by a plugin in `@lovable.dev/vite-tanstack-config` marked
`apply: "serve"` — it exists **only on the Vite dev server**, where it proxies to
Lovable's preview host. In any production build there is no handler for it, so
the URL returned 404 and the hero silently showed a still frame. The source file
was also 21.9 MB at 17.4 Mbps, far too heavy for an autoplaying hero.

## How it fits together

```
VITE_MEDIA_BASE_URL          →  R2 bucket origin      (environment)
src/lib/media.ts             →  logical name → object key   (registry)
src/components/BackgroundVideo.tsx  →  playback behaviour   (component)
src/routes/index.tsx         →  <BackgroundVideo asset="hero" …>
```

Components never reference URLs. To change what plays, change the environment or
the registry — not the component.

**If `VITE_MEDIA_BASE_URL` is unset, every video falls back to its poster image.**
That is the intended behaviour for an unconfigured environment: a still frame,
never a broken player or a stream of 404s. The site is fully functional without it.

## Bucket layout

```
unfold-media-corp/
  masters/
    hero-source.mp4     2176×928   H.264   21.9 MB   ← archive only, never served
  hero/
    hero-desktop.mp4     1920×818   H.264   ~3.2 MB
    hero-desktop.webm    1920×818   VP9     ~2.6 MB
    hero-mobile.mp4       960×410   H.264   ~610 KB
```

`masters/` holds the original high-quality source for every asset. Nothing in
`masters/` is ever referenced by the site — it exists so a video can be
re-encoded later (different size, better codec, new crop) without hunting for
the original. Masters are **not** committed to this repository: they are large
binaries, and git history here cannot be rewritten to remove them.

The hero master was recovered from Lovable's preview asset URL before that
preview expires; it is staged locally at `media/hero/hero-source.mp4`
(gitignored). Upload it to `masters/` so it survives independently of Lovable.

There is deliberately **no mobile WebM**: at 960px VP9 encoded *larger* than
H.264 for this footage, so it would cost mobile users bytes for nothing. Desktop
WebM is kept because it is ~19% smaller than the desktop MP4.

Source selection is ordered in `src/lib/media.ts`. The browser takes the first
`<source>` whose `media` query matches and whose `type` it can decode, so
narrower queries must be listed first.

## One-time R2 setup

1. The bucket is **`unfold-media-corp`** in the Cloudflare dashboard.
2. Enable public access — either **R2.dev subdomain** (fine to start) or a
   **custom domain** such as `media.unfoldmediacorp.com` (preferred: stable URL,
   your own cache rules).
3. Set a long cache lifetime. Object keys are versioned by hand (see
   *Replacing a video*), so objects can be treated as immutable:
   ```
   Cache-Control: public, max-age=31536000, immutable
   ```
4. CORS is **not** required for plain `<video>` playback from a different
   origin. Only add it if a future feature reads frames into a canvas.

## Uploading

With Wrangler (`bun add -g wrangler`, then `wrangler login`):

```bash
# Master — archive only, never served. No cache header needed.
wrangler r2 object put unfold-media-corp/masters/hero-source.mp4 \
  --file media/hero/hero-source.mp4 \
  --content-type video/mp4

# Delivery renditions — what the site actually loads.
wrangler r2 object put unfold-media-corp/hero/hero-desktop.mp4 \
  --file media/hero/hero-desktop.mp4 \
  --content-type video/mp4 \
  --cache-control "public, max-age=31536000, immutable"

wrangler r2 object put unfold-media-corp/hero/hero-desktop.webm \
  --file media/hero/hero-desktop.webm \
  --content-type video/webm \
  --cache-control "public, max-age=31536000, immutable"

wrangler r2 object put unfold-media-corp/hero/hero-mobile.mp4 \
  --file media/hero/hero-mobile.mp4 \
  --content-type video/mp4 \
  --cache-control "public, max-age=31536000, immutable"
```

Setting `--content-type` matters: served as `application/octet-stream`, the
`<source type>` hint stops matching and playback fails.

Then set in the Vercel project (Settings → Environment Variables), for all
environments, and redeploy:

```
VITE_MEDIA_BASE_URL = https://media.unfoldmediacorp.com
```

`VITE_*` variables are inlined at **build time**, so a redeploy is required —
changing the value alone does nothing until the next build.

## Encoding a new video

The `media/` directory is gitignored; it is a staging area for renditions before
upload. Always keep the master and upload it to `masters/` — re-encoding from an
already-compressed delivery file compounds artefacts. Working from that master:

```bash
# Desktop H.264
ffmpeg -i master.mp4 -vf "scale=1920:-2" -c:v libx264 -profile:v high \
  -crf 24 -preset slow -pix_fmt yuv420p -movflags +faststart -an \
  media/hero/hero-desktop.mp4

# Desktop VP9
ffmpeg -i master.mp4 -vf "scale=1920:-2" -c:v libvpx-vp9 \
  -crf 34 -b:v 0 -row-mt 1 -cpu-used 2 -pix_fmt yuv420p -an \
  media/hero/hero-desktop.webm

# Mobile H.264
ffmpeg -i master.mp4 -vf "scale=960:-2" -c:v libx264 -profile:v high \
  -crf 27 -preset slow -pix_fmt yuv420p -movflags +faststart -an \
  media/hero/hero-mobile.mp4
```

Notes on the flags:

- `-an` strips audio. Hero video is always muted, so audio is dead weight.
- `-movflags +faststart` moves the MP4 index to the front so playback can begin
  before the file finishes downloading. **Omitting this is the usual cause of a
  hero that "takes forever to start".**
- `-pix_fmt yuv420p` is required for Safari and older Android.
- `scale=…:-2` keeps the aspect ratio and forces an even height, which H.264
  requires.
- Raise `-crf` to shrink, lower it for quality. Keep a 10s hero under ~3 MB.
- Always re-check that WebM actually beats MP4 at each size. If it does not,
  drop it rather than shipping both.

## Replacing a video

**Object keys are cached as immutable, so never overwrite a key in place** —
viewers with a warm cache would keep the old file for up to a year.

Preferred — publish under a new key and point the environment at it, no code
change and no deploy of this repo needed beyond a redeploy:

```
VITE_MEDIA_HERO_DESKTOP      = hero/hero-desktop-v2.mp4
VITE_MEDIA_HERO_DESKTOP_WEBM = hero/hero-desktop-v2.webm
VITE_MEDIA_HERO_MOBILE       = hero/hero-mobile-v2.mp4
```

Alternative — update the defaults in `src/lib/media.ts` and commit. Do this once
a new cut is permanent, so the repo reflects reality.

If the aspect ratio changes, also update the poster (`src/assets/hero.jpg`) and
the `aspect-[21/9]` class on the hero `<figure>` in `src/routes/index.tsx`.

## Adding a new video elsewhere

1. Encode and upload renditions under a new prefix, e.g. `about/`.
2. Add an entry to `VIDEO` in `src/lib/media.ts`:
   ```ts
   about: {
     width: 1920,
     height: 1080,
     sources: [
       { key: "about/about-mobile.mp4", type: "video/mp4", media: "(max-width: 767px)" },
       { key: "about/about-desktop.webm", type: "video/webm" },
       { key: "about/about-desktop.mp4", type: "video/mp4" },
     ],
   },
   ```
3. Use it, with an imported poster:
   ```tsx
   <BackgroundVideo asset="about" poster={aboutImg} alt="…" className="h-full w-full" />
   ```
   Add `priority` **only** for above-the-fold video. Everything else lazy-loads
   when it comes within 200px of the viewport.

## Playback behaviour

`BackgroundVideo` is poster-first: the poster `<img>` is always in the DOM and is
what paints first, and the `<video>` fades in over it only once it can actually
play. Every failure path resolves to "poster stays visible", so the layout never
shifts and a broken player is never shown.

It skips video entirely when:

- no media origin is configured;
- the user has `prefers-reduced-motion: reduce`;
- the browser reports `navigator.connection.saveData`;
- the effective connection type is 2G.

It also handles a rejected `play()` promise — autoplay refusal is a normal
platform outcome, not an error, and leaves the poster in place.

The `<video>` is `aria-hidden` because it is a moving version of the poster; the
poster's `alt` carries the description for assistive tech.

## Troubleshooting

| Symptom | Likely cause |
| --- | --- |
| Poster shows, video never starts | `VITE_MEDIA_BASE_URL` unset, or unset at *build* time — redeploy |
| 404 on the video URL | Object key mismatch between bucket and registry; check exact prefix |
| Downloads instead of playing | Missing/incorrect `--content-type` on upload |
| Plays on desktop, not mobile | Mobile rendition missing, or `media` query order wrong in the registry |
| Slow to start | MP4 missing `-movflags +faststart` |
| Old video still served after replacing | A key was overwritten in place; publish under a new key instead |
