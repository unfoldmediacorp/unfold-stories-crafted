import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="max-w-[1400px] mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <div className="font-display text-3xl font-bold tracking-tighter mb-4">
            Unfold Media Corp
          </div>
          <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
            A cinematic storytelling studio in Coimbatore. Films for founders and
            businesses who prefer craft to noise.
          </p>
        </div>
        <div>
          <h5 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
            Studio
          </h5>
          <ul className="space-y-2 text-sm">
            <li><Link to="/services" className="hover:text-accent transition-colors">Services</Link></li>
            <li><Link to="/process" className="hover:text-accent transition-colors">Process</Link></li>
            <li><Link to="/about" className="hover:text-accent transition-colors">About</Link></li>
            <li><Link to="/work" className="hover:text-accent transition-colors">Work</Link></li>
            <li><Link to="/contact" className="hover:text-accent transition-colors">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
            Elsewhere
          </h5>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-accent transition-colors">Instagram</a></li>
            <li><a href="#" className="hover:text-accent transition-colors">Vimeo</a></li>
            <li><a href="#" className="hover:text-accent transition-colors">LinkedIn</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="max-w-[1400px] mx-auto px-6 py-6 flex flex-col md:flex-row justify-between gap-4 text-[10px] font-mono uppercase text-muted-foreground tracking-[0.2em]">
          <div>© {new Date().getFullYear()} Unfold Media Corp</div>
          <div>Coimbatore, Tamil Nadu, India</div>
          <div>All rights reserved</div>
        </div>
      </div>
    </footer>
  );
}
