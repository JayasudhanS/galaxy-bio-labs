import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { collection, getDocs, query, Timestamp, where } from "firebase/firestore";
import { Loader2, Package, Heart, Clock, User2 } from "lucide-react";
import { z } from "zod";
import { Reveal } from "@/components/motion/Reveal";
import { PageHeader } from "@/components/PageHeader";
import { useAuth } from "@/hooks/use-auth";
import { getFirebaseDb } from "@/lib/firebase";

const title = "My account — Galaxy Bio Labs";

const searchSchema = z.object({
  tab: z.enum(["profile", "quotes", "settings"]).optional(),
});

export const Route = createFileRoute("/dashboard")({
  validateSearch: (search) => searchSchema.parse(search),
  head: () => ({
    meta: [{ title }, { name: "robots", content: "noindex" }],
  }),
  component: DashboardPage,
});

interface QuoteRequest {
  id: string;
  productName: string;
  category: string | null;
  message: string;
  status: string;
  createdAt: Timestamp | null;
}

const TABS = [
  { key: "profile", label: "Profile" },
  { key: "quotes", label: "My Quote Requests" },
  { key: "settings", label: "Settings" },
] as const;

function formatDate(ts: Timestamp | null) {
  if (!ts) return "—";
  try {
    return ts.toDate().toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "—";
  }
}

function DashboardPage() {
  const { user, profile, role, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const search = Route.useSearch();
  const activeTab = search.tab ?? "profile";

  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [quotesLoading, setQuotesLoading] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    // Admins manage their account from the admin dashboard, not the public
    // profile page — send them straight there instead of showing this page.
    if (role === "admin") {
      navigate({ to: "/admin" });
    }
  }, [loading, user, role, navigate]);

  useEffect(() => {
    // Admins are redirected away before this page renders anything useful —
    // skip the read entirely rather than fetching data that's about to be
    // discarded.
    if (!user || role === "admin") return;
    let cancelled = false;
    setQuotesLoading(true);
    (async () => {
      try {
        const snap = await getDocs(
          query(collection(getFirebaseDb(), "quoteRequests"), where("uid", "==", user.uid)),
        );
        if (cancelled) return;
        const rows = snap.docs
          .map((d) => {
            const data = d.data();
            return {
              id: d.id,
              productName: (data["productName"] as string) ?? "General enquiry",
              category: (data["category"] as string | null) ?? null,
              message: (data["message"] as string) ?? "",
              status: (data["status"] as string) ?? "New",
              createdAt: (data["createdAt"] as Timestamp) ?? null,
            } satisfies QuoteRequest;
          })
          .sort((a, b) => (b.createdAt?.toMillis() ?? 0) - (a.createdAt?.toMillis() ?? 0));
        setQuotes(rows);
      } catch (err) {
        console.warn("[Dashboard] Failed to load quote requests:", err);
      } finally {
        if (!cancelled) setQuotesLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, role]);

  if (loading || !user || role === "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  return (
    <>
      <PageHeader
        eyebrow="My account"
        title={profile?.name ? `Welcome, ${profile.name.split(" ")[0]}` : "Welcome back"}
        copy="Manage your profile, track quote requests and keep an eye on your activity with Galaxy Bio Labs."
      />

      <section className="gbl-container py-16 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
          <nav className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:px-0 lg:flex-col lg:overflow-visible [&::-webkit-scrollbar]:hidden">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => navigate({ to: "/dashboard", search: { tab: t.key } })}
                className={`shrink-0 whitespace-nowrap rounded-full px-5 py-3 text-left text-[0.75rem] font-medium uppercase tracking-[0.1em] transition-colors lg:rounded-xl ${
                  activeTab === t.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground/70 hover:text-primary"
                }`}
              >
                {t.label}
              </button>
            ))}
            <button
              onClick={handleSignOut}
              className="hidden whitespace-nowrap rounded-xl px-5 py-3 text-left text-[0.75rem] font-medium uppercase tracking-[0.1em] text-muted-foreground hover:text-destructive lg:block"
            >
              Logout
            </button>
          </nav>

          <div>
            {activeTab === "profile" && (
              <Reveal>
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <span className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <User2 className="size-7" />
                    </span>
                    <div>
                      <h2 className="font-display text-2xl">{profile?.name ?? "—"}</h2>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>

                  <dl className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <dt className="text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
                        Name
                      </dt>
                      <dd className="mt-1.5 text-sm">{profile?.name ?? "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
                        Email
                      </dt>
                      <dd className="mt-1.5 break-all text-sm">{profile?.email ?? user.email}</dd>
                    </div>
                    <div>
                      <dt className="text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
                        Phone
                      </dt>
                      <dd className="mt-1.5 text-sm">{profile?.phone ?? "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
                        Role
                      </dt>
                      <dd className="mt-1.5 text-sm capitalize">{profile?.role ?? "user"}</dd>
                    </div>
                    <div>
                      <dt className="text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
                        Account created
                      </dt>
                      <dd className="mt-1.5 text-sm">
                        {formatDate(profile?.createdAt as unknown as Timestamp)}
                      </dd>
                    </div>
                  </dl>

                  <div className="grid gap-4 border-t border-border/70 pt-8 sm:grid-cols-3">
                    <PlaceholderCard icon={Package} label="Future orders" copy="Coming soon" />
                    <PlaceholderCard icon={Heart} label="Wishlist" copy="Coming soon" />
                    <PlaceholderCard icon={Clock} label="Recent activity" copy="Coming soon" />
                  </div>
                </div>
              </Reveal>
            )}

            {activeTab === "quotes" && (
              <Reveal>
                <h2 className="font-display text-2xl">My quote requests</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Enquiries you've submitted across the catalogue.
                </p>

                <div className="mt-8">
                  {quotesLoading ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="size-4 animate-spin" /> Loading…
                    </div>
                  ) : quotes.length === 0 ? (
                    <p className="rounded-2xl bg-secondary px-6 py-10 text-center text-sm text-muted-foreground">
                      You haven't submitted any quote requests yet.
                    </p>
                  ) : (
                    <ul className="divide-y divide-border/70 rounded-2xl border border-border/70">
                      {quotes.map((q) => (
                        <li key={q.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-5">
                          <div>
                            <p className="font-medium">{q.productName}</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {formatDate(q.createdAt)}
                              {q.category ? ` · ${q.category}` : ""}
                            </p>
                          </div>
                          <span className="rounded-full bg-secondary px-3.5 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-foreground/70">
                            {q.status}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </Reveal>
            )}

            {activeTab === "settings" && (
              <Reveal>
                <h2 className="font-display text-2xl">Settings</h2>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  Password changes and notification preferences are coming soon. For now, use
                  "Forgot password" from the login screen to reset your password.
                </p>
                <button
                  onClick={handleSignOut}
                  className="mt-8 rounded-full border border-input px-6 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-foreground transition-colors hover:bg-secondary lg:hidden"
                >
                  Sign out
                </button>
              </Reveal>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function PlaceholderCard({
  icon: Icon,
  label,
  copy,
}: {
  icon: typeof Package;
  label: string;
  copy: string;
}) {
  return (
    <div className="rounded-2xl bg-secondary px-5 py-6">
      <Icon className="size-5 text-primary" />
      <p className="mt-3 text-sm font-medium">{label}</p>
      <p className="mt-1 text-xs text-muted-foreground">{copy}</p>
    </div>
  );
}
