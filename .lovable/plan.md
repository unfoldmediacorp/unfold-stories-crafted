# Unfold Media Corp — Website Plan

A quiet, editorial, cinematic site built on TanStack Start. Warm off-white, charcoal type, deep maroon accent, subtle paper texture. Typography-led, generous whitespace, no gradients/glass/blobs.

## Approach

1. **Explore 3 rendered design directions first** (via design directions), all locked to the same palette + typography, varying only in composition, density and rhythm. You pick one; I build it faithfully.
2. Implement the chosen direction across all 6 routes with reusable components.

## Pages & Routes

- `/` Home — Hero, Who We Are, Services overview, Process teaser, Selected Work (empty state), Why Unfold, Final CTA
- `/services` — Full breakdown, one section per service, outcomes-led copy
- `/process` — Discovery → Research → Creative Development → Production → Editing → Delivery, visual timeline
- `/about` — Mission, Vision, Philosophy, Founder message, Studio culture, team placeholder
- `/work` — "First collection in production" state + filter chips + empty card framework ready to populate
- `/contact` — Enquiry form, email, phone, Coimbatore address, Maps placeholder, socials

Each route gets its own `head()` metadata (title, description, og:title, og:description). Root sets sitewide defaults only.

## Design System

Defined in `src/styles.css` via `@theme` + `:root` tokens:

- `--background` warm off-white (~oklch 0.97 0.008 85)
- `--foreground` charcoal (~oklch 0.20 0.01 60)
- `--accent` deep maroon (~oklch 0.35 0.11 22)
- `--muted` / `--border` warm greys
- Subtle SVG paper-grain overlay utility
- Serif display (e.g. Instrument Serif / Fraunces) + neutral sans body (Inter Tight / Söhne-substitute) loaded via `<link>` in `__root.tsx`
- Oversized editorial scale, generous line-height, comfortable measure

## Reusable Components

`SiteHeader`, `SiteFooter`, `Container`, `SectionHeading`, `EditorialEyebrow`, `RevealOnScroll`, `MarqueeDivider`, `ServiceRow`, `ProcessStep`, `WorkCard` (empty-state aware), `CTASection`, `EnquiryForm`, `PaperTexture`.

## Motion

Fade-up on scroll (IntersectionObserver), subtle image scale on hover, smooth anchor scroll, restrained page transitions. No parallax gimmicks.

## Copy

Written in-file — confident, minimal, human. No fake stats, awards, logos, testimonials or placeholder projects.

## Out of scope (for now)

- Backend / form submission wiring (form is UI-only, ready for later Cloud enablement)
- Real portfolio content
- CMS

## Technical notes

- TanStack Start file-based routes under `src/routes/`
- Each page: `createFileRoute` + `head()`
- Fonts via `<link>` in `__root.tsx` head (never `@import` remote in CSS)
- Images: use generated hero/cinematic stills saved to `src/assets/`
- Accessibility: semantic landmarks, alt text, focus-visible, 44px targets
- No custom color classes in components — semantic tokens only

## Step 1 after approval

Generate 3 design directions for you to choose from before writing any route code.
