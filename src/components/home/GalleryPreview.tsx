import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { GALLERY } from "@/data/site";
import { Reveal } from "@/components/motion/Reveal";

export function GalleryPreview() {
  const items = GALLERY.slice(0, 5);
  return (
    <section className="gbl-container py-24 md:py-32">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Reveal>
            <p className="eyebrow">Field notes</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-5 max-w-lg font-display text-4xl leading-[1.1] md:text-5xl">
              Moments from the farms and the lab
            </h2>
          </Reveal>
        </div>
        <Reveal delay={0.16}>
          <Link
            to="/gallery"
            className="nav-underline text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-primary"
          >
            View full gallery
          </Link>
        </Reveal>
      </div>

      <div className="mt-14 grid auto-rows-[13rem] grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {items.map((g, i) => (
          <motion.figure
            key={g.src}
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
            className={`group relative overflow-hidden rounded-3xl ${
              i === 0 ? "row-span-2" : i === 3 ? "col-span-2" : ""
            }`}
          >
            <img
              src={g.src}
              alt={g.alt}
              loading="lazy"
              className="size-full object-cover transition-transform duration-[1.4s] ease-[var(--ease-luxe)] group-hover:scale-108"
            />
          </motion.figure>
        ))}
      </div>
    </section>
  );
}
