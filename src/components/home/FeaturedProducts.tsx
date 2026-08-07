import { Link } from "@tanstack/react-router";
import { FEATURED } from "@/data/site";
import { Reveal } from "@/components/motion/Reveal";
import { ProductTile } from "@/components/products/ProductTile";

export function FeaturedProducts() {
  return (
    <section className="gbl-container py-24 md:py-32">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Reveal>
            <p className="eyebrow">Featured</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-5 max-w-xl font-display text-4xl leading-[1.1] md:text-5xl">
              A short selection from the catalogue
            </h2>
          </Reveal>
        </div>
        <Reveal delay={0.16}>
          <Link
            to="/products"
            className="nav-underline text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-primary"
          >
            All products
          </Link>
        </Reveal>
      </div>

      <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURED.map((p, i) => (
          <ProductTile key={p.slug} product={p} index={i} />
        ))}
      </div>
    </section>
  );
}
