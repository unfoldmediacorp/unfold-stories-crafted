import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageIntro } from "@/components/PageShell";
import { Reveal } from "@/components/Reveal";
import { CtaLink } from "@/components/CtaButton";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { absoluteUrl } from "@/lib/site";
import aboutImg from "@/assets/about.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About | Unfold Media Corp" },
      {
        name: "description",
        content:
          "Unfold Media Corp is a cinematic storytelling studio in Coimbatore. Our mission, vision, philosophy and studio culture.",
      },
      { property: "og:title", content: "About | Unfold Media Corp" },
      {
        property: "og:description",
        content:
          "A studio built on the belief that a well-made film can change how a business is understood.",
      },
      { property: "og:url", content: absoluteUrl("/about") },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/about") }],
  }),
  component: AboutPage,
});

const people = [
  { name: "V. Keerthivhasan", role: "Managing Director" },
  { name: "Tarun Ramesh", role: "Technical Director" },
  { name: "Saktisri Venkat", role: "Creative Director" },
] as const;

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

      <section className="max-w-[1400px] mx-auto px-6 py-16 md:py-24">
        <Reveal distance={32} duration={900}>
          <figure className="relative w-full aspect-video overflow-hidden bg-muted outline outline-1 -outline-offset-1 outline-black/5">
            <BackgroundVideo
              asset="about"
              poster={aboutImg}
              alt="A cinema camera held up to the light"
              priority
              className="h-full w-full"
            />
            <div className="pointer-events-none absolute inset-0 bg-black/10" />
          </figure>
        </Reveal>

        <div className="mt-16 md:mt-24 space-y-20 md:space-y-28">
          <Reveal className="max-w-3xl mx-auto text-center">
            <span className="label label-eyebrow text-accent-ink block mb-6">Vision</span>
            <p className="font-display text-3xl md:text-4xl leading-[1.15] tracking-tight text-pretty">
              To shape a world where every business is understood before it is noticed.
            </p>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground text-pretty">
              We believe the strongest brands are built when people understand who they are, what
              they stand for, and why they matter. Our vision is to help businesses earn trust
              before they seek attention through branding, storytelling, and advertising that
              reflects who they truly are.
            </p>
          </Reveal>

          <Reveal className="max-w-3xl mx-auto text-center">
            <span className="label label-eyebrow text-accent-ink block mb-6">Mission</span>
            <p className="font-display text-3xl md:text-4xl leading-[1.15] tracking-tight text-pretty">
              To help businesses communicate clearly, build trust, and grow with confidence.
            </p>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground text-pretty">
              Every business has a story worth telling. Our mission is to uncover what makes each
              business different and turn it into branding, films, and advertising that people
              understand, remember, and trust.
            </p>
          </Reveal>

          <Reveal className="max-w-3xl mx-auto text-center">
            <span className="label label-eyebrow text-accent-ink block mb-6">Philosophy</span>
            <p className="font-display text-3xl md:text-4xl leading-[1.15] tracking-tight text-pretty">
              Unfold believes every brand should have a distinct voice. Every voice should find its
              right audience.
            </p>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground text-pretty">
              Advertising should do more than create awareness. It should create meaning, shape
              perception, and leave a brand stronger than before.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Founder message */}
      <section className="bg-foreground text-background py-24 md:py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <span className="label label-eyebrow text-accent block mb-8">
              A note from the founder
            </span>
            <blockquote className="font-display text-2xl md:text-4xl italic leading-[1.1] tracking-tighter mb-10 text-pretty">
              “Every brand deserves to be expressed, not just advertised. Express it with creativity
              and purpose, and the right people will find it. The right audience always leads to the
              right opportunities.”
            </blockquote>
            <div className="label text-background/60">Founder, Unfold Media Corp</div>
          </Reveal>
        </div>
      </section>

      {/* Studio culture / team placeholder */}
      <section className="py-24 md:py-32 px-6 border-t border-border">
        <div className="max-w-[1400px] mx-auto grid grid-cols-12 gap-6">
          <Reveal className="col-span-12 lg:col-span-4">
            <span className="label label-eyebrow text-accent-ink block mb-6">Studio Culture</span>
            <h2 className="font-display font-semibold text-3xl md:text-4xl tracking-tighter leading-[0.95]">
              Small crews.
              <br />
              Long attention.
            </h2>
          </Reveal>
          <div className="col-span-12 lg:col-span-7 lg:col-start-6 space-y-6">
            <Reveal>
              <p className="text-lg leading-relaxed text-pretty">
                The studio brings in specialist collaborators for the specific shape of each
                project: cinematographers, colourists, composers, sound designers. A rotating cast
                of extraordinary people, held together by a consistent point of view.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* People Behind Unfold */}
      <section className="py-16 md:py-24 px-6 border-t border-border bg-muted/60">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-baseline justify-between mb-12">
            <h2 className="label">People Behind Unfold</h2>
            <span className="label text-muted-foreground">Portraits Coming Soon</span>
          </div>
          <div className="border-t border-border pt-14 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
            {people.map((person, i) => (
              <Reveal key={person.name} delay={i * 80}>
                <figure>
                  <div className="w-full aspect-[4/5] bg-background outline outline-1 -outline-offset-1 outline-black/5 flex items-center justify-center">
                    <span className="label text-subtle">Portrait</span>
                  </div>
                  <figcaption className="pt-5">
                    <h3 className="font-display text-2xl tracking-tight">{person.name}</h3>
                    <p className="label text-muted-foreground mt-2">{person.role}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 px-6 text-center">
        <Reveal>
          <h2 className="font-display font-semibold text-3xl md:text-5xl mb-12 tracking-tighter">
            Work with us.
          </h2>
          <CtaLink to="/contact" size="lg">
            Start a Project
          </CtaLink>
        </Reveal>
      </section>
    </PageShell>
  );
}
