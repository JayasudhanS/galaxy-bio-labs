import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Reveal } from "@/components/motion/Reveal";
import { Plus, Edit, Trash2, Loader2, PackageOpen } from "lucide-react";
import { getAllProducts, deleteProduct } from "@/lib/db-service";
import { type Product } from "@/data/site";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/products")({
  component: AdminProductsPage,
});

function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();

  const loadProducts = async () => {
    setLoading(true);
    try {
      const list = await getAllProducts();
      // Sort by updatedAt or createdAt desc
      list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      setProducts(list);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      return;
    }
    setDeletingId(slug);
    try {
      await deleteProduct(slug);
      toast.success("Product deleted successfully.");
      setProducts((prev) => prev.filter((p) => p.slug !== slug));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete product.");
    } finally {
      setDeletingId(null);
    }
  };

  const columns = ["Image", "Title", "Category", "Status", "Created", "Actions"];

  const formatCategory = (cat: string) => {
    return cat
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  return (
    <Reveal>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="eyebrow text-accent">Catalog</p>
            <h1 className="mt-3 font-display text-4xl text-foreground">Products</h1>
            <p className="mt-2.5 max-w-xl text-sm text-muted-foreground">
              Manage your product catalog, categories, and settings.
            </p>
          </div>
          <div>
            <Link
              to="/admin/add-product"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground shadow-md transition-all duration-300 hover:bg-primary/95 hover:shadow-lg"
            >
              <Plus className="size-4" />
              Add Product
            </Link>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-hidden rounded-3xl border border-border/60 bg-card">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-sm text-muted-foreground space-y-3">
              <Loader2 className="size-8 animate-spin text-primary" />
              <span>Fetching product catalog...</span>
            </div>
          ) : products.length === 0 ? (
            <div className="px-6 py-20 text-center">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="rounded-full bg-secondary/80 p-4 text-muted-foreground/60">
                  <PackageOpen className="size-8" />
                </div>
                <div>
                  <p className="font-display text-lg font-medium text-foreground">No products found</p>
                  <p className="mt-1 text-sm text-muted-foreground max-w-xs mx-auto">
                    Get started by creating your first biological or natural product input.
                  </p>
                </div>
                <div className="pt-2">
                  <Link
                    to="/admin/add-product"
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-5 py-2.5 text-xs font-semibold text-foreground transition-all hover:bg-secondary"
                  >
                    <Plus className="size-3.5" />
                    Create product
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border/60 bg-secondary/30 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {columns.map((col) => (
                      <th key={col} className="px-6 py-4.5">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {products.map((product) => (
                    <tr key={product.slug} className="align-middle hover:bg-secondary/10 transition-colors">
                      {/* Image */}
                      <td className="px-6 py-4">
                        <div className="size-12 overflow-hidden rounded-xl border border-border/60 bg-secondary">
                          <img
                            src={product.images[0] || "/placeholder.jpg"}
                            alt={product.title}
                            className="size-full object-cover"
                          />
                        </div>
                      </td>

                      {/* Title */}
                      <td className="px-6 py-4 font-medium text-foreground">
                        {product.title}
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {formatCategory(product.category)}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-wider ${
                            product.status === "Active"
                              ? "bg-primary/10 text-primary"
                              : "bg-secondary text-muted-foreground"
                          }`}
                        >
                          {product.status}
                        </span>
                      </td>

                      {/* Created */}
                      <td className="px-6 py-4 text-xs text-muted-foreground">
                        {new Date(product.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              navigate({
                                to: "/admin/add-product",
                                search: { productId: product.slug },
                              })
                            }
                            className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-primary transition-colors"
                            title="Edit product"
                          >
                            <Edit className="size-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.slug)}
                            disabled={deletingId === product.slug}
                            className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors disabled:opacity-50"
                            title="Delete product"
                          >
                            {deletingId === product.slug ? (
                              <Loader2 className="size-4 animate-spin" />
                            ) : (
                              <Trash2 className="size-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Reveal>
  );
}
