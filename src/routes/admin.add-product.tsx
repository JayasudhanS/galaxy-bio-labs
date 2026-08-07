import { useState, useRef, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Reveal } from "@/components/motion/Reveal";
import { toast } from "sonner";
import { z } from "zod";
import {
  ArrowLeft,
  Upload,
  X,
  FileText,
  Sparkles,
  Info,
  Loader2,
} from "lucide-react";
import { getProductBySlug, saveProduct } from "@/lib/db-service";
import { type CategorySlug } from "@/data/site";

const searchSchema = z.object({
  productId: z.string().optional(),
});

export const Route = createFileRoute("/admin/add-product")({
  validateSearch: (search) => searchSchema.parse(search),
  component: AddProductPage,
});

interface ImageItem {
  file?: File;
  url: string; // Object URL for previews, or existing URL from db
}

function AddProductPage() {
  const { productId } = Route.useSearch();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);

  const [name, setName] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [fullDesc, setFullDesc] = useState("");
  const [category, setCategory] = useState("Agri Inputs");
  const [applications, setApplications] = useState("");
  const [benefits, setBenefits] = useState("");
  const [usage, setUsage] = useState("");
  const [specsText, setSpecsText] = useState("");
  const [status, setStatus] = useState("Active");
  const [featured, setFeatured] = useState(false);

  // Image upload state
  const [images, setImages] = useState<ImageItem[]>([]);

  // Load product if editing
  useEffect(() => {
    if (!productId) return;

    const loadProductData = async () => {
      setLoadingProduct(true);
      try {
        const prod = await getProductBySlug(productId);
        if (prod) {
          setName(prod.title);
          setShortDesc(prod.description);
          setFullDesc(prod.fullDescription ?? prod.description);
          
          // Map category slug to label
          const catMap: Record<string, string> = {
            "agri-inputs": "Agri Inputs",
            aquaculture: "Aquaculture",
            "ornamental-fish": "Ornamental Fish",
            "food-products": "Food Products",
          };
          setCategory(catMap[prod.category] || "Agri Inputs");
          
          setApplications(prod.applications ?? "");
          setBenefits(prod.benefits.join("\n"));
          setUsage(prod.usage);
          
          const specStr = prod.specifications
            .map((s) => `${s.label}: ${s.value}`)
            .join("\n");
          setSpecsText(specStr);
          
          setStatus(prod.status);
          setFeatured(!!prod.featured);
          setImages(prod.images.map((url) => ({ url })));
        } else {
          toast.error("Product not found.");
          navigate({ to: "/admin/products" });
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load product details.");
      } finally {
        setLoadingProduct(false);
      }
    };

    loadProductData();
  }, [productId, navigate]);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img.file) URL.revokeObjectURL(img.url);
      });
    };
  }, [images]);

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          const MAX_SIZE = 800; // max size in px
          
          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          
          resolve(canvas.toDataURL("image/jpeg", 0.7)); // compressed jpeg
        };
        img.onerror = () => reject(new Error("Failed to load image for compression."));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error("Failed to read file."));
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);

    if (images.length + selectedFiles.length > 4) {
      toast.error("You can select a maximum of 4 images.");
      return;
    }

    const newItems = selectedFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setImages([...images, ...newItems]);
    toast.success(`Added ${selectedFiles.length} image(s).`);
  };

  const removeImage = (index: number) => {
    const item = images[index];
    if (item?.file) URL.revokeObjectURL(item.url);
    setImages(images.filter((_, i) => i !== index));
  };

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (images.length < 1) {
      toast.error("Please upload at least 1 image.");
      return;
    }
    if (images.length > 4) {
      toast.error("A maximum of 4 images is allowed.");
      return;
    }

    setSavingProduct(true);
    toast.info("Saving product...");

    try {
      // 1. Process and compress new images to base64
      const imageUrls: string[] = [];
      for (const img of images) {
        if (img.file) {
          const base64 = await compressImage(img.file);
          imageUrls.push(base64);
        } else {
          imageUrls.push(img.url);
        }
      }

      // 2. Map category label to slug
      const catSlugMap: Record<string, string> = {
        "Agri Inputs": "agri-inputs",
        Aquaculture: "aquaculture",
        "Ornamental Fish": "ornamental-fish",
        "Food Products": "food-products",
      };
      const categorySlug = catSlugMap[category] || "agri-inputs";

      // 3. Generate slug
      const slug = productId || name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      // 4. Parse specifications
      const specifications = specsText
        .split("\n")
        .map((line) => {
          const idx = line.indexOf(":");
          if (idx !== -1) {
            const label = line.substring(0, idx).trim();
            const value = line.substring(idx + 1).trim();
            if (label && value) {
              return { label, value };
            }
          }
          return null;
        })
        .filter((x): x is { label: string; value: string } => x !== null);

      // 5. Build product object
      const productData = {
        slug,
        title: name.trim(),
        category: categorySlug as CategorySlug,
        description: shortDesc.trim(),
        fullDescription: fullDesc.trim(),
        benefits: benefits.split("\n").map((b) => b.trim()).filter(Boolean),
        specifications,
        usage: usage.trim(),
        images: imageUrls,
        featured,
        status: status as "Active" | "Draft",
        applications: applications.trim(),
      };

      await saveProduct(productData);
      toast.success(productId ? "Product updated successfully." : "Product added successfully.");
      navigate({ to: "/admin/products" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to save product.");
    } finally {
      setSavingProduct(false);
    }
  };

  if (loadingProduct) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="size-10 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Loading product details...</p>
        </div>
      </div>
    );
  }

  return (
    <Reveal>
      <div className="space-y-8 max-w-5xl mx-auto">
        {/* Top bar / Back button */}
        <div className="flex items-center gap-4">
          <Link
            to="/admin/products"
            className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-all hover:bg-secondary"
            title="Back to products"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <p className="eyebrow text-accent">{productId ? "Edit Catalog" : "Add Catalog"}</p>
            <h1 className="mt-1 font-display text-3xl text-foreground">
              {productId ? "Edit Product" : "Add New Product"}
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
          {/* Main Info Columns (Left - 2 Cols) */}
          <div className="space-y-8 lg:col-span-2">
            {/* Section: Basic Info */}
            <div className="space-y-6 rounded-3xl border border-border/50 bg-card p-6.5">
              <h2 className="font-display text-xl text-foreground flex items-center gap-2">
                <FileText className="size-5 text-primary" />
                Basic Information
              </h2>

              <div className="space-y-4">
                {/* Product Name */}
                <div className="space-y-2">
                  <label htmlFor="prod-name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Product Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="prod-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Bio-Shield Soil Enhancer"
                    className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>

                {/* Short Description */}
                <div className="space-y-2">
                  <label htmlFor="short-desc" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Short Description <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    id="short-desc"
                    required
                    rows={2}
                    value={shortDesc}
                    onChange={(e) => setShortDesc(e.target.value)}
                    placeholder="A brief 1-2 sentence hook highlighting the main utility."
                    className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                  />
                </div>

                {/* Full Description */}
                <div className="space-y-2">
                  <label htmlFor="full-desc" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Full Description <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    id="full-desc"
                    required
                    rows={5}
                    value={fullDesc}
                    onChange={(e) => setFullDesc(e.target.value)}
                    placeholder="Detailed narrative describing the science, research background, and applications of the product."
                    className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section: Science & Technical details */}
            <div className="space-y-6 rounded-3xl border border-border/50 bg-card p-6.5">
              <h2 className="font-display text-xl text-foreground flex items-center gap-2">
                <Sparkles className="size-5 text-primary" />
                Technical Specifications
              </h2>

              <div className="grid gap-6 sm:grid-cols-2">
                {/* Applications */}
                <div className="space-y-2">
                  <label htmlFor="applications" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Applications
                  </label>
                  <textarea
                    id="applications"
                    rows={4}
                    value={applications}
                    onChange={(e) => setApplications(e.target.value)}
                    placeholder="Target use cases (e.g. Paddy soil, Brackish water, Koi ponds...)"
                    className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>

                {/* Benefits */}
                <div className="space-y-2">
                  <label htmlFor="benefits" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Benefits (One per line)
                  </label>
                  <textarea
                    id="benefits"
                    rows={4}
                    value={benefits}
                    onChange={(e) => setBenefits(e.target.value)}
                    placeholder="Stronger root mass within two applications&#10;Improved flowering and fruit set"
                    className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>

                {/* Usage Instructions */}
                <div className="space-y-2">
                  <label htmlFor="usage" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Usage Instructions
                  </label>
                  <textarea
                    id="usage"
                    rows={4}
                    value={usage}
                    onChange={(e) => setUsage(e.target.value)}
                    placeholder="Dosages, mix ratios, timings, and storage..."
                    className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>

                {/* Specifications */}
                <div className="space-y-2">
                  <label htmlFor="specs" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Specifications (Format: Label: Value, one per line)
                  </label>
                  <textarea
                    id="specs"
                    rows={4}
                    value={specsText}
                    onChange={(e) => setSpecsText(e.target.value)}
                    placeholder="Form: Liquid concentrate&#10;Pack sizes: 500 ml · 1 L"
                    className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar / Metadata (Right - 1 Col) */}
          <div className="space-y-8">
            {/* Classification & Settings */}
            <div className="space-y-6 rounded-3xl border border-border/50 bg-card p-6.5">
              <h2 className="font-display text-xl text-foreground flex items-center gap-2">
                <Info className="size-5 text-primary" />
                Settings
              </h2>

              <div className="space-y-5">
                {/* Category Dropdown */}
                <div className="space-y-2">
                  <label htmlFor="category" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Category
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-2xl border border-input bg-background px-4 py-3.5 text-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
                  >
                    <option value="Agri Inputs">Agri Inputs</option>
                    <option value="Aquaculture">Aquaculture</option>
                    <option value="Ornamental Fish">Ornamental Fish</option>
                    <option value="Food Products">Food Products</option>
                  </select>
                </div>

                {/* Status Dropdown */}
                <div className="space-y-2">
                  <label htmlFor="status" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Status
                  </label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-2xl border border-input bg-background px-4 py-3.5 text-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>

                {/* Featured Checkbox/Switch */}
                <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-secondary/20 p-4">
                  <div className="space-y-0.5">
                    <label htmlFor="featured" className="text-sm font-semibold text-foreground cursor-pointer">
                      Featured Product
                    </label>
                    <p className="text-xs text-muted-foreground">Display prominently on the shop home.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      id="featured"
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-muted-foreground/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:height-5 after:h-5 after:width-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Image Upload Box */}
            <div className="space-y-6 rounded-3xl border border-border/50 bg-card p-6.5">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl text-foreground">Images</h2>
                <span className="text-xs font-semibold text-muted-foreground bg-secondary/80 px-2.5 py-1 rounded-full">
                  {images.length}/4 selected
                </span>
              </div>

              {/* Hidden file input */}
              <input
                type="file"
                multiple
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
              />

              {/* Drag/Drop Box */}
              <div
                onClick={handleTriggerUpload}
                className="group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/80 bg-secondary/15 p-8 text-center transition-all hover:border-primary/40 hover:bg-secondary/25 cursor-pointer"
              >
                <div className="rounded-full bg-background p-3 text-muted-foreground group-hover:text-primary transition-colors">
                  <Upload className="size-5" />
                </div>
                <p className="mt-3 text-xs font-semibold text-foreground uppercase tracking-wide">
                  Upload images
                </p>
                <p className="mt-1 text-[0.7rem] text-muted-foreground">
                  PNG, JPG, or WebP. Max 4 files. (Min 1 required)
                </p>
              </div>

              {/* Previews List */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {images.map((img, index) => (
                    <div
                      key={img.url}
                      className="group relative aspect-square overflow-hidden rounded-2xl border border-border/60"
                    >
                      <img
                        src={img.url}
                        alt={`Preview ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white transition-opacity hover:bg-black/80"
                        title="Remove image"
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions Panel */}
            <div className="flex flex-col gap-3">
              <button
                type="submit"
                disabled={savingProduct}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-primary py-4 text-xs font-semibold uppercase tracking-wider text-primary-foreground shadow-md transition-all duration-300 hover:bg-primary/95 hover:shadow-lg cursor-pointer text-center disabled:opacity-50"
              >
                {savingProduct && <Loader2 className="size-4 animate-spin" />}
                {productId ? "Update Product" : "Save Product"}
              </button>
              <Link
                to="/admin/products"
                className="w-full rounded-full border border-border bg-card py-4 text-xs font-semibold uppercase tracking-wider text-foreground transition-all hover:bg-secondary cursor-pointer text-center"
              >
                Cancel
              </Link>
            </div>
          </div>
        </form>
      </div>
    </Reveal>
  );
}
