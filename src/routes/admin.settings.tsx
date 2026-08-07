import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/motion/Reveal";
import { useAuth } from "@/hooks/use-auth";
import { User, Bell, Shield, Sliders } from "lucide-react";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettingsPage,
});

function AdminSettingsPage() {
  const { profile, user } = useAuth();

  return (
    <Reveal>
      <div className="space-y-8 max-w-4xl">
        {/* Header */}
        <div>
          <p className="eyebrow text-accent">Management</p>
          <h1 className="mt-3 font-display text-4xl text-foreground">Settings</h1>
          <p className="mt-2.5 max-w-xl text-sm text-muted-foreground">
            Configure system settings and manage your administrator account credentials.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Column 1: Profile & Security */}
          <div className="space-y-6">
            {/* Profile Panel */}
            <div className="rounded-3xl border border-border/50 bg-card p-6.5 space-y-6">
              <h2 className="font-display text-xl text-foreground flex items-center gap-2">
                <User className="size-5 text-primary" />
                Administrator Profile
              </h2>
              <dl className="space-y-4 text-sm">
                <div className="border-b border-border/40 pb-3">
                  <dt className="text-[0.68rem] font-semibold uppercase tracking-wider text-muted-foreground">Name</dt>
                  <dd className="mt-1.5 font-medium text-foreground">{profile?.name ?? "Galaxy Admin"}</dd>
                </div>
                <div className="border-b border-border/40 pb-3">
                  <dt className="text-[0.68rem] font-semibold uppercase tracking-wider text-muted-foreground">Email Address</dt>
                  <dd className="mt-1.5 font-medium text-foreground">{profile?.email ?? user?.email ?? "admin@galaxybiolabs.com"}</dd>
                </div>
                <div>
                  <dt className="text-[0.68rem] font-semibold uppercase tracking-wider text-muted-foreground">System Role</dt>
                  <dd className="mt-1.5 inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary capitalize">
                    {profile?.role ?? "Admin"}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Security Placeholder */}
            <div className="rounded-3xl border border-border/50 bg-card p-6.5 space-y-6">
              <h2 className="font-display text-xl text-foreground flex items-center gap-2">
                <Shield className="size-5 text-primary" />
                Security
              </h2>
              <div className="space-y-4">
                <button
                  type="button"
                  disabled
                  className="w-full rounded-2xl border border-border bg-secondary/15 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 cursor-not-allowed"
                >
                  Change Password (Disabled)
                </button>
                <button
                  type="button"
                  disabled
                  className="w-full rounded-2xl border border-border bg-secondary/15 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 cursor-not-allowed"
                >
                  Configure Two-Factor Auth
                </button>
              </div>
            </div>
          </div>

          {/* Column 2: System Preferences */}
          <div className="space-y-6">
            {/* Preferences Panel */}
            <div className="rounded-3xl border border-border/50 bg-card p-6.5 space-y-6">
              <h2 className="font-display text-xl text-foreground flex items-center gap-2">
                <Sliders className="size-5 text-primary" />
                Preferences
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border/40 pb-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Maintenance Mode</p>
                    <p className="text-xs text-muted-foreground">Restrict public store access.</p>
                  </div>
                  <input
                    type="checkbox"
                    disabled
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-not-allowed"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Catalog Visibility</p>
                    <p className="text-xs text-muted-foreground">Enable guest view on products page.</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    disabled
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Notifications Panel */}
            <div className="rounded-3xl border border-border/50 bg-card p-6.5 space-y-6">
              <h2 className="font-display text-xl text-foreground flex items-center gap-2">
                <Bell className="size-5 text-primary" />
                Notifications
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border/40 pb-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">New Quote Requests</p>
                    <p className="text-xs text-muted-foreground">Get email alerts on new submissions.</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    disabled
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-not-allowed"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Weekly Digest Reports</p>
                    <p className="text-xs text-muted-foreground">Receive weekly performance summaries.</p>
                  </div>
                  <input
                    type="checkbox"
                    disabled
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
