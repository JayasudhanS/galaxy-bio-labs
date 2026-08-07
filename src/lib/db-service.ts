import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { getFirebaseDb } from "./firebase";
import { PRODUCTS, type Product } from "../data/site";

const COLLECTION_NAME = "products";

export async function seedProductsIfEmpty() {
  if (typeof window === "undefined") return;
  try {
    const db = getFirebaseDb();
    const snap = await getDocs(collection(db, COLLECTION_NAME));
    if (snap.empty) {
      console.log("[DbService] Firestore products collection is empty. Seeding defaults...");
      const batch = writeBatch(db);
      for (const p of PRODUCTS) {
        const ref = doc(db, COLLECTION_NAME, p.slug);
        batch.set(ref, {
          ...p,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
      await batch.commit();
      console.log("[DbService] Seeding complete.");
    }
  } catch (err) {
    console.error("[DbService] Failed to seed products:", err);
  }
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
