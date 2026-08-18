import { useState, useRef, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Reveal } from "@/components/motion/Reveal";
import { toast } from "sonner";
import { z } from "zod";
import { ArrowLeft, Upload, X, FileText, Info, Loader2 } from "lucide-react";
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

const CATEGORY_OPTIONS: { label: string; slug: CategorySlug }[] = [
  { label: "Agri Inputs", slug: "agri-inputs" },
  { label: "Aquaculture", slug: "aquaculture" },
  { label: "Ornamental Fish", slug: "ornamental-fish" },
  { label: "Food Products", slug: "food-products" },
];

function AddProductPage() {
  const { productId } = Route.useSearch();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);

    const [name, setName] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [category, setCategory] = useState<CategorySlug>("agri-inputs");

  // Product Profile fields
  const [composition, setComposition] = useState("");
  const [recommendedCrops, setRecommendedCrops] = useState("");
  const [advantages, setAdvantages] = useState("");
  const [dosage, setDosage] = useState("");
  const [packing, setPacking] = useState("");

  // Preserved so editing an existing product doesn't silently wipe out
  // the richer fields it may already have (applications, benefits, usage,
  // gallery images added via the separate Admin → Gallery Images page,
  // etc.) — this simplified form still doesn't expose those for editing.
  const [existingExtras, setExistingExtras] = useState<{
    applications: string;
    benefits: string[];
    usage: string;
    specifications: { label: string; value: string }[];
    status: "Active" | "Draft";
    featured: boolean;
    galleryImages: string[];
  } | null>(null);

  // Image upload state (existing primary product image — unchanged)
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
          setFullDescription(prod.fullDescription ?? prod.description);
          setShortDesc(prod.description);
          setCategory(prod.category);
                    setImages(prod.images.map((url) => ({ url })));
          setComposition(prod.composition ?? "");
          setRecommendedCrops(prod.recommendedCrops ?? "");
          setAdvantages(prod.advantages ?? "");
          setDosage(prod.dosage ?? "");
          setPacking(prod.packing ?? "");
          setExistingExtras({
            applications: prod.applications ?? "",
            benefits: prod.benefits ?? [],
            usage: prod.usage ?? "",
            specifications: prod.specifications ?? [],
            status: prod.status,
            featured: !!prod.featured,
            galleryImages: prod.galleryImages ?? [],
          });
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
      // 1. Process and compress new primary images to base64
      const imageUrls: string[] = [];
      for (const img of images) {
        if (img.file) {
          const base64 = await compressImage(img.file);
          imageUrls.push(base64);
        } else {
          imageUrls.push(img.url);
        }
      }


      // 2. Generate slug
      const slug = productId || name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      // 3. Build product object. Fields not exposed in this simplified
      // form fall back to sensible defaults, or to the values the
      // product already had if this is an edit.
      const productData = {
        slug,
        title: name.trim(),
        category,
        description: shortDesc.trim(),
        fullDescription: fullDescription.trim(),
        benefits: existingExtras?.benefits ?? [],
        specifications: existingExtras?.specifications ?? [],
        usage: existingExtras?.usage ?? "",
                images: imageUrls,
        composition: composition.trim(),
        recommendedCrops: recommendedCrops.trim(),
        advantages: advantages.trim(),
        dosage: dosage.trim(),
        packing: packing.trim(),
        // Not editable here — carried forward as-is so this form can never
        // wipe out gallery images added via Admin → Gallery Images.
        galleryImages: existingExtras?.galleryImages ?? [],
        featured: existingExtras?.featured ?? false,
        status: existingExtras?.status ?? "Active" as const,
        applications: existingExtras?.applications ?? "",
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
      <div className="space-y-8 max-w-3xl mx-auto">
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

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section: Basic Info */}
          <div className="space-y-6 rounded-3xl border border-border/50 bg-card p-6.5">
            <h2 className="font-display text-xl text-foreground flex items-center gap-2">
              <FileText className="size-5 text-primary" />
              Basic Information
            </h2>

            <div className="space-y-4">
              {/* Product Title */}
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

              {/* Main Description */}
              <div className="space-y-2">
                <label htmlFor="full-desc" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Main Description <span className="text-destructive">*</span>
                </label>
                <textarea
                  id="full-desc"
                  required
                  rows={5}
                  value={fullDescription}
                  onChange={(e) => setFullDescription(e.target.value)}
                  placeholder="The full product description shown on the Product Details page."
                  className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
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
                  rows={3}
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  placeholder="A brief 1-2 sentence hook highlighting the main utility."
                  className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Section: Classification */}
          <div className="space-y-6 rounded-3xl border border-border/50 bg-card p-6.5">
            <h2 className="font-display text-xl text-foreground flex items-center gap-2">
              <Info className="size-5 text-primary" />
              Category
            </h2>
            <div className="space-y-2">
              <label htmlFor="category" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Business Module <span className="text-destructive">*</span>
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as CategorySlug)}
                className="w-full rounded-2xl border border-input bg-background px-4 py-3.5 text-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.slug} value={opt.slug}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground">
                Determines which of the four storefront modules this product appears under.
              </p>
            </div>
          </div>

                    {/* Section: Product Profile */}
          <div className="space-y-6 rounded-3xl border border-border/50 bg-card p-6.5">
            <h2 className="font-display text-xl text-foreground flex items-center gap-2">
              <Info className="size-5 text-primary" />
              Product Profile
            </h2>
            <p className="text-xs text-muted-foreground">
              Optional — shown on the product detail page only for the fields you fill in.
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="composition" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Composition
                </label>
                <textarea
                  id="composition"
                  rows={3}
                  value={composition}
                  onChange={(e) => setComposition(e.target.value)}
                  placeholder="e.g. Bacillus subtilis 1x10^8 CFU/g, carrier material..."
                  className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="recommended-crops" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Recommended Crops
                </label>
                <textarea
                  id="recommended-crops"
                  rows={3}
                  value={recommendedCrops}
                  onChange={(e) => setRecommendedCrops(e.target.value)}
                  placeholder="e.g. Paddy, cotton, sugarcane, vegetables..."
                  className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="advantages" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Advantages
                </label>
                <textarea
                  id="advantages"
                  rows={3}
                  value={advantages}
                  onChange={(e) => setAdvantages(e.target.value)}
                  placeholder="Key benefits of using this product..."
                  className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="dosage" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Dosage
                </label>
                <textarea
                  id="dosage"
                  rows={3}
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  placeholder="Recommended application rate..."
                  className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="packing" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Packing
                </label>
                <input
                  id="packing"
                  type="text"
                  value={packing}
                  onChange={(e) => setPacking(e.target.value)}
                  placeholder="e.g. 1kg, 5kg, 25kg bag"
                  className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section: Image Upload */}
          <div className="space-y-6 rounded-3xl border border-border/50 bg-card p-6.5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl text-foreground">Product Image</h2>
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
                Upload image
              </p>
              <p className="mt-1 text-[0.7rem] text-muted-foreground">
                PNG, JPG, or WebP. Max 4 files. (Min 1 required)
              </p>
            </div>

            {/* Previews List */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 gap-3 pt-2 sm:grid-cols-4">
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
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={savingProduct}
              className="w-full flex items-center justify-center gap-2 rounded-full bg-primary py-4 text-xs font-semibold uppercase tracking-wider text-primary-foreground shadow-md transition-all duration-300 hover:bg-primary/95 hover:shadow-lg cursor-pointer text-center disabled:opacity-50 sm:flex-1"
            >
              {savingProduct && <Loader2 className="size-4 animate-spin" />}
              {productId ? "Update Product" : "Save Product"}
            </button>
            <Link
              to="/admin/products"
              className="w-full rounded-full border border-border bg-card py-4 text-xs font-semibold uppercase tracking-wider text-foreground transition-all hover:bg-secondary cursor-pointer text-center sm:flex-1"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </Reveal>
  );
}