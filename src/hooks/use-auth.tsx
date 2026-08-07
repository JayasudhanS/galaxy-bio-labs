import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { onAuthStateChanged, signOut as firebaseSignOut, type User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { getFirebaseAuth, getFirebaseDb } from "@/lib/firebase";

export type UserRole = "user" | "admin";

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  createdAt: string;
}

interface AuthCtx {
  user: User | null;
  profile: UserProfile | null;
  role: UserRole | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthCtx>({
  user: null,
  profile: null,
  role: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const unsubscribe = onAuthStateChanged(getFirebaseAuth(), (firebaseUser) => {
      setUser(firebaseUser);

      if (!firebaseUser) {
        // No user — clear profile and mark loading done immediately.
        setProfile(null);
        setLoading(false);
        return;
      }

      // User is signed in. Keep loading=true until we know their role.
      getDoc(doc(getFirebaseDb(), "users", firebaseUser.uid))
        .then((snap) => {
          if (snap.exists()) {
            setProfile(snap.data() as UserProfile);
          } else {
            setProfile(null);
          }
        })
        .catch((err) => {
          console.error("Failed to load profile:", err);
          setProfile(null);
        })
        .finally(() => {
          // Only now is auth + role both known.
          setLoading(false);
        });
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    await firebaseSignOut(getFirebaseAuth());
    setProfile(null);
  };

  const value = useMemo(
    () => ({
      user,
      profile,
      role: profile?.role ?? null,
      loading,
      signOut,
    }),
    [user, profile, loading],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}