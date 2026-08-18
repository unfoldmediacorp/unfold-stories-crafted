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

Two buckets. Public access on R2 is **bucket-wide**, so masters cannot live in
the same bucket as delivery files without becoming publicly downloadable.

```
unfold-media-corp/            ← PUBLIC (r2.dev enabled)
  hero/
    hero-desktop-v2.mp4     1920×1080   H.264   ~1.9 MB
    hero-desktop-v2.webm    1920×1080   VP9     ~0.9 MB
    hero-mobile-v2.mp4       960×540    H.264   ~0.4 MB
  about/
    about-desktop.mp4       1920×1080   H.264   ~4.9 MB
    about-desktop.webm      1920×1080   VP9     ~1.5 MB
    about-mobile.mp4         960×540    H.264   ~0.6 MB
    about-mobile.webm        960×540    VP9     ~0.4 MB

unfold-media-corp-masters/    ← PRIVATE (no public access, ever)
  hero/
    hero-source.mp4     1920×1080   H.264   ~3.0 MB   ← archive only, never served
  about/
    about-source.mp4    1920×1080   H.264   ~9.5 MB   ← archive only, never served
```

The masters bucket holds the original high-quality source for every asset.
Nothing in it is ever referenced by the site — it exists so a video can be
re-encoded later (different size, better codec, new crop) without hunting for
the original. Extra buckets are free; R2 bills storage volume, not bucket count.

Masters are **not** committed to this repository: they are large binaries, and
git history here cannot be rewritten to remove them.

The hero master (1920×1080, 30 fps, 6.53 s, md5
`8707bec26d36ee0baf26e1c02e115652`) is staged locally at
`media/hero/hero-source.mp4` (gitignored) and archived in the private bucket.
The delivery renditions were published under a `-v2` suffix, per *Replacing a
video* below, since the previous `hero/hero-desktop.mp4` etc. keys are cached
immutably. The old `hero/*.mp4`/`.webm` (non-`-v2`) objects are left in the
public bucket, now unreferenced by the registry; delete them once confident no
client is still relying on a stale bundle.

There is deliberately **no mobile WebM for the hero**: at 960px VP9 encoded
*larger* than H.264 for this footage, so it would cost mobile users bytes for
nothing. Desktop WebM is kept because it is ~19% smaller than the desktop MP4.

The about master (1920×1080, 25 fps, 17.2 s, md5
`c3f876911d16b1f2eb2d074ca8ee90e7`) is staged locally at
`media/about/about-source.mp4` (gitignored) and archived in the private
bucket. This was a first-time upload under the `about/` prefix — no existing
key to collide with, so the delivery renditions use plain (unversioned) names.
Unlike the hero, mobile WebM beats mobile H.264 for this footage (~27%
smaller), so About ships four renditions instead of three — WebM is offered
first at both breakpoints, H.264 as the fallback.

Source selection is ordered in `src/lib/media.ts`. The browser takes the first
`<source>` whose `media` query matches and whose `type` it can decode, so
narrower queries must be listed first.

## One-time R2 setup

Already done; recorded here so it can be reproduced or audited.

1. Buckets **`unfold-media-corp`** (public) and **`unfold-media-corp-masters`**
   (private) exist in the Cloudflare dashboard.
2. Public access is enabled on the delivery bucket only:
   ```bash
   wrangler r2 bucket dev-url enable unfold-media-corp
   ```
   The r2.dev subdomain is **temporary**. It is rate-limited and not intended
   for production traffic. Once `unfoldmediacorp.com` is on Cloudflare, attach a
   custom domain and swap `VITE_MEDIA_BASE_URL` to it — no code change:
   ```bash
   wrangler r2 bucket domain add unfold-media-corp --domain media.unfoldmediacorp.com
   ```
   Never enable public access on `unfold-media-corp-masters`.
3. Set a long cache lifetime. Object keys are versioned by hand (see
   *Replacing a video*), so objects can be treated as immutable:
   ```
   Cache-Control: public, max-age=31536000, immutable
   ```
4. CORS is **not** required for plain `<video>` playback from a different
   origin. Only add it if a future feature reads frames into a canvas.

## Uploading

With Wrangler (`npx wrangler`, then `wrangler login`):

> **`--remote` is mandatory on every `r2 object` command.** Wrangler v4 defaults
> to a *local simulator* — without the flag it writes to `.wrangler/state/` on
> your machine, prints a cheerful `Upload complete.`, and touches nothing in
> Cloudflare. The only hint is a quiet `Resource location: local` line. This has
> already bitten once. Applies to `get` and `delete` too: a `get` without
> `--remote` reads the simulator and can appear to "verify" an upload that never
> happened.

```bash
# Master → PRIVATE bucket. Archive only, never served, so no cache header.
wrangler r2 object put unfold-media-corp-masters/hero/hero-source.mp4 --remote \
  --file media/hero/hero-source.mp4 \
  --content-type video/mp4

# Delivery renditions → PUBLIC bucket. What the site actually loads.
wrangler r2 object put unfold-media-corp/hero/hero-desktop.mp4 --remote \
  --file media/hero/hero-desktop.mp4 \
  --content-type video/mp4 \
  --cache-control "public, max-age=31536000, immutable"

wrangler r2 object put unfold-media-corp/hero/hero-desktop.webm --remote \
  --file media/hero/hero-desktop.webm \
  --content-type video/webm \
  --cache-control "public, max-age=31536000, immutable"

wrangler r2 object put unfold-media-corp/hero/hero-mobile.mp4 --remote \
  --file media/hero/hero-mobile.mp4 \
  --content-type video/mp4 \
  --cache-control "public, max-age=31536000, immutable"
```

Setting `--content-type` matters: served as `application/octet-stream`, the
`<source type>` hint stops matching and playback fails.

### Verifying an upload

There is no `wrangler r2 object info`. Verify over HTTP against the public base
URL — this checks existence, headers and integrity in one step, and (unlike a
`wrangler get`) cannot be fooled by the local simulator:

```bash
BASE=https://pub-9de675d6e8c7442b96ddaeeb50d43e49.r2.dev
curl -sI "$BASE/hero/hero-desktop.mp4" |
  grep -Ei '^(HTTP|content-type|content-length|cache-control|etag)'
```

For a single-part upload R2's `ETag` is the object's MD5, so it can be compared
straight against the local file (`md5sum media/hero/hero-desktop.mp4`).

Freshly enabled r2.dev subdomains return **401 for a few minutes** while access
propagates, and objects flip to 200 individually rather than all at once. A 401
right after enabling is propagation, not a misconfiguration — re-check before
changing anything.

Private-bucket objects have no public URL, so verify those by round-tripping:

```bash
wrangler r2 object get unfold-media-corp-masters/hero/hero-source.mp4 --remote \
  --file /tmp/check.mp4
md5sum /tmp/check.mp4 media/hero/hero-source.mp4   # must match
```

## Pointing the site at the bucket

**Set it in the committed `.env` at the repo root. No dashboard configuration is
needed.**

```
VITE_MEDIA_BASE_URL="https://pub-9de675d6e8c7442b96ddaeeb50d43e49.r2.dev"
```

That is the temporary r2.dev origin. Replace it with
`https://media.unfoldmediacorp.com` once the custom domain is attached — one
line, no code edit.

### Why `.env` and not the Vercel dashboard

`.env` is **tracked in git here** and deliberately not gitignored: Lovable
commits it (it is where the `VITE_SUPABASE_*` values live). Since Vercel builds
from the repository, the file is present on the builder and Vite reads it there
exactly as it does locally.

`@lovable.dev/vite-tanstack-config` resolves the value at build time with:

```js
const loadedEnv = loadEnv(mode, process.cwd(), "VITE_");
for (const [k, v] of Object.entries(loadedEnv))
  envDefine[`import.meta.env.${k}`] = JSON.stringify(v);
```

So every `import.meta.env.VITE_*` is replaced by a **string literal** in the
bundle. Two consequences:

- The name must be written out literally in source. A dynamic lookup such as
  ``import.meta.env[`VITE_MEDIA_${name}`]`` is never substituted and resolves to
  `undefined`. This is why `src/lib/media.ts` spells out each override.
- The value is frozen at build time. Changing it requires a rebuild, never just
  a restart.

Precedence, from Vite's `loadEnv`: `.env` files are read first, then any
`VITE_`-prefixed variable in `process.env` **overrides** them. A Vercel
dashboard variable would therefore still win if one were ever set — the
committed `.env` is a default, not a lock.

Only reach for the dashboard for a value that must **differ per environment** or
must not be committed. Neither applies here: this is a public bucket URL that
ships in the client bundle regardless, so committing it leaks nothing.

Worth knowing: this project is Lovable-managed, and the Vercel deployment is
wired up through that integration rather than created by hand. If you open the
Vercel project and the Environment Variables screen is not where you expect, use
`.env` — it is the supported path for this setup and the one Lovable itself
uses.

`VITE_*` variables are inlined at **build time**, so a redeploy is required —
changing the value alone does nothing until the next build.

## Encoding a new video

The `media/` directory is gitignored; it is a staging area for renditions before
upload. Always keep the master and upload it to the private masters bucket —
re-encoding from an already-compressed delivery file compounds artefacts.
Working from that master:

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

The `about` asset (see *Bucket layout* above) is a worked example of this — a
second entry added after the hero, including the extra mobile WebM source
since it happened to pay off for that footage.

1. Encode and upload renditions under a new prefix, e.g. `gallery/`.
2. Add an entry to `VIDEO` in `src/lib/media.ts`:
   ```ts
   gallery: {
     width: 1920,
     height: 1080,
     sources: [
       { key: "gallery/gallery-mobile.mp4", type: "video/mp4", media: "(max-width: 767px)" },
       { key: "gallery/gallery-desktop.webm", type: "video/webm" },
       { key: "gallery/gallery-desktop.mp4", type: "video/mp4" },
     ],
   },
   ```
3. Use it, with an imported poster:
   ```tsx
   <BackgroundVideo asset="gallery" poster={galleryImg} alt="…" className="h-full w-full" />
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
| Poster shows, video never starts | `VITE_MEDIA_BASE_URL` empty in `.env`, or changed without rebuilding — values are inlined at build time |
| 404 on the video URL | Object key mismatch between bucket and registry; check exact prefix |
| Downloads instead of playing | Missing/incorrect `--content-type` on upload |
| Plays on desktop, not mobile | Mobile rendition missing, or `media` query order wrong in the registry |
| Slow to start | MP4 missing `-movflags +faststart` |
| Old video still served after replacing | A key was overwritten in place; publish under a new key instead |
| `Upload complete.` but the object is not in R2 | `--remote` was omitted; it went to the local simulator (`Resource location: local`) |
| 401 on every object just after enabling r2.dev | Public access still propagating; wait a few minutes and re-check |
