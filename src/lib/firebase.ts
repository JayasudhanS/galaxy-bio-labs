import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

// Firebase project config — supplied via environment variables so real
// credentials never live in source control. Copy `.env.example` to `.env`
// and fill in the values from the Firebase console (Project settings →
// General → Your apps → SDK setup and configuration).
const env = import.meta.env as Record<string, string | undefined>;

const firebaseConfig = {
  apiKey: env["VITE_FIREBASE_API_KEY"] ?? "",
  authDomain: env["VITE_FIREBASE_AUTH_DOMAIN"] ?? "",
  projectId: env["VITE_FIREBASE_PROJECT_ID"] ?? "",
  storageBucket: env["VITE_FIREBASE_STORAGE_BUCKET"] ?? "",
  messagingSenderId: env["VITE_FIREBASE_MESSAGING_SENDER_ID"] ?? "",
  appId: env["VITE_FIREBASE_APP_ID"] ?? "",
};

let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;

/**
 * Firebase must only be touched in the browser: TanStack Start renders
 * routes on the server first, and the Auth SDK reaches for `window` during
 * initialization. Every export below is a lazy getter so importing this
 * module during SSR never throws — the app is only created the first time
 * one of these is actually called, which in this codebase only happens
 * inside client effects/handlers.
 */
function getFirebaseApp(): FirebaseApp {
  if (typeof window === "undefined") {
    throw new Error("Firebase can only be used in the browser.");
  }
  if (!app) {
    if (import.meta.env.DEV && !firebaseConfig.apiKey) {
      console.warn(
        "[firebase] Missing VITE_FIREBASE_* environment variables. Copy .env.example to .env and fill in your Firebase project config.",
      );
    }
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  }
  return app;
}

export function getFirebaseAuth(): Auth {
  if (!authInstance) {
    authInstance = getAuth(getFirebaseApp());
  }
  return authInstance;
}

export function getFirebaseDb(): Firestore {
  if (!dbInstance) {
    dbInstance = getFirestore(getFirebaseApp());
  }
  return dbInstance;
}
