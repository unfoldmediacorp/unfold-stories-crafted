import { useEffect, useRef, useState } from "react";

type Mode = "default" | "button" | "view";

/**
 * Desktop-only minimal cursor. Hidden on touch / coarse pointers.
 * Modes:
 *   default → 8px dot
 *   button  → 22px ring, subtle scale
 *   view    → 72px ring with "View" label (for images / video / figures)
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<Mode>("default");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    // The cursor hides the native pointer and runs a rAF loop for as long as
    // the page is open. Anyone who asked for reduced motion keeps their own.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setMounted(true);
    document.documentElement.classList.add("has-custom-cursor");

    let rx = 0,
      ry = 0,
      dx = 0,
      dy = 0;
    let raf = 0;

    const tick = () => {
      // Dot follows exactly, ring eases behind.
      rx += (dx - rx) * 0.22;
      ry += (dy - ry) * 0.22;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dx}px, ${dy}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      dx = e.clientX;
      dy = e.clientY;
      if (!visible) setVisible(true);

      const target = e.target as HTMLElement | null;
      const cursorAttr = target?.closest?.<HTMLElement>("[data-cursor]")?.dataset.cursor;
      if (cursorAttr === "view" || cursorAttr === "button") {
        setMode(cursorAttr);
        return;
      }
      const media = target?.closest?.("img,video,figure,picture");
      if (media) return setMode("view");
      const btn = target?.closest?.("a,button,[role='button']");
      if (btn) return setMode("button");
      setMode("default");
    };

    const onLeave = () => setVisible(false);
    const onDown = () => ringRef.current?.classList.add("cursor-press");
    const onUp = () => ringRef.current?.classList.remove("cursor-press");

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-custom-cursor");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!mounted) return null;

  const ringSize = mode === "view" ? 84 : mode === "button" ? 44 : 34;
  const ringOpacity = visible ? 1 : 0;

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: "9999px",
          background: "var(--accent-ink)",
          boxShadow: "0 0 0 2px var(--background), 0 2px 8px rgba(0,0,0,0.25)",
          pointerEvents: "none",
          zIndex: 9999,
          opacity: visible && mode !== "view" ? 1 : 0,
          transition: "opacity 200ms ease-out",
        }}
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="cursor-ring"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: ringSize,
          height: ringSize,
          borderRadius: "9999px",
          border: mode === "view" ? "1px solid var(--foreground)" : "1.5px solid var(--accent-ink)",
          background: mode === "view" ? "var(--foreground)" : "transparent",
          color: mode === "view" ? "var(--background)" : "var(--foreground)",
          pointerEvents: "none",
          zIndex: 9998,
          display: "grid",
          placeItems: "center",
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.22em",
          opacity: ringOpacity,
          boxShadow: mode === "default" ? "0 4px 14px rgba(0,0,0,0.08)" : "none",
          transition:
            "width 320ms cubic-bezier(0.22,1,0.36,1), height 320ms cubic-bezier(0.22,1,0.36,1), background-color 320ms ease-out, border-color 320ms ease-out, opacity 240ms ease-out",
        }}
      >
        {mode === "view" ? "View" : ""}
      </div>
    </>
  );
}
