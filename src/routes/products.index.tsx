import { useMemo, useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { ProductTile } from "@/components/products/ProductTile";
import { MODULES } from "@/data/site";
import { QuoteCTA } from "@/components/home/QuoteCTA";

const title = "Products — Galaxy Bio Labs catalogue";
const description =
  "Browse agri inputs, aquaculture solutions, ornamental fish nutrition and natural food products from Galaxy Bio Labs. Request a quote on any item.";

export const Route = createFileRoute("/products/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: ProductsIndex,
});

import { getAllProducts } from "@/lib/db-service";
import { type Product } from "@/data/site";

function ProductsIndex() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string>("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let activeSub = true;
    getAllProducts().then((list) => {
      if (!activeSub) return;
      if (list) {
        // Only show Active products on the public site
        setProducts(list.filter((p) => p.status === "Active"));
      }
      setLoading(false);
    });
    return () => {
      activeSub = false;
    };
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter(
      (p) =>
        (active === "all" || p.category === active) &&
        (q === "" || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)),
    );
  }, [query, active, products]);

  return (
    <>
      <PageHeader
        eyebrow="Catalogue"
        title="Everything we make, in one place"
        copy="No prices online. Choose what fits your operation and request a quote — our team responds within a working day."
      />

      <section className="gbl-container py-14 md:py-20">
        <div className="flex flex-col gap-6 border-b border-border pb-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
            {[{ slug: "all", name: "All" }, ...MODULES].map((m) => (
              <button
                key={m.slug}
                onClick={() => setActive(m.slug)}
                className={`relative text-[0.75rem] font-semibold uppercase tracking-[0.16em] transition-colors ${
                  active === m.slug ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {m.name}
                {active === m.slug && (
                  <motion.span
                    layoutId="filter-underline"
                    className="absolute -bottom-2 left-0 h-px w-full bg-primary"
                  />
                )}
              </button>
            ))}
          </div>

          <label className="relative flex w-full items-center lg:w-72">
            <Search className="pointer-events-none absolute left-4 size-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value.slice(0, 80))}
              placeholder="Search products"
              aria-label="Search products"
              className="w-full rounded-full border border-input bg-card py-3 pl-11 pr-4 text-sm outline-none transition-colors focus:border-primary"
            />
          </label>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <span className="text-sm text-muted-foreground animate-pulse">Loading products...</span>
          </div>
        ) : products.length === 0 ? (
          <p className="py-24 text-center text-sm text-muted-foreground">
            No products available.
          </p>
        ) : results.length === 0 ? (
          <p className="py-24 text-center text-sm text-muted-foreground">
            Nothing matches that search yet. Try another term or{" "}
            <Link to="/contact" className="nav-underline text-primary">
              talk to us
            </Link>
            .
          </p>
        ) : (
          <motion.div layout className="mt-14 grid gap-3 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-14 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {results.map((p, i) => (
                <ProductTile key={p.slug} product={p} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      <QuoteCTA />
    </>
  );
}
