import { useMemo, useState, useEffect } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { ProductTile } from "@/components/products/ProductTile";
import { MODULES, moduleBySlug, productsByCategory, type Product } from "@/data/site";
import { QuoteCTA } from "@/components/home/QuoteCTA";
import { getProductsByCategory } from "@/lib/db-service";

export const Route = createFileRoute("/products/$category")({
  loader: ({ params }) => {
    const module = moduleBySlug(params.category);
    if (!module) throw notFound();
    return { name: module.name, headline: module.headline, description: module.description, image: module.image };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Category not found — Galaxy Bio Labs" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${loaderData.name} — Galaxy Bio Labs`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.description },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.description },
      ],
    };
  },
  notFoundComponent: CategoryNotFound,
  component: CategoryPage,
});

function CategoryNotFound() {
  return (
    <div className="gbl-container py-48 text-center">
      <h1 className="font-display text-4xl">That module doesn't exist</h1>
      <Link to="/products" className="nav-underline mt-6 inline-block text-sm text-primary">
        Back to all products
      </Link>
    </div>
  );
}

function CategoryPage() {
  const { category } = Route.useParams();
  const data = Route.useLoaderData();
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setProducts(productsByCategory(category));

    let activeSub = true;
    getProductsByCategory(category).then((list) => {
      if (!activeSub) return;
      if (list && list.length > 0) {
        setProducts(list.filter((p) => p.status === "Active"));
      }
    });
    return () => {
      activeSub = false;
    };
  }, [category]);

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter(
      (p) => q === "" || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
    );
  }, [products, query]);

  return (
    <>
      <PageHeader eyebrow="Module" title={data.headline} copy={data.description} />

      <section className="gbl-container py-14 md:py-20">
        <div className="flex flex-col gap-6 border-b border-border pb-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
            <Link
              to="/products"
              className="text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
            >
              All
            </Link>
            {MODULES.map((m) => (
              <Link
                key={m.slug}
                to="/products/$category"
                params={{ category: m.slug }}
                className={`text-[0.75rem] font-semibold uppercase tracking-[0.16em] transition-colors ${
                  m.slug === category ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {m.name}
              </Link>
            ))}
          </div>
          <label className="relative flex w-full items-center lg:w-72">
            <Search className="pointer-events-none absolute left-4 size-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value.slice(0, 80))}
              placeholder={`Search ${data.name}`}
              aria-label="Search products"
              className="w-full rounded-full border border-input bg-card py-3 pl-11 pr-4 text-sm outline-none transition-colors focus:border-primary"
            />
          </label>
        </div>

        <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p, i) => (
            <ProductTile key={p.slug} product={p} index={i} />
          ))}
        </div>

        {items.length === 0 && (
          <p className="py-24 text-center text-sm text-muted-foreground">
            No products in this module match that search.
          </p>
        )}
      </section>

      <QuoteCTA />
    </>
  );
}
