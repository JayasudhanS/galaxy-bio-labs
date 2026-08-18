import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, FileText } from "lucide-react";
import { COMPANY, MODULES } from "@/data/site";
import logoMark from "@/assets/Galaxy_logo.jpeg";

const SOCIAL_LINKS = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/dr.shanmuganandam4/",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    name: "X (Twitter)",
    href: "https://x.com/DrShanBJP",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="size-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.26 10.99h-6.478l-5.194-6.795-5.938 6.795H1.67l7.73-8.835L1.5 2.25h6.634l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/Drshanmuganandam",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
];

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

          <div className="mt-6 flex items-center gap-3">
            {SOCIAL_LINKS.map((s) => {
              return <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.name} className="flex size-9 items-center justify-center rounded-full border border-primary-foreground/15 text-primary-foreground/60 transition-all duration-300 hover:border-accent hover:text-accent">{s.icon}</a>;
            })}
          </div>
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
              <FileText className="mt-0.5 size-4 shrink-0 text-accent" />
              <span>COR NUMBER : MDU/ALG/WS/31/2023-2028</span>
            </li>
            <li className="flex gap-3">
              <FileText className="mt-0.5 size-4 shrink-0 text-accent" />
              <span>GST NO : 33BUUPS7714Q1Z1</span>
            </li>
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