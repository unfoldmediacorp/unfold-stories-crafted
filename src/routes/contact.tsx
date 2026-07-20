import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { PageShell, PageIntro } from "@/components/PageShell";
import { Reveal } from "@/components/Reveal";
import { CtaButton } from "@/components/CtaButton";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Unfold Media Corp" },
      {
        name: "description",
        content:
          "Get in touch with Unfold Media Corp, a cinematic storytelling studio in Coimbatore, India.",
      },
      { property: "og:title", content: "Contact — Unfold Media Corp" },
      {
        property: "og:description",
        content:
          "Studio enquiries, project briefs and collaborations. Coimbatore, India.",
      },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <PageShell>
      <PageIntro
        eyebrow="Contact"
        title={
          <>
            Start a
            <br />
            <span className="not-italic">conversation.</span>
          </>
        }
        lead="Tell us a little about the project — timeline, scope, and what the film needs to do. We reply personally within two working days."
      />

      <section className="max-w-[1400px] mx-auto px-6 py-16 md:py-24 grid grid-cols-12 gap-8">
        {/* Left: details */}
        <aside className="col-span-12 lg:col-span-4 space-y-12">
          <Reveal>
            <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
              Studio
            </h3>
            <p className="font-display text-2xl italic leading-snug">
              Unfold Media Corp
              <br />
              Coimbatore, Tamil Nadu
              <br />
              India
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
              Enquiries
            </h3>
            <ul className="space-y-2 text-lg">
              <li>
                <a
                  href="mailto:hello@unfoldmediacorp.com"
                  className="hover:text-accent transition-colors border-b border-border pb-1"
                >
                  hello@unfoldmediacorp.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+919999999999"
                  className="hover:text-accent transition-colors"
                >
                  +91 99999 99999
                </a>
              </li>
            </ul>
          </Reveal>
          <Reveal delay={160}>
            <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
              Elsewhere
            </h3>
            <ul className="flex flex-col gap-2 text-sm uppercase tracking-[0.2em]">
              <li><a href="#" className="hover:text-accent transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Vimeo</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">LinkedIn</a></li>
            </ul>
          </Reveal>
        </aside>

        {/* Right: form */}
        <div className="col-span-12 lg:col-span-7 lg:col-start-6">
          {sent ? (
            <Reveal className="border-t border-border pt-16">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent block mb-6">
                Received
              </span>
              <h2 className="font-display text-4xl md:text-5xl italic tracking-tighter mb-6">
                Thank you.
              </h2>
              <p className="text-lg text-muted-foreground max-w-md">
                Your note is with us. We'll write back personally within two
                working days.
              </p>
            </Reveal>
          ) : (
            <Reveal>
              <form onSubmit={onSubmit} className="space-y-10">
                <Field label="Your name" name="name" required />
                <Field label="Business email" name="email" type="email" required />
                <Field label="Company" name="company" />
                <Field label="Phone (optional)" name="phone" type="tel" />
                <TextArea label="Tell us about the project" name="brief" required />
                <CtaButton type="submit" size="lg" className="mt-4">
                  Send enquiry
                </CtaButton>
              </form>
            </Reveal>
          )}
        </div>
      </section>

      {/* Map placeholder */}
      <section className="border-t border-border">
        <div className="max-w-[1400px] mx-auto px-6 py-16">
          <div className="flex items-baseline justify-between mb-8">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.2em]">
              The Studio, Coimbatore
            </h3>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              11.0168° N / 76.9558° E
            </span>
          </div>
          <div
            aria-label="Map of Coimbatore studio location"
            className="w-full aspect-[21/9] bg-muted grid place-items-center outline outline-1 -outline-offset-1 outline-black/5 relative overflow-hidden"
          >
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            <div className="relative flex flex-col items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-accent" />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                Map coming soon
              </span>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block group">
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-3">
        {label}
        {required && <span className="text-accent"> *</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full bg-transparent border-b border-border py-3 text-lg font-display italic focus:outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/40"
      />
    </label>
  );
}

function TextArea({
  label,
  name,
  required,
}: {
  label: string;
  name: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-3">
        {label}
        {required && <span className="text-accent"> *</span>}
      </span>
      <textarea
        name={name}
        required={required}
        rows={5}
        className="w-full bg-transparent border-b border-border py-3 text-lg focus:outline-none focus:border-foreground transition-colors resize-none"
      />
    </label>
  );
}
