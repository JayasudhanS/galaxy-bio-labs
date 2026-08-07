import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Reveal, RevealText } from "@/components/motion/Reveal";
import { aboutLab } from "@/data/site";

export function AboutIntro() {
  return (
    <section className="relative overflow-hidden py-24 md:py-36">
      <div
        aria-hidden
        className="floaty pointer-events-none absolute -left-32 top-24 size-80 rounded-full opacity-[0.06]"
        style={{ background: "var(--gradient-forest)" }}
      />
      <div className="gbl-container grid items-center gap-14 lg:grid-cols-[1fr_0.85fr] lg:gap-24">
        <div>
          <Reveal>
            <p className="eyebrow">The company</p>
          </Reveal>
          <h2 className="mt-6 font-display text-4xl leading-[1.06] md:text-[3.4rem]">
            <RevealText text="We work where biology, soil and water meet" />
          </h2>
          <Reveal delay={0.2}>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground">
              Galaxy Bio Labs formulates biological inputs and natural food products from a single research
              floor. What begins as a strain in a petri dish is trialled on working farms and ponds before it
              is ever bottled. Placeholder company narrative — replace with the client's own story.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <Link
              to="/about"
              className="nav-underline mt-9 inline-block text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-primary"
            >
              Read our story
            </Link>
          </Reveal>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="relative overflow-hidden rounded-[2.5rem] shadow-[var(--shadow-lift)]">
            <img
              src={aboutLab}
              alt="Inside the Galaxy Bio Labs research facility"
              width={1000}
              height={1200}
              loading="lazy"
              className="aspect-4/5 w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-8 -left-8 hidden max-w-[13rem] rounded-3xl bg-[var(--forest-deep)] px-7 py-6 text-primary-foreground shadow-[var(--shadow-float)] sm:block">
            <p className="font-display text-3xl text-accent">ISO</p>
            <p className="mt-2 text-xs leading-relaxed text-primary-foreground/60">
              Quality systems maintained across every production batch.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
