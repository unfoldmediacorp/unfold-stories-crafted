import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import logoU from "@/assets/logo-u.png";

const nav = [
  { to: "/services", label: "Services" },
  { to: "/process", label: "Process" },
  { to: "/about", label: "About" },
  { to: "/work", label: "Work" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on Escape, and whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <nav
      aria-label="Primary"
      className={
        "sticky top-0 z-50 transition-[background-color,backdrop-filter,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] " +
        (scrolled
          ? "bg-background/90 backdrop-blur-xl border-b border-border/80 shadow-[0_1px_0_rgba(0,0,0,0.02)]"
          : "bg-background/60 backdrop-blur-md border-b border-transparent")
      }
    >
      <div
        className={
          "flex items-center justify-between px-6 max-w-[1400px] mx-auto transition-[padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] " +
          (scrolled ? "py-3 md:py-4" : "py-6 md:py-8")
        }
      >
        <Link
          to="/"
          data-cursor="button"
          aria-label="Unfold Media Corp, home"
          className="flex items-center gap-3 md:gap-4 group"
        >
          <img
            src={logoU}
            alt=""
            className={
              "w-auto transition-[height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] " +
              (scrolled ? "h-14 md:h-16" : "h-16 md:h-20")
            }
          />
          <span className="flex flex-col leading-none">
            <span className="font-display text-3xl md:text-[2.75rem] font-semibold tracking-tight text-foreground">
              Unfold
            </span>
            {/* Tracking is tuned so the sublabel sets to roughly the width of
                the wordmark above it, keeping the lockup as one block. */}
            <span className="font-mono text-[11px] md:text-[13px] uppercase tracking-[0.34em] md:tracking-[0.36em] text-muted-foreground mt-2">
              Media Corp
            </span>
          </span>
        </Link>
        <div className="hidden md:flex gap-8 text-[13px] uppercase tracking-[0.16em] font-medium">
          {nav.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                data-cursor="button"
                aria-current={active ? "page" : undefined}
                className={
                  "relative py-1 transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-px after:bg-foreground after:origin-left after:scale-x-0 after:transition-transform after:duration-500 after:ease-[cubic-bezier(0.22,1,0.36,1)] hover:after:scale-x-100 " +
                  (active
                    ? "text-foreground after:scale-x-100"
                    : "text-muted-foreground hover:text-foreground")
                }
              >
                {item.label}
              </Link>
            );
          })}
        </div>
        <div className="hidden md:block label text-muted-foreground">CBE / IND</div>
        <button
          data-cursor="button"
          className="md:hidden label"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
      {open && (
        <div
          id="mobile-menu"
          className="md:hidden border-t border-border px-6 py-6 flex flex-col gap-5 text-sm uppercase tracking-[0.2em]"
        >
          {nav.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={active ? "text-foreground font-bold" : "text-muted-foreground"}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
