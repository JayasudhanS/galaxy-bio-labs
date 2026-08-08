import { useState, useEffect } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
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
  const { open } = useQuote();
  const category = MODULES.find((m) => m.slug === product.category);
  const [related, setRelated] = useState<Product[]>([]);
  const image = product.images[active] ?? product.images[0]!;

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

      <section className="gbl-container grid gap-14 py-12 lg:grid-cols-[1.05fr_1fr] lg:gap-20 md:py-16">
        <div>
          <div
            className="relative aspect-4/5 overflow-hidden rounded-[2rem] bg-secondary"
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
                width={1200}
                height={1000}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 size-full object-cover"
              />
            </AnimatePresence>
          </div>

          {product.images.length > 1 && (
            <div className="mt-4 flex gap-3">
              {product.images.map((img: string, i: number) => (
                <button
                  key={img + i}
                  onClick={() => setActive(i)}
                  aria-label={`View image ${i + 1}`}
                  className={`relative size-20 overflow-hidden rounded-xl transition-all duration-500 ${i === active ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "opacity-60 hover:opacity-100"
                    }`}
                >
                  <img src={img} alt="" loading="lazy" className="size-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <Reveal>
            <p className="eyebrow">{category?.name}</p>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="mt-5 font-display text-4xl leading-[1.06] md:text-[3.2rem]">{product.title}</h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">{product.description}</p>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="mt-9">
              <MagneticButton onClick={() => open({ product: product.title, productId: product.slug, category: product.category })}>
                Get quote
              </MagneticButton>
            </div>
          </Reveal>

          <div className="mt-14 space-y-12">
            <div>
              <h2 className="text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">Benefits</h2>
              <ul className="mt-5 space-y-3">
                {product.benefits.map((b: string) => (
                  <li key={b} className="flex gap-3 text-sm leading-relaxed">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
                Specifications
              </h2>
              <dl className="mt-5">
                {product.specifications.map((s: { label: string; value: string }) => (
                  <div key={s.label} className="grid grid-cols-[9rem_1fr] gap-4 border-t border-border py-3.5 text-sm">
                    <dt className="text-muted-foreground">{s.label}</dt>
                    <dd>{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div>
              <h2 className="text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">Usage</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{product.usage}</p>
            </div>
          </div>
        </div>
      </section>

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
