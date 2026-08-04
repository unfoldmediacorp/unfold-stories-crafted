import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageIntro } from "@/components/PageShell";
import { Reveal } from "@/components/Reveal";
import { CtaLink } from "@/components/CtaButton";
import { absoluteUrl } from "@/lib/site";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services | Unfold Media Corp" },
      {
        name: "description",
        content:
          "Advertisements, brand story films, social media marketing, founder stories, brand strategy and creative direction.",
      },
      { property: "og:title", content: "Services | Unfold Media Corp" },
      {
        property: "og:description",
        content:
          "An advertising and creative studio: campaigns, brand story films, social media, brand strategy and creative direction.",
      },
      { property: "og:url", content: absoluteUrl("/services") },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/services") }],
  }),
  component: ServicesPage,
});

const services = [
  {
    n: "01",
    title: "Advertisements",
    outcome: "Advertising is about creating relevance, not just visibility.",
    detail:
      "We craft campaigns rooted in insights, helping brands connect with their audience in ways that are memorable and effective.",
  },
  {
    n: "02",
    title: "Brand Story Films",
    outcome: "Every brand has a story, a meaning.",
    detail:
      "We tell the narrative, the purpose, the tensions, the authenticity it stands for. We shape them into stories which people believe.",
  },
  {
    n: "03",
    title: "Social Media Marketing",
    outcome: "Social media is where brands build relationships.",
    detail:
      "We create thoughtful content and conversations that strengthen the presence, foster engagement and help grow communities over time.",
  },
  {
    n: "04",
    title: "Founder Stories",
    outcome: "People connect with people before they connect with companies.",
    detail:
      "We help founders articulate their vision, values and journey, building trust through authentic and compelling narratives.",
  },
  {
    n: "05",
    title: "Brand Strategy",
    outcome: "Strong brands are built on clarity, not assumptions.",
    detail:
      "Through research, cultural understanding and strategic thinking, we define the direction that guides every decision your brand makes.",
  },
  {
    n: "06",
    title: "Creative Direction",
    outcome: "Creativity is most powerful when guided by purpose.",
    detail:
      "We shape visual identities, campaigns and experiences with a clear strategic vision, ensuring every expression feels intentional and consistent.",
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
        lead="Six disciplines, one studio. Every engagement is scoped to the outcome you need, not the deliverables list you were sold last time."
      />

      <section className="max-w-[1400px] mx-auto px-6 py-16 md:py-24">
        <div className="divide-y divide-border border-y border-border">
          {services.map((s, i) => (
            <Reveal key={s.n} delay={i * 40}>
              <article className="grid grid-cols-12 gap-x-6 gap-y-3 md:gap-6 py-12 md:py-16 group">
                {/* Catalogue index, set as a display figure so it reads at a
                    glance and sits level with the discipline it numbers. */}
                <div className="col-span-12 md:col-span-1 index-numeral text-accent-ink">{s.n}</div>
                <div className="col-span-12 md:col-span-5">
                  <h2 className="font-display font-semibold text-3xl md:text-4xl tracking-tighter leading-[0.95] transition-colors duration-500 group-hover:text-accent-ink">
                    {s.title}
                  </h2>
                </div>
                <div className="col-span-12 md:col-span-6 space-y-4 max-w-xl">
                  <p className="text-lg leading-relaxed text-pretty">{s.outcome}</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">{s.detail}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="py-24 md:py-32 px-6 text-center border-t border-border">
        <Reveal>
          <h2 className="font-display font-semibold text-3xl md:text-5xl mb-12 tracking-tighter">
            Have a project in mind?
          </h2>
          <CtaLink to="/contact" size="lg">
            Start a Project
          </CtaLink>
        </Reveal>
      </section>
    </PageShell>
  );
}
