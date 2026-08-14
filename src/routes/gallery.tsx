import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { X, Images, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { QuoteCTA } from "@/components/home/QuoteCTA";
import { getAllGalleryItems } from "@/lib/db-service";
import type { GalleryItem } from "@/lib/db-service";

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
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<number | null>(null);

  /* Load independent gallery images from Firestore */
  useEffect(() => {
    let active = true;
    getAllGalleryItems().then((list) => {
      if (active) { setItems(list); setLoading(false); }
    });
    return () => { active = false; };
  }, []);

  const current = lightbox !== null ? items[lightbox] ?? null : null;

  return (
    <>
      <PageHeader
        eyebrow="Gallery"
        title="The work, as it actually looks"
        copy="Photographs from our labs, partner farms, aquaculture ponds and ornamental hatcheries."
      />

      <section className="gbl-container py-20 md:py-28">

        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-muted-foreground">
            <Loader2 className="size-7 animate-spin" />
            <p className="text-sm">Loading gallery…</p>
          </div>
        )}

        {/* Empty state (no images yet) */}
        {!loading && items.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-muted-foreground">
            <Images className="size-10 opacity-30" />
            <p className="text-sm font-medium">No gallery images yet.</p>
          </div>
        )}

        {/* Masonry-style columns */}
        {!loading && items.length > 0 && (
          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
            {items.map((item, i) => (
              <motion.button
                key={item.id}
                onClick={() => setLightbox(i)}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="group mb-5 block w-full overflow-hidden rounded-3xl"
              >
                <img
                  src={item.url}
                  alt={`Gallery image ${i + 1}`}
                  loading="lazy"
                  className="w-full object-cover transition-transform duration-[1.4s] ease-[var(--ease-luxe)] group-hover:scale-105"
                />
              </motion.button>
            ))}
          </div>
        )}
      </section>

      {/* Lightbox */}
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
              key={current.id}
              src={current.url}
              alt={`Gallery image`}
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
