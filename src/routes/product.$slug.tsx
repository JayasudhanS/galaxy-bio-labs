import { useState, useEffect } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { MODULES, type Product } from "@/data/site";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { Reveal } from "@/components/motion/Reveal";
import { useQuote } from "@/components/quote/QuoteProvider";
import { ProductTile } from "@/components/products/ProductTile";
import { getProductBySlug, getProductsByCategory } from "@/lib/db-service";

export const Route = createFileRoute("/product/$slug")({
  loader: async ({ params }) => {
    const product = await getProductBySlug(params.slug);
    if (!product) throw notFound();
    return product;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Product not found — Galaxy Bio Labs" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${loaderData.title} — Galaxy Bio Labs`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.description.slice(0, 155) },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.description.slice(0, 155) },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="gbl-container py-48 text-center">
      <h1 className="font-display text-4xl">Product not found</h1>
      <Link to="/products" className="nav-underline mt-6 inline-block text-sm text-primary">
        Back to catalogue
      </Link>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const loaderProduct = Route.useLoaderData();
  const { slug } = Route.useParams();
  const [product, setProduct] = useState<Product>(loaderProduct);
  const [active, setActive] = useState(0);
  const [galleryActive, setGalleryActive] = useState(0);
  const { open } = useQuote();
  const category = MODULES.find((m) => m.slug === product.category);
  const [related, setRelated] = useState<Product[]>([]);
  const image = product.images[active] ?? product.images[0]!;
  const galleryImages = product.galleryImages ?? [];

  useEffect(() => {
    let activeSub = true;
    getProductBySlug(slug).then((liveProd) => {
      if (!activeSub) return;
      if (liveProd) {
        setProduct(liveProd);
      }
    });
    return () => {
      activeSub = false;
    };
  }, [slug]);

  useEffect(() => {
    let activeSub = true;
    getProductsByCategory(product.category).then((list) => {
      if (!activeSub) return;
      if (list) {
        setRelated(list.filter((p) => p.slug !== product.slug && p.status === "Active").slice(0, 3));
      } else {
        setRelated([]);
      }
    });
    return () => {
      activeSub = false;
    };
  }, [product.category, product.slug]);

  useEffect(() => {
    setGalleryActive(0);
  }, [product.slug]);

  const paginate = (dir: number) =>
    setActive((i) => (i + dir + product.images.length) % product.images.length);

  return (
    <>
      <div className="gbl-container pt-32 md:pt-40">
        <Link
          to="/products/$category"
          params={{ category: product.category }}
          className="inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-3.5" /> {category?.name}
        </Link>
      </div>

      <section className="gbl-container py-12 md:py-16">
        <div className="rounded-[2rem] border border-border/60 bg-card p-6 md:grid md:grid-cols-[260px_1fr] md:items-start md:gap-10 md:p-10 lg:grid-cols-[300px_1fr] lg:gap-14">
          {/* Compact, controlled image column — fixed max width, never grows with the source image */}
          <div className="mx-auto w-full max-w-[260px] md:mx-0 lg:max-w-[300px]">
            <div
              className="relative aspect-square w-full overflow-hidden rounded-2xl bg-secondary"
              onTouchStart={(e) => {
                const startX = e.touches[0]!.clientX;
                const onEnd = (ev: TouchEvent) => {
                  const dx = ev.changedTouches[0]!.clientX - startX;
                  if (Math.abs(dx) > 50) paginate(dx < 0 ? 1 : -1);
                  window.removeEventListener("touchend", onEnd);
                };
                window.addEventListener("touchend", onEnd);
              }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={image}
                  src={image}
                  alt={product.title}
                  width={600}
                  height={600}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 size-full object-contain p-5"
                />
              </AnimatePresence>
            </div>

            {product.images.length > 1 && (
              <div className="mt-3 flex justify-center gap-2 md:justify-start">
                {product.images.map((img: string, i: number) => (
                  <button
                    key={img + i}
                    onClick={() => setActive(i)}
                    aria-label={`View image ${i + 1}`}
                    className={`relative size-12 shrink-0 overflow-hidden rounded-lg transition-all duration-500 ${i === active ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "opacity-60 hover:opacity-100"
                      }`}
                  >
                    <img src={img} alt="" loading="lazy" className="size-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product information — guaranteed the remaining width via 1fr, never pushed off-screen */}
          <div className="mt-8 min-w-0 md:mt-0">
            <Reveal>
              <p className="eyebrow">{category?.name}</p>
            </Reveal>
            <Reveal delay={0.06}>
              <h1 className="mt-4 font-display text-3xl leading-[1.08] md:text-4xl lg:text-[2.75rem]">{product.title}</h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">{product.description}</p>
            </Reveal>

                      {product.fullDescription && product.fullDescription.trim() && (
            <Reveal delay={0.16}>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground/85">
                {product.fullDescription}
              </p>
            </Reveal>
          )}

          {(
            [
              ["Composition", product.composition],
              ["Recommended Crops", product.recommendedCrops],
              ["Advantages", product.advantages],
              ["Dosage", product.dosage],
              ["Packing", product.packing],
            ] as const
          ).some(([, value]) => value && value.trim()) && (
            <div className="mt-8 space-y-5 border-t border-border pt-6">
              {(
                [
                  ["Composition", product.composition],
                  ["Recommended Crops", product.recommendedCrops],
                  ["Advantages", product.advantages],
                  ["Dosage", product.dosage],
                  ["Packing", product.packing],
                ] as const
              ).map(([label, value]) =>
                value && value.trim() ? (
                  <Reveal key={label} delay={0.18}>
                    <div>
                      <h2 className="text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
                        {label}
                      </h2>
                      <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-foreground/85">
                        {value}
                      </p>
                    </div>
                  </Reveal>
                ) : null,
              )}
            </div>
          )}

                    <Reveal delay={0.24}>
            <div className="mt-8">
              <MagneticButton onClick={() => open({ product: product.title, productId: product.slug, category: product.category })}>
                Get quote
              </MagneticButton>
            </div>
          </Reveal>
        </div>
        </div>
      </section>

      {galleryImages.length > 0 && (
        <section className="gbl-container border-t border-border py-16 md:py-20">
          <h2 className="text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">Gallery</h2>

          <div className="mt-6 relative aspect-square w-full max-w-[260px] overflow-hidden rounded-2xl bg-secondary">
            <AnimatePresence mode="wait">
              <motion.img
                key={galleryImages[galleryActive]}
                src={galleryImages[galleryActive]}
                alt={`${product.title} gallery ${galleryActive + 1}`}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 size-full object-contain p-5"
              />
            </AnimatePresence>
          </div>

          {galleryImages.length > 1 && (
            <div className="mt-3 flex max-w-[260px] gap-2 overflow-x-auto pb-2">
              {galleryImages.map((img: string, i: number) => (
                <button
                  key={img + i}
                  onClick={() => setGalleryActive(i)}
                  aria-label={`View gallery image ${i + 1}`}
                  className={`relative size-12 shrink-0 overflow-hidden rounded-lg transition-all duration-500 ${i === galleryActive ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "opacity-60 hover:opacity-100"
                    }`}
                >
                  <img src={img} alt="" loading="lazy" className="size-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </section>
      )}

      {related.length > 0 && (
        <section className="gbl-container border-t border-border py-20 md:py-28">
          <h2 className="font-display text-3xl md:text-4xl">More from {category?.name}</h2>
          <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p, i) => (
              <ProductTile key={p.slug} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}