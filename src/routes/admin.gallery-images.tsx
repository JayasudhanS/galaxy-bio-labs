import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { ImagePlus, Trash2, Loader2, Images } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import {
  addGalleryItem,
  getAllGalleryItems,
  deleteGalleryItem,
} from "@/lib/db-service";
import type { GalleryItem } from "@/lib/db-service";

export const Route = createFileRoute("/admin/gallery-images")({
  component: GalleryImagesPage,
});

/* ─── Image compression (base64, max 900px, 75% quality) ─── */
function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const MAX = 900;
        let { width, height } = img;
        if (width > MAX || height > MAX) {
          if (width > height) { height = Math.round((height * MAX) / width); width = MAX; }
          else { width = Math.round((width * MAX) / height); height = MAX; }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d")?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.75));
      };
      img.onerror = () => reject(new Error("Could not load image."));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Could not read file."));
    reader.readAsDataURL(file);
  });
}

/* ════════════════════════════════════════════════════════════
   COMPONENT
════════════════════════════════════════════════════════════ */
function GalleryImagesPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  /* ── Fetch all independent gallery images on mount ── */
  useEffect(() => {
    let active = true;
    getAllGalleryItems().then((list) => {
      if (active) { setItems(list); setLoading(false); }
    });
    return () => { active = false; };
  }, []);

  /* ── File input change → compress → save to Firestore ── */
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    setUploading(true);
    toast.info(`Uploading ${files.length} image${files.length > 1 ? "s" : ""}…`);

    const saved: GalleryItem[] = [];
    for (const file of files) {
      try {
        const url = await compressImage(file);
        const item = await addGalleryItem(url);
        saved.push(item);
      } catch (err) {
        console.error("[AdminGallery] Upload failed for", file.name, err);
        toast.error(`Failed to upload "${file.name}". Skipped.`);
      }
    }

    // Append newly saved items and re-sort by createdAt.
    setItems((prev) =>
      [...prev, ...saved].sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    );

    if (saved.length) {
      toast.success(`${saved.length} image${saved.length > 1 ? "s" : ""} uploaded successfully.`);
    }

    // Reset input so the same file can be re-selected if needed.
    if (fileInputRef.current) fileInputRef.current.value = "";
    setUploading(false);
  };

  /* ── Delete a single gallery image ── */
  const handleDelete = async (item: GalleryItem) => {
    if (!window.confirm("Delete this gallery image? This cannot be undone.")) return;

    setDeletingId(item.id);
    try {
      await deleteGalleryItem(item.id);
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      toast.success("Gallery image deleted.");
    } catch (err) {
      console.error("[AdminGallery] Delete failed:", err);
      toast.error("Failed to delete image. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  /* ════════════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════════════ */
  return (
    <Reveal>
      <div className="space-y-10 max-w-5xl mx-auto">

        {/* ── Page header ── */}
        <div>
          <p className="eyebrow text-accent">Media</p>
          <h1 className="mt-1 font-display text-3xl text-foreground">Gallery Images</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Manage the public-facing website gallery. Images uploaded here appear on the{" "}
            <strong>Gallery</strong> page for all visitors. They are completely independent of
            products — no product is created, modified, or associated.
          </p>
        </div>

        {/* ══════════════════════════════════════════
            SECTION 1 — ADD IMAGES
        ══════════════════════════════════════════ */}
        <div className="rounded-3xl border border-border/50 bg-card p-6 space-y-5">
          <h2 className="font-display text-xl text-foreground flex items-center gap-2">
            <ImagePlus className="size-5 text-primary" />
            Add Images
          </h2>
          <p className="text-sm text-muted-foreground">
            Select one or more images to upload. Each image is compressed and saved directly to the
            website gallery — no product selection required.
          </p>

          {/* Hidden input */}
          <input
            id="gallery-file-input"
            type="file"
            multiple
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Upload button */}
          <button
            type="button"
            id="gallery-upload-btn"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-xs font-semibold uppercase tracking-wider text-primary-foreground shadow transition-all hover:bg-primary/90 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading
              ? <><Loader2 className="size-4 animate-spin" /> Uploading…</>
              : <><ImagePlus className="size-4" /> Choose Images</>
            }
          </button>

          {uploading && (
            <p className="text-xs text-muted-foreground animate-pulse">
              Compressing and saving images, please wait…
            </p>
          )}
        </div>

        {/* ══════════════════════════════════════════
            SECTION 2 — MANAGE GALLERY IMAGES
        ══════════════════════════════════════════ */}
        <div className="rounded-3xl border border-border/50 bg-card p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl text-foreground flex items-center gap-2">
              <Images className="size-5 text-primary" />
              Manage Gallery Images
            </h2>
            {!loading && (
              <span className="text-xs font-semibold text-muted-foreground bg-secondary/80 px-3 py-1 rounded-full">
                {items.length} {items.length === 1 ? "image" : "images"}
              </span>
            )}
          </div>

          {/* Loading state */}
          {loading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground py-6">
              <Loader2 className="size-4 animate-spin" />
              Loading gallery…
            </div>
          )}

          {/* Empty state */}
          {!loading && items.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border/60 bg-secondary/10 px-6 py-12 text-center">
              <Images className="size-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm font-medium text-muted-foreground">No gallery images yet.</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Use the "Choose Images" button above to upload your first image.
              </p>
            </div>
          )}

          {/* ── Image grid ── */}
          {!loading && items.length > 0 && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {items.map((item) => {
                const isDeleting = deletingId === item.id;
                return (
                  <div
                    key={item.id}
                    className="flex flex-col rounded-2xl border border-border/60 overflow-hidden bg-background"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-square">
                      <img
                        src={item.url}
                        alt="Gallery image"
                        className="h-full w-full object-cover"
                      />
                      {/* Deleting overlay */}
                      {isDeleting && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/55 backdrop-blur-sm">
                          <Loader2 className="size-6 animate-spin text-white" />
                        </div>
                      )}
                    </div>

                    {/* ── DELETE BUTTON — always visible ── */}
                    <button
                      type="button"
                      id={`delete-gallery-${item.id}`}
                      onClick={() => handleDelete(item)}
                      disabled={isDeleting}
                      className="flex items-center justify-center gap-1.5 w-full py-2.5 px-3 text-xs font-semibold uppercase tracking-wider text-red-500 bg-red-500/5 border-t border-border/60 transition-colors hover:bg-red-500/15 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="size-3.5 shrink-0" />
                      {isDeleting ? "Deleting…" : "Delete"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </Reveal>
  );
}