import { useEffect, useState } from "react";

/**
 * Premium first-load screen. Off-white background, centered wordmark,
 * fades out after ~800ms. Only shown on the initial visit per tab.
 */
export function LoadingScreen() {
  const [done, setDone] = useState(false);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("unfold_intro_played") === "1") {
      setDone(true);
      return;
    }
    const t1 = window.setTimeout(() => setFade(true), 550);
    const t2 = window.setTimeout(() => {
      sessionStorage.setItem("unfold_intro_played", "1");
      setDone(true);
    }, 900);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  if (done) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        background: "var(--background)",
        display: "grid",
        placeItems: "center",
        opacity: fade ? 0 : 1,
        transition: "opacity 340ms cubic-bezier(0.22,1,0.36,1)",
        pointerEvents: fade ? "none" : "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14,
          transform: fade ? "translateY(-4px)" : "translateY(0)",
          transition: "transform 340ms cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <div className="font-display text-5xl md:text-6xl font-bold tracking-tighter">Unfold</div>
        <div className="label label-eyebrow text-muted-foreground">Media Corp</div>
      </div>
    </div>
  );
}
