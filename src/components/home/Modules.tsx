import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { MODULES, type CategorySlug } from "@/data/site";
import { Reveal } from "@/components/motion/Reveal";
import { getAllProducts } from "@/lib/db-service";

type Counts = Record<CategorySlug, number>;

export function Modules() {
  const [counts, setCounts] = useState<Counts | null>(null);

  useEffect(() => {
    let active = true;
    getAllProducts().then((list) => {
      if (!active) return;
      const next: Counts = {
        "agri-inputs": 0,
        aquaculture: 0,
        "ornamental-fish": 0,
        "food-products": 0,
      };
      for (const p of list) {
        if (p.status === "Active" && p.category in next) {
          next[p.category] += 1;
        }
      }
      setCounts(next);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="relative bg-[var(--forest-deep)] pb-16 pt-10 text-primary-foreground sm:pb-24 sm:pt-16 md:py-32">
      <div className="gbl-container">
        <Reveal>
          <p className="eyebrow text-accent">Four modules</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mt-5 max-w-2xl font-display text-4xl leading-[1.08] md:text-5xl">
            One laboratory, four living systems
          </h2>
        </Reveal>

        <div
          className="mt-6 grid gap-3 sm:mt-14 sm:gap-6"
          style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}
        >
          {MODULES.map((m, i) => {
            const count = counts ? counts[m.slug] : undefined;
            return (
              <motion.div
                key={m.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8, delay: i * 0.05 }}
              >
                <Link
                  to="/products/$category"
                  params={{ category: m.slug }}
                  className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-primary-foreground/10 bg-primary-foreground/[0.03]"
                >
                  <div className="relative h-24 w-full overflow-hidden sm:h-56">
                    <img
                      src={m.image}
                      alt={m.name}
                      width={1200}
                      height={1000}
                      loading="lazy"
                      className="size-full scale-105 object-cover opacity-80 transition-all duration-[1.2s] ease-[var(--ease-luxe)] group-hover:scale-100 group-hover:opacity-100"
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-t from-[var(--forest-deep)] via-[var(--forest-deep)]/10 to-transparent"
                    />
                    <span className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full border border-primary-foreground/25 bg-[var(--forest-deep)]/60 backdrop-blur transition-all duration-500 group-hover:border-accent group-hover:bg-accent group-hover:text-[var(--forest-deep)] sm:right-5 sm:top-5 sm:size-11">
                      <ArrowUpRight className="size-3 sm:size-4" />
                    </span>
                    <span className="absolute left-2 top-2 font-display text-xs text-accent sm:left-5 sm:top-5 sm:text-sm">{m.index}</span>
                  </div>

                  <div className="flex flex-1 flex-col justify-between gap-3 p-3.5 sm:gap-6 sm:p-7 md:p-8">
                    <div>
                      <h3 className="font-display text-base leading-tight transition-transform duration-700 ease-[var(--ease-luxe)] group-hover:translate-x-1 sm:text-2xl md:text-3xl">
                        {m.name}
                      </h3>
                      <p className="mt-1.5 max-w-sm text-[0.7rem] leading-relaxed text-primary-foreground/55 sm:mt-2 sm:text-sm">
                        {m.headline}
                      </p>
                    </div>

                    <div className="h-3 text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-primary-foreground/45 sm:h-4 sm:text-[0.7rem] sm:tracking-[0.2em]">
                      {count === undefined ? (
                        <span className="inline-block h-3 w-16 animate-pulse rounded-full bg-primary-foreground/10 sm:w-20" />
                      ) : (
                        <span>
                          {count} {count === 1 ? "Product" : "Products"}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}