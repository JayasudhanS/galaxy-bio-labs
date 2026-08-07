import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Loader2 } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import {
  AuthLayout,
  FieldLabel,
  authInputClass,
  authButtonClass,
} from "@/components/auth/AuthLayout";
import { getFirebaseAuth, getFirebaseDb } from "@/lib/firebase";
import { getAuthErrorMessage } from "@/lib/auth-errors";

const title = "Sign in — Galaxy Bio Labs";
const description =
  "Access your Galaxy Bio Labs account to manage quote requests and product enquiries.";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    // Only signInWithEmailAndPassword can legitimately fail login. The role
    // lookup and the redirect happen after valid credentials are already
    // confirmed, so a hiccup in either of those must never be reported as
    // "couldn't sign in" — it's logged instead and falls back safely.
    try {
      console.log("[Login] Signing in", email.trim());
      const credential = await signInWithEmailAndPassword(
        getFirebaseAuth(),
        email.trim(),
        password,
      );
      console.log("[Login] Sign-in succeeded:", credential.user.uid);

      let role = "user";
      try {
        const snap = await getDoc(doc(getFirebaseDb(), "users", credential.user.uid));
        role = snap.exists() ? ((snap.data()["role"] as string) ?? "user") : "user";
        console.log("[Login] Role loaded:", role, "(profile exists:", snap.exists(), ")");
      } catch (roleErr) {
        // Credentials are valid regardless of whether this read succeeds —
        // default to "user" rather than blocking sign-in.
        console.warn("[Login] Role lookup failed, defaulting to 'user':", roleErr);
      }

      try {
        const target = role === "admin" ? "/admin" : "/";
        console.log("[Login] Redirecting to", target);
        navigate({ to: target });
      } catch (navErr) {
        console.warn("[Login] navigate() failed after successful sign-in:", navErr);
      }
    } catch (err) {
      console.error("[Login] Sign-in failed:", err);
      setError(getAuthErrorMessage(err, "Couldn't sign in with those details. Please try again."));
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Galaxy Bio Labs"
      panelText="Sign in to manage quote requests, saved products and enquiry history."
    >
      <Reveal delay={0.06}>
        <h1 className="mt-8 font-display text-4xl">Welcome back</h1>
      </Reveal>
      <Reveal delay={0.12}>
        <p className="mt-3 text-sm text-muted-foreground">Sign in to continue to your account.</p>
      </Reveal>

      <form className="mt-10 space-y-5" onSubmit={handleSubmit}>
        <label className="block">
          <FieldLabel>Email</FieldLabel>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={authInputClass}
          />
        </label>
        <label className="block">
          <FieldLabel>Password</FieldLabel>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={authInputClass}
          />
        </label>

        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="nav-underline text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground hover:text-primary"
          >
            Forgot password?
          </Link>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <button type="submit" disabled={submitting} className={authButtonClass}>
          {submitting && <Loader2 className="size-4 animate-spin" />}
          Sign in
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="nav-underline font-medium text-primary">
          Create one
        </Link>
      </p>

      <Link
        to="/"
        className="nav-underline mt-6 inline-block text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground"
      >
        Back to site
      </Link>
    </AuthLayout>
  );
}
