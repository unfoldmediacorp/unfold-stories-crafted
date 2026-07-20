import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageIntro } from "@/components/PageShell";
import { Reveal } from "@/components/Reveal";
import { CtaLink } from "@/components/CtaButton";
import aboutImg from "@/assets/about.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Unfold Media Corp" },
      {
        name: "description",
        content:
          "Unfold Media Corp is a cinematic storytelling studio in Coimbatore. Our mission, vision, philosophy and studio culture.",
      },
      { property: "og:title", content: "About — Unfold Media Corp" },
      {
        property: "og:description",
        content:
          "A studio built on the belief that a well-made film can change how a business is understood.",
      },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <PageShell>
      <PageIntro
        eyebrow="About"
        title={
          <>
            A studio,
            <br />
            <span className="not-italic">not an agency.</span>
          </>
        }
        lead="We're a small, deliberate team based in Coimbatore, working with clients across India and beyond."
      />

      <section className="max-w-[1400px] mx-auto px-6 py-16 md:py-24 grid grid-cols-12 gap-6">
        <Reveal className="col-span-12 lg:col-span-7">
          <figure className="w-full aspect-[4/5] overflow-hidden bg-muted outline outline-1 -outline-offset-1 outline-black/5">
            <img
              src={aboutImg}
              alt="A cinema camera held up to the light"
              width={1400}
              height={1800}
              loading="lazy"
              className="w-full h-full object-cover object-[68%_38%] transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.02]"
            />
          </figure>
        </Reveal>

        <div className="col-span-12 lg:col-span-4 lg:col-start-9 space-y-16">
          <Reveal>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent block mb-6">
              Mission
            </span>
            <p className="font-display text-3xl md:text-4xl leading-[1.15] tracking-tight text-pretty">
              To help serious businesses tell serious stories — with the craft
              and restraint the subject deserves.
            </p>
          </Reveal>

          <Reveal>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent block mb-6">
              Vision
            </span>
            <p className="text-lg leading-relaxed text-muted-foreground text-pretty">
              A studio known for a small body of exceptional work rather than a
              large body of forgettable output. Films you remember years after
              you've seen them.
            </p>
          </Reveal>

          <Reveal>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent block mb-6">
              Philosophy
            </span>
            <p className="text-lg leading-relaxed text-muted-foreground text-pretty">
              We believe the best commercial films are quiet, patient and
              specific. They earn attention rather than demand it. They age
              well. They treat the audience like adults.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Founder message */}
      <section className="bg-foreground text-background py-24 md:py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent block mb-8">
              A note from the founder
            </span>
            <p className="font-display text-3xl md:text-5xl italic leading-[1.1] tracking-tighter mb-10 text-pretty">
              "We started Unfold because we were tired of watching good
              businesses be represented by bad films. There is a real
              difference between a video and a piece of cinema — and it matters."
            </p>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-background/60">
              Founder, Unfold Media Corp
            </div>
          </Reveal>
        </div>
      </section>

      {/* Studio culture / team placeholder */}
      <section className="py-24 md:py-32 px-6 border-t border-border">
        <div className="max-w-[1400px] mx-auto grid grid-cols-12 gap-6">
          <Reveal className="col-span-12 lg:col-span-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent block mb-6">
              Studio Culture
            </span>
            <h2 className="font-display font-semibold text-4xl md:text-5xl tracking-tighter leading-[0.95]">
              Small crews.
              <br />
              Long attention.
            </h2>
          </Reveal>
          <div className="col-span-12 lg:col-span-7 lg:col-start-6 space-y-6">
            <Reveal>
              <p className="text-lg leading-relaxed text-pretty">
                We stay small on purpose. Our projects are led by the people
                you'll meet in the first conversation — no handoffs, no
                account layers, no revolving door of freelancers.
              </p>
            </Reveal>
            <Reveal delay={80}>
              <p className="text-lg leading-relaxed text-muted-foreground text-pretty">
                The studio brings in specialist collaborators — cinematographers,
                colourists, composers, sound designers — chosen for the specific
                shape of each project. A rotating cast of extraordinary people,
                held together by a consistent point of view.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Team placeholder */}
      <section className="py-16 md:py-24 px-6 border-t border-border bg-muted/60">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-baseline justify-between mb-12">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.2em]">
              The Team
            </h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              In Progress
            </span>
          </div>
          <Reveal className="border-t border-border pt-16 flex flex-col items-center justify-center min-h-[240px] text-center">
            <p className="font-display text-2xl md:text-3xl italic text-muted-foreground/70 mb-4">
              Introductions coming soon.
            </p>
            <p className="text-sm max-w-md text-muted-foreground/70 leading-relaxed">
              We're preparing proper portraits of the people behind the studio.
              Until then, the work will speak first.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-24 md:py-32 px-6 text-center">
        <Reveal>
          <h2 className="font-display font-semibold text-5xl md:text-7xl mb-12 tracking-tighter">
            Work with <em className="font-normal">the studio</em>.
          </h2>
          <CtaLink to="/contact" size="lg">Start a Project</CtaLink>
        </Reveal>
      </section>
    </PageShell>
  );
}
