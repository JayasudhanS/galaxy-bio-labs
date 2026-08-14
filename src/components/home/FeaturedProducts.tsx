import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { getAllProducts } from "@/lib/db-service";
import { type Product } from "@/data/site";
import { Reveal } from "@/components/motion/Reveal";
import { ProductTile } from "@/components/products/ProductTile";

export function FeaturedProducts() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let activeSub = true;
    getAllProducts().then((list) => {
      if (!activeSub) return;
      if (list) {
        setFeatured(list.filter((p) => p.featured && p.status === "Active"));
      }
      setLoading(false);
    });
    return () => {
      activeSub = false;
    };
  }, []);

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

      {loading ? (
        <div className="mt-14 flex justify-center py-10">
          <span className="text-sm text-muted-foreground animate-pulse">Loading products...</span>
        </div>
      ) : featured.length === 0 ? (
        <div className="mt-14 text-center py-12 border border-dashed border-border rounded-[2rem]">
          <p className="text-sm text-muted-foreground">No products available.</p>
        </div>
      ) : (
        <div className="mt-14 grid gap-3 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-14 lg:grid-cols-4">
          {featured.map((p, i) => (
            <ProductTile key={p.slug} product={p} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}
