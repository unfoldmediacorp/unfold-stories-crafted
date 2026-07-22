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

  return (
    <nav
      className={
        "sticky top-0 z-50 transition-[background-color,backdrop-filter,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] " +
        (scrolled
          ? "bg-background/90 backdrop-blur-xl border-b border-border/80 shadow-[0_1px_0_rgba(0,0,0,0.02)]"
          : "bg-background/60 backdrop-blur-md border-b border-transparent")
      }
    >
      <div
        className={
          "flex items-baseline justify-between px-6 max-w-[1400px] mx-auto transition-[padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] " +
          (scrolled ? "py-3 md:py-4" : "py-6 md:py-8")
        }
      >
        <Link
          to="/"
          data-cursor="button"
          className="font-display text-2xl font-bold tracking-tighter"
        >
          UNFOLD
        </Link>
        <div className="hidden md:flex gap-8 text-[11px] uppercase tracking-[0.2em] font-medium">
          {nav.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                data-cursor="button"
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
        <div className="hidden md:block text-[10px] font-mono uppercase text-muted-foreground">
          CBE / IND
        </div>
        <button
          data-cursor="button"
          className="md:hidden text-[11px] font-mono uppercase tracking-[0.2em]"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-border px-6 py-6 flex flex-col gap-4 text-sm uppercase tracking-[0.2em]">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={
                pathname === item.to
                  ? "text-foreground font-bold"
                  : "text-muted-foreground"
              }
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
