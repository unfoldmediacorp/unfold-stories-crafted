import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Reveal } from "@/components/Reveal";
import { CtaLink } from "@/components/CtaButton";
import heroImg from "@/assets/hero.jpg";
import heroVideo from "@/assets/hero.mp4.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Unfold Media Corp — Cinematic Storytelling Studio, Coimbatore" },
      {
        name: "description",
        content:
          "A cinematic storytelling studio in Coimbatore, India. Brand films, founder stories, documentaries and campaigns for ambitious businesses.",
      },
      {
        property: "og:title",
        content: "Unfold Media Corp — Cinematic Storytelling Studio, Coimbatore",
      },
      {
        property: "og:description",
        content:
          "A cinematic storytelling studio in Coimbatore, India. Brand films, founder stories, documentaries and campaigns for ambitious businesses.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
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

const process = [
  {
    key: "i",
    title: "Discovery",
    body: "We listen. To the business, the founder, the audience, the reason this film needs to exist.",
  },
  {
    key: "ii",
    title: "Strategy",
    body: "A single-minded narrative — the throughline that every frame will serve.",
  },
  {
    key: "iii",
    title: "Production",
    body: "Considered direction, cinematic capture, natural light and human moments.",
  },
  {
    key: "iv",
    title: "Post Production",
    body: "Editing, colour, sound. The quiet craft where a film finds its final voice.",
  },
  {
    key: "v",
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
          <h1 className="col-span-12 lg:col-span-9 font-display font-semibold text-[clamp(3.5rem,12vw,10rem)] leading-[0.85] tracking-tighter animate-reveal">
            <em className="font-normal">Cinematic</em>
            <br />
            <span>Perspectives.</span>
          </h1>
          <div className="col-span-12 lg:col-span-4 lg:col-start-9 mt-10 lg:mt-0 animate-reveal [animation-delay:200ms]">
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

        <Reveal delay={300} className="mt-16 md:mt-24">
          <figure className="relative w-full aspect-[21/9] overflow-hidden bg-muted outline outline-1 -outline-offset-1 outline-black/5">
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
        </Reveal>
      </header>

      {/* Who We Are */}
      <section className="py-24 md:py-32 px-6 border-y border-border">
        <Reveal className="max-w-3xl mx-auto text-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-8 block">
            The Studio
          </span>
          <p className="font-display text-3xl md:text-4xl leading-snug text-pretty">
            Unfold Media Corp is a studio built around a single conviction — that a well-made film
            can change how a business is understood. We work with founders and companies who have
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

      {/* Selected Work — empty state */}
      <section className="py-32 md:py-48 px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex justify-between items-end mb-12">
            <h2 className="font-display font-semibold text-4xl md:text-5xl tracking-tighter">
              Selected Work
            </h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              In Production
            </span>
          </div>
          <Reveal className="border-t border-border pt-16 flex flex-col items-center justify-center min-h-[320px] text-center">
            <p className="font-display text-3xl md:text-4xl text-muted-foreground/70 italic mb-6">
              Silence before the symphony.
            </p>
            <p className="text-sm max-w-md text-muted-foreground/70 leading-relaxed">
              Our first collection of stories is currently in production. The archive will open here
              soon.
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
              We make <em className="font-normal">fewer films</em>, on purpose.
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
            Let's tell <em className="font-normal">your story</em>.
          </h2>
          <CtaLink to="/contact" size="lg">
            Start Your Project
          </CtaLink>
        </Reveal>
      </section>
    </PageShell>
  );
}
