import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { GALLERY } from "@/data/site";
import { QuoteCTA } from "@/components/home/QuoteCTA";

const title = "Gallery — inside Galaxy Bio Labs";
const description =
  "Photographs from the Galaxy Bio Labs research floor, partner farms, aquaculture ponds and ornamental hatcheries.";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Gallery,
});

function Gallery() {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const current = lightbox === null ? null : GALLERY[lightbox];

  return (
    <>
      <PageHeader
        eyebrow="Gallery"
        title="The work, as it actually looks"
        copy="Placeholder imagery — swap in the company's own photography whenever it is ready."
      />

      <section className="gbl-container columns-1 gap-5 py-20 sm:columns-2 lg:columns-3 md:py-28">
        {GALLERY.map((g, i) => (
          <motion.button
            key={g.src + i}
            onClick={() => setLightbox(i)}
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="group mb-5 block w-full overflow-hidden rounded-3xl"
          >
            <img
              src={g.src}
              alt={g.alt}
              loading="lazy"
              className="w-full object-cover transition-transform duration-[1.4s] ease-[var(--ease-luxe)] group-hover:scale-105"
            />
          </motion.button>
        ))}
      </section>

      <AnimatePresence>
        {current && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-center justify-center p-5"
          >
            <button
              aria-label="Close image"
              onClick={() => setLightbox(null)}
              className="absolute inset-0 cursor-default bg-[color-mix(in_oklab,var(--forest-deep)_86%,transparent)] backdrop-blur-sm"
            />
            <motion.img
              key={current.src}
              src={current.src}
              alt={current.alt}
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-h-[86vh] w-auto max-w-full rounded-2xl object-contain"
            />
            <button
              onClick={() => setLightbox(null)}
              aria-label="Close"
              className="absolute right-6 top-6 rounded-full bg-background/90 p-3 text-foreground"
            >
              <X className="size-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <QuoteCTA />
    </>
  );
}
