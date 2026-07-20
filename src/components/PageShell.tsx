import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1">{children}</main>
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
      <div className="max-w-[1400px] mx-auto px-6 pt-16 md:pt-24 pb-16 md:pb-28 grid grid-cols-12 gap-6 items-end">
        <div className="col-span-12 lg:col-span-8">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent block mb-8">
            {eyebrow}
          </span>
          <h1 className="font-display text-[clamp(3rem,9vw,8rem)] leading-[0.9] tracking-tighter italic">
            {title}
          </h1>
        </div>
        {lead && (
          <div className="col-span-12 lg:col-span-4">
            <p className="text-lg leading-relaxed text-pretty text-muted-foreground max-w-md">
              {lead}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
