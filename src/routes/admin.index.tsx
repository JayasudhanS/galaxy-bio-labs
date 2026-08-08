import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { collection, onSnapshot, type Timestamp } from "firebase/firestore";
import { Reveal } from "@/components/motion/Reveal";
import {
  Package,
  FolderTree,
  MessageSquareText,
  Users,
} from "lucide-react";
import { getFirebaseDb } from "@/lib/firebase";
import { MODULES } from "@/data/site";

export const Route = createFileRoute("/admin/")({
  component: DashboardPage,
});

interface ActivityItem {
  key: string;
  text: string;
  millis: number;
}

function toMillis(value: unknown): number {
  if (!value) return 0;
  if (typeof value === "string") {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  const ts = value as Timestamp;
  return typeof ts?.toDate === "function" ? ts.toDate().getTime() : 0;
}

function DashboardPage() {
  const [productCount, setProductCount] = useState<number | null>(null);
  const [quoteCount, setQuoteCount] = useState<number | null>(null);
  const [userCount, setUserCount] = useState<number | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [productActivity, setProductActivity] = useState<ActivityItem[]>([]);
  const [quoteActivity, setQuoteActivity] = useState<ActivityItem[]>([]);

  useEffect(() => {
    const db = getFirebaseDb();

    const unsubProducts = onSnapshot(
      collection(db, "products"),
      (snap) => {
        setProductCount(snap.size);
        setProductActivity(
          snap.docs.map((d) => {
            const data = d.data() as { title?: string; createdAt?: string };
            return {
              key: `product-${d.id}`,
              text: `New product added: ${data.title ?? "Untitled product"}`,
              millis: toMillis(data.createdAt),
            };
          }),
        );
      },
      (err) => console.error("[AdminDashboard] products listener failed:", err),
    );

    const unsubQuotes = onSnapshot(
      collection(db, "quoteRequests"),
      (snap) => {
        setQuoteCount(snap.size);
        setQuoteActivity(
          snap.docs.map((d) => {
            const data = d.data() as { productName?: string; name?: string; createdAt?: Timestamp };
            return {
              key: `quote-${d.id}`,
              text: `New quote request from ${data.name ?? "a customer"}${data.productName ? ` for ${data.productName}` : ""
                }`,
              millis: toMillis(data.createdAt),
            };
          }),
        );
      },
      (err) => console.error("[AdminDashboard] quoteRequests listener failed:", err),
    );

    const unsubUsers = onSnapshot(
      collection(db, "users"),
      (snap) => setUserCount(snap.size),
      (err) => console.error("[AdminDashboard] users listener failed:", err),
    );

    return () => {
      unsubProducts();
      unsubQuotes();
      unsubUsers();
    };
  }, []);

  useEffect(() => {
    setActivity(
      [...productActivity, ...quoteActivity]
        .filter((item) => item.millis > 0)
        .sort((a, b) => b.millis - a.millis)
        .slice(0, 5),
    );
  }, [productActivity, quoteActivity]);

  const fmt = (n: number | null) => (n === null ? "—" : n);

  const stats = [
    {
      label: "Total Products",
      value: fmt(productCount),
      icon: Package,
      description: "Biological inputs, aquaculture & food products",
    },
    {
      label: "Total Categories",
      value: MODULES.length, // Agri Inputs, Aquaculture, Ornamental Fish, Food Products
      icon: FolderTree,
      description: "Fixed product categories",
    },
    {
      label: "Total Quotes",
      value: fmt(quoteCount),
      icon: MessageSquareText,
      description: "Pending and processed quote requests",
    },
    {
      label: "Total Users",
      value: fmt(userCount),
      icon: Users,
      description: "Registered administrators and customers",
    },
  ];

  return (
    <Reveal>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <p className="eyebrow text-accent">Admin</p>
          <h1 className="mt-3 font-display text-4xl text-foreground">Dashboard</h1>
          <p className="mt-2.5 max-w-xl text-sm text-muted-foreground">
            A high-level view of your platform's catalog, customer enquiries, and system access.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="group relative overflow-hidden rounded-3xl border border-border/60 bg-card p-6.5 transition-all duration-300 hover:border-primary/20 hover:shadow-[var(--shadow-lift)]"
            >
              {/* Soft background hover effect */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="mt-3.5 font-display text-5xl font-medium tracking-tight text-foreground transition-all group-hover:scale-105 origin-left duration-300">
                    {stat.value}
                  </p>
                </div>
                <div className="rounded-2xl bg-secondary/80 p-3.5 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  <stat.icon className="size-6" />
                </div>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        {activity.length === 0 ? (
          <div className="rounded-3xl border border-border/50 bg-secondary/20 p-8 text-center">
            <p className="font-display text-lg text-foreground/80">No recent activity</p>
            <p className="mt-1 text-sm text-muted-foreground">
              New quote submissions and product catalog updates will appear here.
            </p>
          </div>
        ) : (
          <div className="rounded-3xl border border-border/50 bg-secondary/20 p-8">
            <p className="font-display text-lg text-foreground/80">Recent activity</p>
            <ul className="mt-4 space-y-3">
              {activity.map((item) => (
                <li key={item.key} className="text-sm text-muted-foreground">
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Reveal>
  );
}
