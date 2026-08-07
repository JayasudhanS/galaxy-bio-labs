import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { COMPANY } from "@/data/site";
import { Reveal } from "@/components/motion/Reveal";

export function ContactStrip() {
  return (
    <section className="gbl-container grid gap-12 py-24 md:grid-cols-[1fr_1fr] md:py-28">
      <div>
        <Reveal>
          <p className="eyebrow">Contact</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mt-5 max-w-md font-display text-4xl leading-[1.1] md:text-5xl">
            Visit the lab, or simply call
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <Link
            to="/contact"
            className="nav-underline mt-8 inline-block text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-primary"
          >
            Contact page
          </Link>
        </Reveal>
      </div>

      <dl className="space-y-8">
        {[
          { icon: MapPin, label: "Address", value: COMPANY.address },
          { icon: Phone, label: "Phone", value: COMPANY.phone },
          { icon: Mail, label: "Email", value: COMPANY.email },
        ].map((row, i) => (
          <Reveal key={row.label} delay={i * 0.08}>
            <div className="flex items-start gap-5 border-t border-border pt-6">
              <row.icon className="mt-1 size-4 shrink-0 text-primary" />
              <div>
                <dt className="text-[0.62rem] uppercase tracking-[0.22em] text-muted-foreground">
                  {row.label}
                </dt>
                <dd className="mt-2 font-display text-xl">{row.value}</dd>
              </div>
            </div>
          </Reveal>
        ))}
      </dl>
    </section>
  );
}
