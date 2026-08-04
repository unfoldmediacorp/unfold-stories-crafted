import { useEffect, useRef, useState } from "react";
import { resolveVideoSources, type VideoAssetName } from "@/lib/media";

type BackgroundVideoProps = {
  /** Registry entry in `src/lib/media.ts`. */
  asset: VideoAssetName;
  /** Imported poster image. Always rendered; it is the fallback and the LCP element. */
  poster: string;
  /** Describes the footage. Used as the poster's alt text. */
  alt: string;
  /**
   * Load as soon as the component mounts instead of waiting for the element to
   * approach the viewport. Use for above-the-fold heroes; leave off elsewhere.
   */
  priority?: boolean;
  className?: string;
};

type ResolvedSource = { src: string; type: string; media?: string };

/**
 * Picks the single best rendition for this device.
 *
 * Deliberately done in JS rather than with <source> children. React inserts the
 * <video> into the DOM before its children are attached, so a video carrying
 * `autoPlay`/`preload` starts resource selection with no sources, immediately
 * fires `error`, and trips the failure path before the real sources exist.
 * Choosing here means the element is only ever rendered with a final `src`, and
 * an `error` afterwards always means a genuine load failure.
 *
 * Selection runs once on mount. Re-picking on resize would restart playback
 * mid-scroll, which is worse than serving a slightly larger rendition to a
 * window that changed size.
 */
function pickSource(sources: ResolvedSource[]): ResolvedSource | null {
  const probe = document.createElement("video");
  const eligible = sources.filter((s) => !s.media || window.matchMedia(s.media).matches);
  return (
    eligible.find((s) => probe.canPlayType(s.type) === "probably") ??
    eligible.find((s) => probe.canPlayType(s.type) === "maybe") ??
    null
  );
}

/**
 * Poster-first background video.
 *
 * The poster <img> is always in the DOM and is what the page paints first; the
 * <video> fades in over it only once it can actually play. Every failure path —
 * no media origin configured, no playable rendition, a decode or network error,
 * autoplay blocked, reduced-motion, save-data — resolves to "poster stays
 * visible", so the layout never shifts and a broken player is never shown.
 *
 * The <video> is aria-hidden because it is a moving version of the poster; the
 * poster's alt text carries the description for assistive tech.
 */
export function BackgroundVideo({
  asset,
  poster,
  alt,
  priority = false,
  className = "",
}: BackgroundVideoProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const sources = resolveVideoSources(asset);
  const hasSources = sources.length > 0;

  // Stays null through SSR and until the element is wanted, so the server never
  // emits a video URL and the browser never fetches one speculatively.
  const [src, setSrc] = useState<string | null>(null);
  const [canPlay, setCanPlay] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!hasSources) return;

    // Anyone who asked for reduced motion keeps the still frame.
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    // Save-Data / effective connection type: skip video on metered or slow links.
    const connection = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    if (connection?.saveData) return;
    if (connection?.effectiveType && /(^|-)2g$/.test(connection.effectiveType)) return;

    const start = () => {
      const chosen = pickSource(sources);
      // No rendition this browser can decode: keep the poster.
      if (chosen) setSrc(chosen.src);
    };

    if (priority) {
      start();
      return;
    }

    const node = containerRef.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      start();
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          start();
          io.disconnect();
        }
      },
      // Start fetching slightly before the element scrolls into view.
      { rootMargin: "200px 0px" },
    );
    io.observe(node);
    return () => io.disconnect();
    // `sources` is derived from module-level config and is stable per asset.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasSources, priority, asset]);

  // autoplay can still be refused (power saving, platform policy). That is a
  // normal outcome, not an error: keep the poster and stay quiet.
  useEffect(() => {
    if (!src) return;
    const video = videoRef.current;
    if (!video) return;
    const attempt = video.play();
    if (attempt && typeof attempt.catch === "function") attempt.catch(() => {});
  }, [src]);

  const showVideo = src !== null && !failed;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <img
        src={poster}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover"
        {...(priority
          ? { fetchPriority: "high" as const, decoding: "sync" as const }
          : { loading: "lazy" as const, decoding: "async" as const })}
      />
      {showVideo && (
        <video
          ref={videoRef}
          src={src}
          aria-hidden="true"
          tabIndex={-1}
          autoPlay
          loop
          muted
          playsInline
          // The poster attribute is deliberately omitted: the <img> above already
          // paints it, and setting both makes the browser fetch it twice.
          preload="auto"
          onCanPlay={() => setCanPlay(true)}
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ opacity: canPlay ? 1 : 0 }}
        />
      )}
    </div>
  );
}
