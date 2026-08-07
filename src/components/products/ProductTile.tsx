import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/data/site";
import { MODULES } from "@/data/site";
import { useQuote } from "@/components/quote/QuoteProvider";

export function ProductTile({ product, index = 0 }: { product: Product; index?: number }) {
  const { open } = useQuote();
  const category = MODULES.find((m) => m.slug === product.category);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group relative"
    >
      <Link
        to="/product/$slug"
        params={{ slug: product.slug }}
        className="block overflow-hidden rounded-[1.75rem] bg-secondary"
      >
        <div className="relative aspect-4/5 overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.title}
            width={1200}
            height={1000}
            loading="lazy"
            className="size-full object-cover transition-transform duration-[1.4s] ease-[var(--ease-luxe)] group-hover:scale-107"
          />
          <div
            aria-hidden
            className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
            style={{ background: "var(--gradient-veil)" }}
          />
          <span className="absolute left-5 top-5 rounded-full bg-background/85 px-3.5 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-foreground/70 backdrop-blur">
            {category?.name}
          </span>
          <span className="absolute bottom-5 right-5 flex size-11 translate-y-3 items-center justify-center rounded-full bg-background text-foreground opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight className="size-4" />
          </span>
        </div>
      </Link>

      <div className="flex items-start justify-between gap-4 px-1 pt-5">
        <div>
          <h3 className="font-display text-xl leading-snug">
            <Link to="/product/$slug" params={{ slug: product.slug }} className="nav-underline">
              {product.title}
            </Link>
          </h3>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        </div>
        <button
          onClick={() => open({ product: product.title, productId: product.slug, category: product.category })}
          className="shrink-0 whitespace-nowrap rounded-full border border-border px-4 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-foreground/70 transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
        >
          Get quote
        </button>
      </div>
    </motion.article>
  );
}

export function ProductTileSkeleton() {
  return (
    <div>
      <div className="skeleton-shimmer aspect-4/5 rounded-[1.75rem]" />
      <div className="skeleton-shimmer mt-5 h-5 w-2/3 rounded-full" />
      <div className="skeleton-shimmer mt-3 h-4 w-full rounded-full" />
    </div>
  );
}
