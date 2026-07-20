import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageIntro } from "@/components/PageShell";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/process")({
  head: () => ({
    meta: [
      { title: "Process — Unfold Media Corp" },
      {
        name: "description",
        content:
          "How we work: discovery, research, creative development, production, editing and delivery.",
      },
      { property: "og:title", content: "Process — Unfold Media Corp" },
      {
        property: "og:description",
        content:
          "A patient, six-step process from discovery to delivery. Built for considered work.",
      },
      { property: "og:url", content: "/process" },
    ],
    links: [{ rel: "canonical", href: "/process" }],
  }),
  component: ProcessPage,
});

const steps = [
  {
    n: "i",
    title: "Discovery",
    lead: "Understanding what actually needs to be said.",
    body: "We begin every project with a series of conversations — with founders, with teams, with the people you serve. No cameras, no decks. Just the work of understanding what a film needs to do and, more importantly, what it doesn't.",
  },
  {
    n: "ii",
    title: "Research",
    lead: "Context before creative.",
    body: "We study the category, the audience and the history of the subject. Good films are almost always the result of good research — the ideas that appear on set were resolved long before it.",
  },
  {
    n: "iii",
    title: "Creative Development",
    lead: "Finding the throughline.",
    body: "We write the film before we shoot it. Treatment, script, look, sound, structure. You approve a single-minded direction before a single frame is committed to.",
  },
  {
    n: "iv",
    title: "Production",
    lead: "The shoot itself.",
    body: "Small crews, patient shoots, natural light where possible. We prepare thoroughly and then leave room for the moments no one could have written.",
  },
  {
    n: "v",
    title: "Editing",
    lead: "Where a film becomes itself.",
    body: "Edit, colour, sound design and score. The stage where most films are won or lost — and where we spend the time to get it right.",
  },
  {
    n: "vi",
    title: "Delivery",
    lead: "Handing over the finished piece.",
    body: "Master files, versions, subtitles, cut-downs, stills — delivered clearly, catalogued properly, and ready for wherever the work needs to live.",
  },
] as const;

function ProcessPage() {
  return (
    <PageShell>
      <PageIntro
        eyebrow="Process"
        title={
          <>
            The
            <br />
            <span className="not-italic">Methodology.</span>
          </>
        }
        lead="Six stages. Linear in discipline, patient in execution. Every project moves through them, no matter its size."
      />

      <section className="max-w-[1400px] mx-auto px-6 py-16 md:py-24">
        <ol>
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 60}>
              <li className="grid grid-cols-12 gap-6 border-t border-border py-14 md:py-20 last:border-b">
                <div className="col-span-12 md:col-span-2 font-mono text-xs text-accent uppercase tracking-[0.2em]">
                  Step {s.n}.
                </div>
                <div className="col-span-12 md:col-span-5">
                  <h2 className="font-display text-4xl md:text-6xl italic tracking-tighter leading-[0.95] mb-4">
                    {s.title}
                  </h2>
                  <p className="font-display text-xl text-muted-foreground">
                    {s.lead}
                  </p>
                </div>
                <div className="col-span-12 md:col-span-5">
                  <p className="text-lg leading-relaxed text-pretty max-w-lg">
                    {s.body}
                  </p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="py-24 md:py-32 px-6 text-center border-t border-border bg-muted/60">
        <Reveal>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent block mb-6">
            Ready when you are
          </span>
          <h2 className="font-display text-5xl md:text-7xl italic mb-10 tracking-tighter">
            Start with a conversation.
          </h2>
          <Link
            to="/contact"
            className="inline-block px-10 py-4 bg-foreground text-background text-[11px] uppercase tracking-[0.3em] font-medium hover:bg-accent transition-colors"
          >
            Get in touch
          </Link>
        </Reveal>
      </section>
    </PageShell>
  );
}
