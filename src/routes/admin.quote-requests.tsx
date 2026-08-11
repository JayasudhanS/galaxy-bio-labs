import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, type Timestamp } from "firebase/firestore";
import { Reveal } from "@/components/motion/Reveal";
import { MessageSquareOff, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { getFirebaseDb } from "@/lib/firebase";
import { MODULES } from "@/data/site";

export const Route = createFileRoute("/admin/quote-requests")({
  component: AdminQuoteRequestsPage,
});

interface QuoteRequest {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  message?: string;
  productName?: string;
  productId?: string | null;
  category?: string | null;
  status?: string;
  createdAt?: Timestamp | null;
}

function formatDate(ts?: Timestamp | null) {
  if (!ts) return "Just now";
  try {
    return ts.toDate().toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

function categoryName(slug?: string | null) {
  if (!slug) return "—";
  return MODULES.find((m) => m.slug === slug)?.name ?? slug;
}

function AdminQuoteRequestsPage() {
  const [requests, setRequests] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this quote request? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      const db = getFirebaseDb();
      await deleteDoc(doc(db, "quoteRequests", id));
      toast.success("Quote request deleted.");
      // The onSnapshot listener below will remove it from the UI once
      // Firestore confirms the delete — no local-only/optimistic removal.
    } catch (err) {
      console.error("[AdminQuoteRequests] Failed to delete quote request:", err);
      toast.error("Failed to delete quote request. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    const db = getFirebaseDb();
    const q = query(collection(db, "quoteRequests"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setRequests(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<QuoteRequest, "id">) })));
        setLoading(false);
      },
      (err) => {
        console.error("[AdminQuoteRequests] Failed to load quote requests:", err);
        setLoading(false);
      },
    );
    return () => unsubscribe();
  }, []);

  return (
    <Reveal>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <p className="eyebrow text-accent">Enquiries</p>
          <h1 className="mt-3 font-display text-4xl text-foreground">Quote Requests</h1>
          <p className="mt-2.5 max-w-xl text-sm text-muted-foreground">
            Manage inquiries submitted by customers seeking quotes for biological products.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-border/60 bg-card">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-sm text-muted-foreground space-y-3">
              <Loader2 className="size-8 animate-spin text-primary" />
              <span>Fetching quote requests...</span>
            </div>
          ) : requests.length === 0 ? (
            <div className="rounded-3xl p-16 text-center">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="rounded-full bg-secondary/80 p-4.5 text-muted-foreground/50">
                  <MessageSquareOff className="size-8" />
                </div>
                <div>
                  <p className="font-display text-lg font-medium text-foreground">
                    No quote requests yet.
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground max-w-xs mx-auto">
                    Customer requests will automatically populate this section once submitted.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border/60 bg-secondary/30 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {["Customer", "Contact", "Product", "Message", "Status", "Submitted", ""].map((col) => (
                      <th key={col} className="px-6 py-4.5">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {requests.map((r) => (
                    <tr key={r.id} className="align-top hover:bg-secondary/10 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-foreground">{r.name || "—"}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{r.location || "—"}</p>
                      </td>
                      <td className="px-6 py-4 text-xs text-muted-foreground">
                        <p>{r.email || "—"}</p>
                        <p className="mt-0.5">{r.phone || "—"}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-foreground">{r.productName || "General enquiry"}</p>
                        <p className="mt-0.5 text-xs uppercase tracking-wider text-muted-foreground">
                          {categoryName(r.category)}
                        </p>
                      </td>
                      <td className="max-w-[16rem] px-6 py-4 text-xs text-muted-foreground">
                        {r.message || "—"}
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-wider text-primary">
                          {r.status || "New"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-muted-foreground">
                        {formatDate(r.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => handleDelete(r.id)}
                          disabled={deletingId === r.id}
                          aria-label="Delete quote request"
                          title="Delete quote request"
                          className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                        >
                          {deletingId === r.id ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <Trash2 className="size-4" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Reveal>
  );
}