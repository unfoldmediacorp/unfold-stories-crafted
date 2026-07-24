import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col bg-background text-foreground">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}

export function PageIntro({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: string;
}) {
  return (
    <section className="border-b border-border">
      <div className="max-w-[1400px] mx-auto px-6 pt-20 md:pt-28 pb-20 md:pb-32 grid grid-cols-12 gap-6 items-end">
        <div className="col-span-12 lg:col-span-8">
          <span className="label label-eyebrow text-accent-ink block mb-10">{eyebrow}</span>
          {/* Italic first line, roman second, echoing the "Cinematic /
              Perspectives." pairing in the home hero. Callers mark the roman
              half with `not-italic`. */}
          <h1 className="font-display font-semibold italic text-[clamp(3rem,9vw,8rem)] leading-[0.9] tracking-tighter">
            {title}
          </h1>
        </div>
        {lead && (
          <div className="col-span-12 lg:col-span-4">
            <p className="text-lg leading-[1.65] text-pretty text-muted-foreground max-w-md">
              {lead}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
