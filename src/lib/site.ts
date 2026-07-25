/**
 * Canonical site identity, used for absolute canonical/og URLs and JSON-LD.
 *
 * Canonical and og:url must be absolute to be reliable across crawlers and
 * social scrapers. Set VITE_SITE_URL per environment if the production domain
 * differs from the default below.
 */
export const SITE_URL = (
  (import.meta.env.VITE_SITE_URL as string | undefined) ?? "https://unfoldmediacorp.com"
).replace(/\/+$/, "");

/** Joins a route path onto the canonical origin. */
export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export const SITE_NAME = "Unfold Media Corp";

export const SITE_DESCRIPTION =
  "A cinematic storytelling studio in Coimbatore, India. Brand films, founder stories, documentaries and campaigns for ambitious businesses.";

export const STUDIO = {
  email: "Unfoldmediacorp@gmail.com",
  telephone: "+91 74188 98911",
  streetAddress: "Nagappa Complex, 1076, Mettupalayam Rd, Vadakovai, R.S. Puram",
  addressLocality: "Coimbatore",
  addressRegion: "Tamil Nadu",
  postalCode: "641002",
  addressCountry: "IN",
  latitude: 11.0168,
  longitude: 76.9558,
  instagram: "https://www.instagram.com/unfoldmediacorp",
  linkedin: "https://www.linkedin.com/company/unfold-media-corp/",
} as const;

/**
 * LocalBusiness schema for the studio. Local search is the main discovery
 * channel for a production house working out of one city, and none of this
 * was previously exposed to crawlers.
 */
export function studioJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "Organization"],
    "@id": `${SITE_URL}/#studio`,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    email: STUDIO.email,
    telephone: STUDIO.telephone,
    address: {
      "@type": "PostalAddress",
      streetAddress: STUDIO.streetAddress,
      addressLocality: STUDIO.addressLocality,
      addressRegion: STUDIO.addressRegion,
      postalCode: STUDIO.postalCode,
      addressCountry: STUDIO.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: STUDIO.latitude,
      longitude: STUDIO.longitude,
    },
    areaServed: "IN",
    sameAs: [STUDIO.instagram, STUDIO.linkedin],
    knowsAbout: [
      "Brand Films",
      "Corporate Films",
      "Founder Stories",
      "Documentaries",
      "Commercial Campaigns",
      "Photography",
      "Social-first Content",
    ],
  };
}
