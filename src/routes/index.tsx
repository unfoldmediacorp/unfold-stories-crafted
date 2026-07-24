import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Reveal } from "@/components/Reveal";
import { CtaLink } from "@/components/CtaButton";
import heroImg from "@/assets/hero.jpg";
import heroVideo from "@/assets/hero.mp4.asset.json";
import { absoluteUrl } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Unfold Media Corp | Cinematic Storytelling Studio, Coimbatore" },
      {
        name: "description",
        content:
          "A cinematic storytelling studio in Coimbatore, India. Brand films, founder stories, documentaries and campaigns for ambitious businesses.",
      },
      {
        property: "og:title",
        content: "Unfold Media Corp | Cinematic Storytelling Studio, Coimbatore",
      },
      {
        property: "og:description",
        content:
          "A cinematic storytelling studio in Coimbatore, India. Brand films, founder stories, documentaries and campaigns for ambitious businesses.",
      },
      { property: "og:url", content: absoluteUrl("/") },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/") }],
  }),
  component: HomePage,
});

const services = [
  "Brand Films",
  "Corporate Films",
  "Founder Stories",
  "Documentaries",
  "Commercial Campaigns",
  "Photography",
  "Social-first Content",
] as const;

// The six canonical stages. Keep in step with src/routes/process.tsx, which
// carries the long-form version of each one.
const process = [
  {
    key: "i",
    title: "Discovery",
    body: "We listen. To the business, the founder, the audience, the reason this film needs to exist.",
  },
  {
    key: "ii",
    title: "Research",
    body: "Category, audience and history. The ideas that survive on set were resolved long before it.",
  },
  {
    key: "iii",
    title: "Creative Development",
    body: "A single-minded narrative: the throughline that every frame will serve.",
  },
  {
    key: "iv",
    title: "Production",
    body: "Considered direction, cinematic capture, natural light and human moments.",
  },
  {
    key: "v",
    title: "Editing",
    body: "Edit, colour, sound. The quiet craft where a film finds its final voice.",
  },
  {
    key: "vi",
    title: "Delivery",
    body: "Master files, cut-downs, and a release plan built for the platforms that matter.",
  },
] as const;

const principles = [
  {
    n: "01",
    title: "Story before spectacle.",
    body: "We chase meaning, not effects. The camera is in service of the sentence.",
  },
  {
    n: "02",
    title: "Purpose before production.",
    body: "Every shoot begins with why. Everything after answers to it.",
  },
  {
    n: "03",
    title: "Quality over quantity.",
    body: "Fewer films, made properly. We would rather ship one great piece than five average ones.",
  },
  {
    n: "04",
    title: "Built to last.",
    body: "We make films designed to work in five years, not five weeks.",
  },
] as const;

function HomePage() {
  return (
    <PageShell>
      {/* Hero */}
      <header className="relative px-6 pt-12 pb-16 md:pb-24 overflow-hidden">
        <div className="max-w-[1400px] mx-auto grid grid-cols-12 gap-4 md:gap-6 items-end">
          <h1 className="col-span-12 lg:col-span-9 font-display font-semibold text-[clamp(3.5rem,12vw,10rem)] leading-[0.85] tracking-tighter">
            <span className="title-mask">
              <em className="title-line font-normal">Cinematic</em>
            </span>
            <span className="title-mask">
              <span className="title-line [animation-delay:120ms]">Perspectives.</span>
            </span>
          </h1>
          <div className="col-span-12 lg:col-span-4 lg:col-start-9 mt-10 lg:mt-0 stage-rise [animation-delay:520ms]">
            <p className="text-lg md:text-xl leading-[1.65] text-pretty mb-10 max-w-md text-muted-foreground">
              A cinematic storytelling studio in Coimbatore, building films for businesses who
              prefer craft to noise.
            </p>
            <div className="flex flex-wrap gap-4">
              <CtaLink to="/contact">Start a Project</CtaLink>
              <CtaLink to="/process" variant="outline">
                Explore Our Process
              </CtaLink>
            </div>
          </div>
        </div>

        <figure className="relative w-full aspect-[21/9] mt-16 md:mt-24 overflow-hidden bg-muted outline outline-1 -outline-offset-1 outline-black/5 stage-aperture [animation-delay:340ms]">
          <video
            src={heroVideo.url}
            poster={heroImg}
            autoPlay
            loop
            muted
            playsInline
            preload="none"
            aria-label="Mist rolling over the Western Ghats at dawn, near Coimbatore"
            className="w-full h-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-black/10" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-background" />
        </figure>
      </header>

      {/* Who We Are */}
      <section className="py-24 md:py-32 px-6 border-y border-border">
        <Reveal className="max-w-3xl mx-auto text-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-8 block">
            The Studio
          </span>
          <p className="font-display text-3xl md:text-4xl leading-snug text-pretty">
            Unfold Media Corp is a studio built around a single conviction: a well-made film can
            change how a business is understood. We work with founders and companies who have
            something worth saying, and we help them say it with clarity, restraint and craft.
          </p>
        </Reveal>
      </section>

      {/* Services & Process split */}
      <section className="grid lg:grid-cols-2 border-b border-border">
        <div className="p-6 md:p-12 lg:border-r border-border">
          <div className="flex items-baseline justify-between mb-12">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.2em]">Services</h2>
            <Link
              to="/services"
              className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-accent transition-colors"
            >
              All →
            </Link>
          </div>
          <ul>
            {services.map((s, i) => (
              <Reveal key={s} delay={i * 60}>
                <li className="flex justify-between items-baseline border-b border-border py-5 group">
                  <span className="font-display text-2xl md:text-3xl transition-all duration-500 group-hover:italic group-hover:pl-3 group-hover:text-accent">
                    {s}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>

        <div className="p-6 md:p-12 bg-muted/60">
          <div className="flex items-baseline justify-between mb-12">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.2em]">The Methodology</h2>
            <Link
              to="/process"
              className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-accent transition-colors"
            >
              Full process →
            </Link>
          </div>
          <div className="space-y-10">
            {process.map((p, i) => (
              <Reveal key={p.key} delay={i * 80}>
                <div className="flex gap-6">
                  <span className="font-mono text-xs text-accent pt-1 w-8 shrink-0">{p.key}.</span>
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-tighter mb-2">{p.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                      {p.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Selected Work: teaser for the archive, which is still in production */}
      <section className="py-24 md:py-40 px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-wrap gap-x-8 gap-y-4 justify-between items-end mb-12">
            <h2 className="font-display font-semibold text-4xl md:text-5xl tracking-tighter">
              Selected Work
            </h2>
            <Link
              to="/work"
              className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-accent transition-colors"
            >
              The archive →
            </Link>
          </div>
          <Reveal className="border-t border-border pt-14 grid grid-cols-12 gap-6">
            <p className="col-span-12 md:col-span-7 font-display text-2xl md:text-3xl leading-snug text-pretty">
              The studio's first collection is in post-production. When it opens, it opens here.
            </p>
            <p className="col-span-12 md:col-span-4 md:col-start-9 text-sm text-muted-foreground leading-relaxed">
              Until then, the process page is the most honest account of how the work gets made, and
              the fastest way to judge whether we are right for yours.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Philosophy */}
      <section className="bg-foreground text-background py-24 md:py-32 px-6">
        <div className="max-w-[1400px] mx-auto">
          <Reveal className="mb-16 md:mb-24 max-w-2xl">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent block mb-6">
              Why Unfold
            </span>
            <h2 className="font-display font-semibold text-4xl md:text-5xl tracking-tighter leading-[1.05]">
              We make fewer films, on purpose.
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
            {principles.map((p, i) => (
              <Reveal key={p.n} delay={i * 80}>
                <div className="border-t border-background/20 pt-8">
                  <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] mb-6 text-accent">
                    {p.n}
                  </h4>
                  <p className="font-display text-lg mb-4">{p.title}</p>
                  <p className="text-xs text-background/60 leading-relaxed">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 md:py-48 px-6 text-center">
        <Reveal className="max-w-4xl mx-auto">
          <h2 className="font-display font-semibold text-6xl md:text-8xl mb-14 tracking-tighter leading-[0.95]">
            Let's tell your story.
          </h2>
          <CtaLink to="/contact" size="lg">
            Start Your Project
          </CtaLink>
        </Reveal>
      </section>
    </PageShell>
  );
}
