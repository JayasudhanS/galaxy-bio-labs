import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { MODULES } from "@/data/site";
import { Reveal } from "@/components/motion/Reveal";

export function Modules() {
  return (
    <section className="relative bg-[var(--forest-deep)] py-24 text-primary-foreground md:py-32">
      <div className="gbl-container">
        <Reveal>
          <p className="eyebrow text-accent">Four modules</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mt-5 max-w-2xl font-display text-4xl leading-[1.08] md:text-5xl">
            One laboratory, four living systems
          </h2>
        </Reveal>
      </div>

      <div className="mt-16 border-t border-primary-foreground/10">
        {MODULES.map((m, i) => (
          <motion.div
            key={m.slug}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="group relative border-b border-primary-foreground/10"
          >
            <Link
              to="/products/$category"
              params={{ category: m.slug }}
              className="gbl-container grid items-center gap-8 py-10 md:grid-cols-[6rem_1fr_1.1fr_3rem] md:py-14"
            >
              <span className="font-display text-sm text-accent">{m.index}</span>

              <div>
                <h3 className="font-display text-3xl transition-transform duration-700 ease-[var(--ease-luxe)] group-hover:translate-x-2 md:text-[2.6rem]">
                  {m.name}
                </h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-primary-foreground/55">
                  {m.headline}
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div className="relative h-40 w-full max-w-[16rem] overflow-hidden rounded-2xl md:h-32">
                  <img
                    src={m.image}
                    alt={m.name}
                    width={1200}
                    height={1000}
                    loading="lazy"
                    className="size-full scale-105 object-cover opacity-70 transition-all duration-[1.2s] ease-[var(--ease-luxe)] group-hover:scale-100 group-hover:opacity-100"
                  />
                </div>
                <ul className="hidden shrink-0 space-y-1.5 text-xs text-primary-foreground/45 lg:block">
                  {m.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              </div>

              <span className="flex size-11 items-center justify-center justify-self-end rounded-full border border-primary-foreground/20 transition-all duration-500 group-hover:border-accent group-hover:bg-accent group-hover:text-[var(--forest-deep)]">
                <ArrowUpRight className="size-4" />
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
