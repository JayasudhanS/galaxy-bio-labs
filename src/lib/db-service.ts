import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { getFirebaseDb } from "./firebase";
import { type Product } from "../data/site";

const COLLECTION_NAME = "products";

export async function seedProductsIfEmpty() {
  // Seeding disabled to ensure Firestore is the sole source of truth.
  return;
}

export async function getAllProducts(): Promise<Product[]> {
  if (typeof window === "undefined") return [];
  await seedProductsIfEmpty();
  try {
    const db = getFirebaseDb();
    const snap = await getDocs(collection(db, COLLECTION_NAME));
    return snap.docs.map((d) => d.data() as Product);
  } catch (err) {
    console.error("[DbService] Failed to get all products:", err);
    return [];
  }
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  if (typeof window === "undefined") return [];
  await seedProductsIfEmpty();
  try {
    const db = getFirebaseDb();
    const q = query(collection(db, COLLECTION_NAME), where("category", "==", category));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as Product);
  } catch (err) {
    console.error("[DbService] Failed to get products by category:", err);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (typeof window === "undefined") return null;
  await seedProductsIfEmpty();
  try {
    const db = getFirebaseDb();
    const docRef = doc(db, COLLECTION_NAME, slug);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as Product;
    }
  } catch (err) {
    console.error("[DbService] Failed to get product by slug:", err);
  }
  return null;
}

export async function saveProduct(product: Omit<Product, "createdAt" | "updatedAt">) {
  if (typeof window === "undefined") return;
  const db = getFirebaseDb();
  const ref = doc(db, COLLECTION_NAME, product.slug);
  const existing = await getDoc(ref);
  const now = new Date().toISOString();
  
  const data = {
    ...product,
    createdAt: existing.exists() ? (existing.data()["createdAt"] || now) : now,
    updatedAt: now,
  };
  await setDoc(ref, data);
}

export async function deleteProduct(slug: string) {
  if (typeof window === "undefined") return;
  const db = getFirebaseDb();
  await deleteDoc(doc(db, COLLECTION_NAME, slug));
}

// Used only by Admin → Gallery Images. Writes just the galleryImages field
// (via updateDoc, not setDoc) so it can never overwrite the rest of the
// product document — title, description, primary images, etc. all stay
// exactly as they are.
export async function updateProductGalleryImages(slug: string, galleryImages: string[]) {
  if (typeof window === "undefined") return;
  const db = getFirebaseDb();
  const ref = doc(db, COLLECTION_NAME, slug);
  await updateDoc(ref, {
    galleryImages,
    updatedAt: new Date().toISOString(),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// INDEPENDENT WEBSITE GALLERY  (Firestore collection: "gallery")
// Completely separate from the products collection. No product data is read
// or written by any of these functions.
// ─────────────────────────────────────────────────────────────────────────────

export interface GalleryItem {
  id: string;
  url: string;       // base64 or remote URL
  createdAt: string;
}

const GALLERY_COLLECTION = "gallery";

export async function addGalleryItem(url: string): Promise<GalleryItem> {
  const db = getFirebaseDb();
  const id = `gallery_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const item: GalleryItem = { id, url, createdAt: new Date().toISOString() };
  await setDoc(doc(db, GALLERY_COLLECTION, id), item);
  return item;
}

export async function getAllGalleryItems(): Promise<GalleryItem[]> {
  if (typeof window === "undefined") return [];
  try {
    const db = getFirebaseDb();
    const snap = await getDocs(collection(db, GALLERY_COLLECTION));
    const items = snap.docs.map((d) => d.data() as GalleryItem);
    // Sort oldest-first so the grid order is stable.
    items.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    return items;
  } catch (err) {
    console.error("[DbService] Failed to get gallery items:", err);
    return [];
  }
}

export async function deleteGalleryItem(id: string): Promise<void> {
  if (typeof window === "undefined") return;
  const db = getFirebaseDb();
  await deleteDoc(doc(db, GALLERY_COLLECTION, id));
}
