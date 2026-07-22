import { Link, type LinkProps } from "@tanstack/react-router";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

type Variant = "solid" | "outline" | "ghost";
type Size = "md" | "lg";

const base =
  "group/cta relative inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] font-medium " +
  "transition-[transform,background-color,color,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] " +
  "will-change-transform hover:-translate-y-[1px] hover:scale-[1.02] active:scale-[0.99] " +
  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const sizes: Record<Size, string> = {
  md: "px-8 py-3",
  lg: "px-10 py-4",
};

const variants: Record<Variant, string> = {
  solid:
    "bg-foreground text-background hover:bg-foreground/90",
  outline:
    "border border-foreground/50 bg-transparent text-foreground hover:border-foreground hover:bg-foreground/5",
  ghost:
    "text-foreground hover:opacity-70",
};

function Inner({
  children,
  withArrow,
}: {
  children: ReactNode;
  withArrow: boolean;
}) {
  return (
    <>
      <span>{children}</span>
      {withArrow && (
        <span
          aria-hidden="true"
          className="inline-block translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/cta:translate-x-1.5"
        >
          →
        </span>
      )}
    </>
  );
}

type CommonProps = {
  variant?: Variant;
  size?: Size;
  withArrow?: boolean;
  className?: string;
  children: ReactNode;
};

export function CtaLink({
  to,
  variant = "solid",
  size = "md",
  withArrow = true,
  className = "",
  children,
  ...rest
}: CommonProps & LinkProps) {
  return (
    <Link
      to={to}
      data-cursor="button"
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...rest}
    >
      <Inner withArrow={withArrow}>{children}</Inner>
    </Link>
  );
}

export function CtaAnchor({
  variant = "solid",
  size = "md",
  withArrow = true,
  className = "",
  children,
  ...rest
}: CommonProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      data-cursor="button"
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...rest}
    >
      <Inner withArrow={withArrow}>{children}</Inner>
    </a>
  );
}

export function CtaButton({
  variant = "solid",
  size = "md",
  withArrow = true,
  className = "",
  children,
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      data-cursor="button"
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...rest}
    >
      <Inner withArrow={withArrow}>{children}</Inner>
    </button>
  );
}
