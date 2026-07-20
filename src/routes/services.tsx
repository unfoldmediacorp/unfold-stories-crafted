import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageIntro } from "@/components/PageShell";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Unfold Media Corp" },
      {
        name: "description",
        content:
          "Brand films, corporate films, founder stories, documentaries, commercial campaigns, photography and social-first content.",
      },
      { property: "og:title", content: "Services — Unfold Media Corp" },
      {
        property: "og:description",
        content:
          "A studio built for cinematic brand films, founder stories, documentaries and campaigns.",
      },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesPage,
});

const services = [
  {
    n: "01",
    title: "Brand Films",
    outcome:
      "A film that gives your brand a spine — the piece your team, investors and customers all point to when they explain who you are.",
    detail:
      "Long-form cinematic storytelling designed to sit at the top of your website and hold up in a boardroom five years from now.",
  },
  {
    n: "02",
    title: "Corporate Films",
    outcome:
      "Internal and external communication that respects the intelligence of the room it will play in.",
    detail:
      "Annual reports, culture films, investor and stakeholder updates — treated as considered pieces of communication, not filler.",
  },
  {
    n: "03",
    title: "Founder Stories",
    outcome:
      "A single, honest portrait of the person behind the business — told without gloss, without cliché.",
    detail:
      "Intimate interviews, patient observation, quiet edits. The film your founder will actually be comfortable sharing.",
  },
  {
    n: "04",
    title: "Documentaries",
    outcome:
      "Long-form work that treats your subject with the seriousness of a magazine feature.",
    detail:
      "Sector, craft and cultural documentaries developed with real research, real access and a considered point of view.",
  },
  {
    n: "05",
    title: "Commercial Campaigns",
    outcome:
      "Campaign work designed to move business metrics without embarrassing the brand.",
    detail:
      "Concept, script, direction and delivery across a full campaign — hero film, cut-downs, stills and social edits from a single shoot.",
  },
  {
    n: "06",
    title: "Photography",
    outcome:
      "Editorial stills that share the language of the film — one visual identity across every touchpoint.",
    detail:
      "Portraits, product, environment and reportage photography, shot on the same day and in the same key as the film.",
  },
  {
    n: "07",
    title: "Social-first Content",
    outcome:
      "Short-form work that still looks like it came from a studio, not a template.",
    detail:
      "Verticals, teasers and episodic series built around the same story, cut for how people actually watch.",
  },
] as const;

function ServicesPage() {
  return (
    <PageShell>
      <PageIntro
        eyebrow="Services"
        title={
          <>
            What we
            <br />
            <span className="not-italic">make.</span>
          </>
        }
        lead="Seven disciplines, one studio. Every engagement is scoped to the outcome you need — not the deliverables list you were sold last time."
      />

      <section className="max-w-[1400px] mx-auto px-6 py-16 md:py-24">
        <div className="divide-y divide-border border-y border-border">
          {services.map((s, i) => (
            <Reveal key={s.n} delay={i * 40}>
              <article className="grid grid-cols-12 gap-6 py-12 md:py-16 group">
                <div className="col-span-12 md:col-span-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground pt-3">
                  {s.n}
                </div>
                <div className="col-span-12 md:col-span-5">
                  <h2 className="font-display text-4xl md:text-5xl italic tracking-tighter leading-[0.95] transition-colors group-hover:text-accent">
                    {s.title}
                  </h2>
                </div>
                <div className="col-span-12 md:col-span-6 space-y-4 max-w-xl">
                  <p className="text-lg leading-relaxed text-pretty">
                    {s.outcome}
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {s.detail}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="py-24 md:py-32 px-6 text-center border-t border-border">
        <Reveal>
          <h2 className="font-display text-5xl md:text-7xl italic mb-10 tracking-tighter">
            Have a project in mind?
          </h2>
          <Link
            to="/contact"
            className="inline-block px-10 py-4 bg-foreground text-background text-[11px] uppercase tracking-[0.3em] font-medium hover:bg-accent transition-colors"
          >
            Start a Project
          </Link>
        </Reveal>
      </section>
    </PageShell>
  );
}
