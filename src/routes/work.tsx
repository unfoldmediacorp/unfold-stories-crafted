import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell, PageIntro } from "@/components/PageShell";
import { Reveal } from "@/components/Reveal";
import { CtaLink } from "@/components/CtaButton";

export const Route = createFileRoute("/work")({
  head: () => ({
    meta: [
      { title: "Work — Unfold Media Corp" },
      {
        name: "description",
        content:
          "Selected work from Unfold Media Corp. Our first collection of stories is currently in production.",
      },
      { property: "og:title", content: "Work — Unfold Media Corp" },
      {
        property: "og:description",
        content: "Selected cinematic work — currently in production. The archive opens soon.",
      },
      { property: "og:url", content: "/work" },
    ],
    links: [{ rel: "canonical", href: "/work" }],
  }),
  component: WorkPage,
});

const filters = [
  "All",
  "Brand Films",
  "Founder Stories",
  "Documentaries",
  "Commercial",
  "Photography",
] as const;

// Empty portfolio framework — designed to be populated later.
type Project = {
  id: string;
  title: string;
  client: string;
  year: string;
  category: (typeof filters)[number];
  cover?: string;
};
const projects: Project[] = [];

function WorkPage() {
  const [active, setActive] = useState<(typeof filters)[number]>("All");
  const visible = projects.filter((p) => active === "All" || p.category === active);

  return (
    <PageShell>
      <PageIntro
        eyebrow="Selected Work"
        title={
          <>
            The
            <br />
            <span className="not-italic">Archive.</span>
          </>
        }
        lead="A curated body of cinematic work from the studio. Our first collection is currently in post-production."
      />

      <section className="max-w-[1400px] mx-auto px-6 py-12 md:py-16">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-border pb-6">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mr-2">
            Filter
          </span>
          {filters.map((f) => {
            const isActive = active === f;
            return (
              <button
                key={f}
                onClick={() => setActive(f)}
                className={`text-[11px] uppercase tracking-[0.2em] transition-colors ${
                  isActive ? "text-foreground font-bold" : "text-muted-foreground hover:text-accent"
                }`}
              >
                {f}
              </button>
            );
          })}
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-6 pb-24 md:pb-32">
        {visible.length === 0 ? (
          <Reveal className="border border-border py-24 md:py-40 flex flex-col items-center justify-center text-center bg-muted/40">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-8">
              In Production
            </span>
            <p className="font-display text-4xl md:text-6xl italic tracking-tighter text-muted-foreground/80 mb-6">
              Silence before the symphony.
            </p>
            <p className="text-sm max-w-md text-muted-foreground/80 leading-relaxed mb-10">
              Our first collection of stories is currently in production. When the archive opens, it
              will live here.
            </p>
            <CtaLink to="/contact" variant="outline">
              Enquire about upcoming work
            </CtaLink>
          </Reveal>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {visible.map((p) => (
              <WorkCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
}

function WorkCard({ project }: { project: Project }) {
  return (
    <article className="group cursor-pointer">
      <figure className="aspect-[4/3] overflow-hidden bg-muted mb-4 outline outline-1 -outline-offset-1 outline-black/5">
        {project.cover ? (
          <img
            src={project.cover}
            alt={project.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.03]"
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-muted-foreground/40 font-mono text-[10px] uppercase tracking-[0.2em]">
            Frame pending
          </div>
        )}
      </figure>
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-display text-2xl italic tracking-tighter group-hover:text-accent transition-colors">
          {project.title}
        </h3>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground shrink-0">
          {project.year}
        </span>
      </div>
      <p className="text-sm text-muted-foreground mt-1">
        {project.client} — {project.category}
      </p>
    </article>
  );
}
