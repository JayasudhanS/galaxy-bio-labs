import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
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

const title = "Create an account — Galaxy Bio Labs";
const description = "Register for a Galaxy Bio Labs account to track quote requests and enquiries.";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Register,
});

interface FormState {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

const initialState: FormState = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = (): string | null => {
    if (!form.name.trim()) return "Enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      return "Enter a valid email address.";
    if (!/^[+\d][\d\s-]{6,}$/.test(form.phone.trim())) return "Enter a valid phone number.";
    if (form.password.length < 6) return "Password must be at least 6 characters.";
    if (form.password !== form.confirmPassword) return "Passwords do not match.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setSubmitting(true);

    // Each stage is logged so a real failure is easy to pinpoint from the
    // browser console. Only the two operations that actually determine
    // whether the account exists (auth creation, Firestore profile write)
    // are allowed to surface as a registration error — a hiccup in a
    // non-critical step (display name, navigation) is logged but never
    // shown to the user as "couldn't create your account".
    try {
      console.log("[Register] Creating auth account for", form.email.trim());
      const auth = getFirebaseAuth();
      const credential = await createUserWithEmailAndPassword(
        auth,
        form.email.trim(),
        form.password,
      );
      console.log("[Register] Auth account created:", credential.user.uid);

      try {
        await updateProfile(credential.user, { displayName: form.name.trim() });
        console.log("[Register] Display name set");
      } catch (profileErr) {
        // Non-critical: the account and Firestore doc are what matter.
        console.warn("[Register] updateProfile failed (non-fatal):", profileErr);
      }

      // Role is never taken from the form — every self-registered account
      // is always a plain "user". Admins are provisioned manually in Firestore.
      console.log("[Register] Writing Firestore profile document");
      await setDoc(doc(getFirebaseDb(), "users", credential.user.uid), {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        role: "user",
        createdAt: serverTimestamp(),
      });
      console.log("[Register] Firestore profile document created");

      try {
        console.log("[Register] Redirecting to /");
        navigate({ to: "/" });
      } catch (navErr) {
        // Account + profile are both saved at this point — a routing issue
        // here is not a registration failure.
        console.warn("[Register] navigate() failed after successful registration:", navErr);
      }
    } catch (err) {
      console.error("[Register] Registration failed:", err);
      setError(getAuthErrorMessage(err, "Couldn't create your account. Please try again."));
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Galaxy Bio Labs"
      panelText="Create an account to track your quote requests and product enquiries in one place."
    >
      <Reveal delay={0.06}>
        <h1 className="mt-8 font-display text-4xl">Create account</h1>
      </Reveal>
      <Reveal delay={0.12}>
        <p className="mt-3 text-sm text-muted-foreground">It only takes a minute.</p>
      </Reveal>

      <form className="mt-10 space-y-5" onSubmit={handleSubmit}>
        <label className="block">
          <FieldLabel>Full name</FieldLabel>
          <input
            type="text"
            required
            autoComplete="name"
            value={form.name}
            onChange={update("name")}
            className={authInputClass}
          />
        </label>
        <label className="block">
          <FieldLabel>Email</FieldLabel>
          <input
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={update("email")}
            className={authInputClass}
          />
        </label>
        <label className="block">
          <FieldLabel>Phone number</FieldLabel>
          <input
            type="tel"
            required
            autoComplete="tel"
            value={form.phone}
            onChange={update("phone")}
            className={authInputClass}
          />
        </label>
        <label className="block">
          <FieldLabel>Password</FieldLabel>
          <input
            type="password"
            required
            autoComplete="new-password"
            value={form.password}
            onChange={update("password")}
            className={authInputClass}
          />
        </label>
        <label className="block">
          <FieldLabel>Confirm password</FieldLabel>
          <input
            type="password"
            required
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={update("confirmPassword")}
            className={authInputClass}
          />
        </label>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <button type="submit" disabled={submitting} className={authButtonClass}>
          {submitting && <Loader2 className="size-4 animate-spin" />}
          Create account
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="nav-underline font-medium text-primary">
          Sign in
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
