import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";

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

  return (
    <nav className="sticky top-0 z-50 bg-background/85 backdrop-blur-md border-b border-border">
      <div className="flex items-baseline justify-between px-6 py-6 md:py-8 max-w-[1400px] mx-auto">
        <Link to="/" className="font-display text-2xl font-bold tracking-tighter">
          UNFOLD
        </Link>
        <div className="hidden md:flex gap-8 text-[11px] uppercase tracking-[0.2em] font-medium">
          {nav.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={
                  active
                    ? "text-foreground font-bold"
                    : "text-muted-foreground hover:text-accent transition-colors"
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
