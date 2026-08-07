import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Check, Loader2 } from "lucide-react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { MODULES } from "@/data/site";
import { getFirebaseDb } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";

interface QuoteTarget {
  product?: string;
  productId?: string;
  category?: string;
}

interface QuoteCtx {
  open: (target?: QuoteTarget) => void;
}

const Ctx = createContext<QuoteCtx>({ open: () => {} });

export const useQuote = () => useContext(Ctx);

const FIELDS = [
  { name: "name", label: "Full name", type: "text", required: true },
  { name: "phone", label: "Phone", type: "tel", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "location", label: "Location", type: "text", required: true },
] as const;

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [target, setTarget] = useState<QuoteTarget | null>(null);
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { user } = useAuth();

  const open = useCallback((t?: QuoteTarget) => {
    setState("idle");
    setSubmitError(null);
    setTarget(t ?? {});
  }, []);

  const close = () => setTarget(null);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    setState("sending");
    setSubmitError(null);
    try {
      await addDoc(collection(getFirebaseDb(), "quoteRequests"), {
        name: data["name"] ?? "",
        email: data["email"] ?? "",
        phone: data["phone"] ?? "",
        location: data["location"] ?? "",
        message: data["message"] ?? "",
        productName: target?.product ?? "General enquiry",
        productId: target?.productId ?? null,
        category: target?.category ?? null,
        uid: user?.uid ?? null,
        status: "New",
        createdAt: serverTimestamp(),
      });
      setState("done");
    } catch (err) {
      console.error("[QuoteProvider] Failed to submit quote request:", err);
      setSubmitError("Couldn't submit your request. Please try again.");
      setState("idle");
    }
  };

  const value = useMemo(() => ({ open }), [open]);

  return (
    <Ctx.Provider value={value}>
      {children}
      <AnimatePresence>
        {target && (
          <motion.div
            className="fixed inset-0 z-100 flex items-end justify-center p-0 sm:items-center sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              aria-label="Close quote form"
              onClick={close}
              className="absolute inset-0 cursor-default bg-[color-mix(in_oklab,var(--forest-deep)_70%,transparent)] backdrop-blur-sm"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Request a quote"
              initial={{ y: 40, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 30, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg overflow-hidden rounded-t-3xl bg-background shadow-[var(--shadow-float)] sm:rounded-3xl"
            >
              <div className="flex items-start justify-between gap-6 border-b border-border/70 px-7 pb-6 pt-7">
                <div>
                  <p className="eyebrow">Request a quote</p>
                  <h3 className="mt-2 font-display text-2xl">
                    {target.product ?? "Tell us what you need"}
                  </h3>
                  {target.category && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {MODULES.find((m) => m.slug === target.category)?.name ?? target.category}
                    </p>
                  )}
                </div>
                <button
                  onClick={close}
                  aria-label="Close"
                  className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              </div>

              {state === "done" ? (
                <div className="px-7 py-14 text-center">
                  <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
                    <Check className="size-6" />
                  </span>
                  <h4 className="mt-5 font-display text-xl">Request received</h4>
                  <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">
                    Our team will reach out within one working day.
                  </p>
                  <button
                    onClick={close}
                    className="mt-7 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-primary nav-underline"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-4 px-7 py-7">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {FIELDS.map((f) => (
                      <label key={f.name} className="block">
                        <span className="mb-1.5 block text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
                          {f.label}
                        </span>
                        <input
                          name={f.name}
                          type={f.type}
                          required={f.required}
                          maxLength={120}
                          className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                        />
                      </label>
                    ))}
                  </div>
                  <label className="block">
                    <span className="mb-1.5 block text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
                      Message
                    </span>
                    <textarea
                      name="message"
                      rows={3}
                      maxLength={1000}
                      className="w-full resize-none rounded-xl border border-input bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                      placeholder="Quantity, timeline, delivery location…"
                    />
                  </label>
                  {submitError && <p className="text-sm text-destructive">{submitError}</p>}
                  <button
                    type="submit"
                    disabled={state === "sending"}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-70"
                  >
                    {state === "sending" && <Loader2 className="size-4 animate-spin" />}
                    Submit request
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Ctx.Provider>
  );
}
