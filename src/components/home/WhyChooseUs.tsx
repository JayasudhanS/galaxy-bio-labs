import { motion } from "framer-motion";
import { FlaskConical, Leaf, ShieldCheck, Truck } from "lucide-react";
import { STATS } from "@/data/site";
import { Reveal, RevealText } from "@/components/motion/Reveal";
import { Counter } from "@/components/motion/Counter";

const REASONS = [
  {
    icon: FlaskConical,
    title: "Research first",
    copy: "Every formulation is developed and validated in our own laboratory before it reaches a field trial.",
  },
  {
    icon: ShieldCheck,
    title: "Batch traceability",
    copy: "Each batch carries its own quality record, from raw material sourcing to final packaging.",
  },
  {
    icon: Leaf,
    title: "Residue conscious",
    copy: "Biological chemistry designed to work with the system, not against it — safe for soil and water.",
  },
  {
    icon: Truck,
    title: "Dependable supply",
    copy: "Regional warehousing and a trained field network keep the product moving when the season peaks.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden bg-secondary py-24 md:py-32">
      <div
        aria-hidden
        className="floaty pointer-events-none absolute -right-24 top-10 size-72 rounded-full opacity-[0.07]"
        style={{ background: "var(--gradient-forest)" }}
      />
      <div className="gbl-container relative">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Reveal>
              <p className="eyebrow">Why choose us</p>
            </Reveal>
            <h2 className="mt-5 font-display text-4xl leading-[1.08] md:text-5xl">
              <RevealText text="Trust is built in the details nobody sees" />
            </h2>
            <Reveal delay={0.2}>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
                Placeholder positioning copy. Replace with the company's own credentials, certifications and
                partner network when available.
              </p>
            </Reveal>
          </div>

          <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
            {REASONS.map((r, i) => (
              <Reveal key={r.title} delay={i * 0.08}>
                <div className="group border-t border-foreground/12 pt-6">
                  <r.icon className="size-5 text-primary transition-transform duration-500 group-hover:-translate-y-1" />
                  <h3 className="mt-4 font-display text-xl">{r.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{r.copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <motion.dl
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 grid grid-cols-2 gap-y-10 border-t border-foreground/12 pt-12 md:grid-cols-4"
        >
          {STATS.map((s) => (
            <div key={s.label}>
              <dt className="font-display text-4xl text-primary md:text-5xl">
                <Counter value={s.value} suffix={s.suffix} />
              </dt>
              <dd className="mt-2 text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground">
                {s.label}
              </dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
