import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { sendPasswordResetEmail } from "firebase/auth";
import { Check, Loader2 } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import {
  AuthLayout,
  FieldLabel,
  authInputClass,
  authButtonClass,
} from "@/components/auth/AuthLayout";
import { getFirebaseAuth } from "@/lib/firebase";
import { getAuthErrorMessage } from "@/lib/auth-errors";

const title = "Reset your password — Galaxy Bio Labs";
const description = "Request a password reset link for your Galaxy Bio Labs account.";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ForgotPassword,
});

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await sendPasswordResetEmail(getFirebaseAuth(), email.trim());
      setSent(true);
    } catch (err) {
      setError(getAuthErrorMessage(err, "Couldn't send the reset email. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Galaxy Bio Labs"
      panelText="We'll send a secure link to reset your password."
    >
      <Reveal delay={0.06}>
        <h1 className="mt-8 font-display text-4xl">Reset password</h1>
      </Reveal>
      <Reveal delay={0.12}>
        <p className="mt-3 text-sm text-muted-foreground">
          Enter the email linked to your account and we&apos;ll send you a link to reset your
          password.
        </p>
      </Reveal>

      {sent ? (
        <div className="mt-10">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-secondary text-primary">
            <Check className="size-5" />
          </span>
          <p className="mt-5 text-center text-sm text-muted-foreground">
            If an account exists for <span className="font-medium text-foreground">{email}</span>, a
            password reset link is on its way. Check your inbox (and spam folder).
          </p>
        </div>
      ) : (
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

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button type="submit" disabled={submitting} className={authButtonClass}>
            {submitting && <Loader2 className="size-4 animate-spin" />}
            Send reset link
          </button>
        </form>
      )}

      <Link
        to="/login"
        className="nav-underline mt-8 inline-block text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground"
      >
        Back to sign in
      </Link>
    </AuthLayout>
  );
}
