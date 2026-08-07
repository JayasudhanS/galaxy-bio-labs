import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { COMPANY, MODULES } from "@/data/site";
import logoMark from "@/assets/logo-mark.png";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[var(--forest-deep)] text-primary-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 -top-40 size-[28rem] rounded-full opacity-[0.09]"
        style={{ background: "var(--gradient-forest)" }}
      />
      <div className="gbl-container relative grid gap-14 py-20 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <div className="flex items-center gap-3">
            <img src={logoMark} alt="" width={40} height={40} loading="lazy" className="size-10 rounded-full bg-background/95 p-1.5" />
            <span className="font-display text-lg">{COMPANY.name}</span>
          </div>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-primary-foreground/60">
            {COMPANY.blurb}
          </p>
        </div>

        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.24em] text-primary-foreground/45">Explore</p>
          <ul className="mt-5 space-y-3 text-sm">
            {[
              { to: "/", label: "Home" },
              { to: "/about", label: "About" },
              { to: "/products", label: "Products" },
              { to: "/gallery", label: "Gallery" },
              { to: "/contact", label: "Contact" },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="nav-underline text-primary-foreground/70 hover:text-primary-foreground">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.24em] text-primary-foreground/45">Modules</p>
          <ul className="mt-5 space-y-3 text-sm">
            {MODULES.map((m) => (
              <li key={m.slug}>
                <Link
                  to="/products/$category"
                  params={{ category: m.slug }}
                  className="nav-underline text-primary-foreground/70 hover:text-primary-foreground"
                >
                  {m.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.24em] text-primary-foreground/45">Reach us</p>
          <ul className="mt-5 space-y-4 text-sm text-primary-foreground/70">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-accent" />
              {COMPANY.address}
            </li>
            <li className="flex gap-3">
              <Phone className="size-4 shrink-0 text-accent" />
              {COMPANY.phone}
            </li>
            <li className="flex gap-3">
              <Mail className="size-4 shrink-0 text-accent" />
              {COMPANY.email}
            </li>
          </ul>
        </div>
      </div>

      <div className="gbl-container relative flex flex-col gap-3 border-t border-primary-foreground/10 py-7 text-xs text-primary-foreground/45 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} {COMPANY.name}. Placeholder content.</p>
        <p>{COMPANY.hours}</p>
      </div>
    </footer>
  );
}
