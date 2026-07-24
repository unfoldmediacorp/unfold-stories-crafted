import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { PageShell, PageIntro } from "@/components/PageShell";
import { Reveal } from "@/components/Reveal";
import { CtaButton } from "@/components/CtaButton";
import { absoluteUrl } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact | Unfold Media Corp" },
      {
        name: "description",
        content:
          "Get in touch with Unfold Media Corp, a cinematic storytelling studio in Coimbatore, India.",
      },
      { property: "og:title", content: "Contact | Unfold Media Corp" },
      {
        property: "og:description",
        content: "Studio enquiries, project briefs and collaborations. Coimbatore, India.",
      },
      { property: "og:url", content: absoluteUrl("/contact") },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/contact") }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const confirmationRef = useRef<HTMLDivElement | null>(null);

  // The form is replaced by the confirmation, so move focus with it.
  useEffect(() => {
    if (sent) confirmationRef.current?.focus();
  }, [sent]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      company: String(formData.get("company") || ""),
      phone: String(formData.get("phone") || ""),
      brief: String(formData.get("brief") || ""),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json().catch(() => ({}))) as { error?: string };

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setSent(true);
      form.reset();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
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
        lead="Tell us a little about the project: timeline, scope, and what the film needs to do. We reply personally within two working days."
      />

      <section className="max-w-[1400px] mx-auto px-6 py-16 md:py-24 grid grid-cols-12 gap-8">
        {/* Left: details */}
        <aside className="col-span-12 lg:col-span-4 space-y-12">
          <Reveal>
            <h3 className="label text-muted-foreground mb-4">Studio</h3>
            <p className="font-display font-semibold text-2xl leading-snug">
              Unfold Media Corp
              <br />
              Nagappa Complex, Mettupalayam Rd
              <br />
              R.S. Puram, Coimbatore 641002
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h3 className="label text-muted-foreground mb-4">Enquiries</h3>
            <ul className="space-y-2 text-lg">
              <li>
                <a
                  href="mailto:Unfoldmediacorp@gmail.com"
                  className="hover:text-accent-ink transition-colors border-b border-border pb-1"
                >
                  Unfoldmediacorp@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+917418898911" className="hover:text-accent-ink transition-colors">
                  +91 74188 98911
                </a>
              </li>
            </ul>
          </Reveal>
          <Reveal delay={160}>
            <h3 className="label text-muted-foreground mb-4">Elsewhere</h3>
            <ul className="flex flex-col gap-2 text-sm uppercase tracking-[0.2em]">
              <li>
                <a
                  href="https://www.instagram.com/unfoldmediacorp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent-ink transition-colors"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/company/unfold-media-corp/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent-ink transition-colors"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </Reveal>
        </aside>

        {/* Right: form */}
        <div className="col-span-12 lg:col-span-7 lg:col-start-6">
          {sent ? (
            <Reveal className="border-t border-border pt-16">
              <div
                ref={confirmationRef}
                tabIndex={-1}
                role="status"
                aria-live="polite"
                className="focus:outline-none"
              >
                <span className="label label-eyebrow text-accent-ink block mb-6">Received</span>
                <h2 className="font-display text-4xl md:text-5xl tracking-tighter mb-6">
                  Thank you.
                </h2>
                <p className="text-lg text-muted-foreground max-w-md">
                  Your note is with us. We'll write back personally within two working days.
                </p>
              </div>
            </Reveal>
          ) : (
            <Reveal>
              <form onSubmit={onSubmit} className="space-y-10" aria-busy={loading}>
                <Field
                  label="Your name"
                  name="name"
                  autoComplete="name"
                  required
                  disabled={loading}
                />
                <Field
                  label="Business email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  disabled={loading}
                />
                <Field
                  label="Company"
                  name="company"
                  autoComplete="organization"
                  disabled={loading}
                />
                <Field
                  label="Phone (optional)"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  disabled={loading}
                />
                <TextArea
                  label="Tell us about the project"
                  name="brief"
                  required
                  disabled={loading}
                />
                {error && (
                  <p className="text-sm text-destructive" role="alert" aria-live="polite">
                    {error}
                  </p>
                )}
                <CtaButton type="submit" size="lg" className="mt-4" disabled={loading}>
                  {loading ? "Sending..." : "Send enquiry"}
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
            <h3 className="label">The Studio, Coimbatore</h3>
            <span className="label text-muted-foreground">11.0168° N / 76.9558° E</span>
          </div>
          <div className="w-full aspect-[21/9] outline outline-1 -outline-offset-1 outline-black/5 overflow-hidden">
            <iframe
              title="Map of Unfold Media Corp studio, Coimbatore"
              src="https://www.google.com/maps?q=Nagappa%20Complex%2C%201076%2C%20Mettupalayam%20Rd%2C%20Vadakovai%2C%20R.S.%20Puram%2C%20Coimbatore%2C%20Tamil%20Nadu%20641002&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </PageShell>
  );
}

const fieldCls =
  "w-full bg-transparent border-b border-border py-3 text-lg transition-colors " +
  "hover:border-foreground/40 focus:border-foreground " +
  "disabled:opacity-50 disabled:cursor-not-allowed";

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  required,
  disabled,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <label className="block group">
      <span className="label text-muted-foreground block mb-3">
        {label}
        {required && (
          <span className="text-accent-ink" aria-hidden="true">
            {" *"}
          </span>
        )}
      </span>
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        disabled={disabled}
        className={`${fieldCls} font-display`}
      />
    </label>
  );
}

function TextArea({
  label,
  name,
  required,
  disabled,
}: {
  label: string;
  name: string;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="label text-muted-foreground block mb-3">
        {label}
        {required && (
          <span className="text-accent-ink" aria-hidden="true">
            {" *"}
          </span>
        )}
      </span>
      <textarea
        name={name}
        required={required}
        disabled={disabled}
        rows={5}
        className={`${fieldCls} resize-none`}
      />
    </label>
  );
}
