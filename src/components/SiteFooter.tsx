import { Link } from "@tanstack/react-router";
import { STUDIO } from "@/lib/site";

const linkCls =
  "relative inline-block py-0.5 transition-colors duration-300 hover:text-foreground " +
  "after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-px after:bg-current " +
  "after:origin-left after:scale-x-0 after:transition-transform after:duration-500 after:ease-[cubic-bezier(0.22,1,0.36,1)] hover:after:scale-x-100";

export function SiteFooter() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="max-w-[1400px] mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-4 gap-14">
        <div className="md:col-span-2">
          <div className="font-display text-3xl font-bold tracking-tighter mb-6">
            Unfold Media Corp
          </div>
          <p className="text-sm text-muted-foreground max-w-sm leading-relaxed mb-8">
            A cinematic storytelling studio in Coimbatore. Films for founders and businesses who
            prefer craft to noise.
          </p>
          <address className="not-italic text-sm text-muted-foreground leading-relaxed">
            {STUDIO.streetAddress}
            <br />
            {STUDIO.addressLocality} {STUDIO.postalCode}, {STUDIO.addressRegion}
            <div className="mt-4 flex flex-col items-start gap-1">
              <a href={`mailto:${STUDIO.email}`} data-cursor="button" className={linkCls}>
                {STUDIO.email}
              </a>
              <a
                href={`tel:${STUDIO.telephone.replace(/\s/g, "")}`}
                data-cursor="button"
                className={linkCls}
              >
                {STUDIO.telephone}
              </a>
            </div>
          </address>
        </div>
        <div>
          <h5 className="label text-muted-foreground mb-6">Studio</h5>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li>
              <Link to="/services" data-cursor="button" className={linkCls}>
                Services
              </Link>
            </li>
            <li>
              <Link to="/process" data-cursor="button" className={linkCls}>
                Process
              </Link>
            </li>
            <li>
              <Link to="/about" data-cursor="button" className={linkCls}>
                About
              </Link>
            </li>
            <li>
              <Link to="/work" data-cursor="button" className={linkCls}>
                Work
              </Link>
            </li>
            <li>
              <Link to="/contact" data-cursor="button" className={linkCls}>
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h5 className="label text-muted-foreground mb-6">Elsewhere</h5>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li>
              <a
                href="https://www.instagram.com/unfoldmediacorp"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="button"
                className={linkCls}
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/company/unfold-media-corp/"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="button"
                className={linkCls}
              >
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="max-w-[1400px] mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-3 label text-muted-foreground">
          <div>© {new Date().getFullYear()} Unfold Media Corp</div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-1 h-1 rounded-full bg-accent" />
            <span>Coimbatore · Tamil Nadu · India</span>
          </div>
          <div>All rights reserved</div>
        </div>
      </div>
    </footer>
  );
}
