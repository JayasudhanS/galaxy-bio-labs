import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/motion/Reveal";
import { Users2 } from "lucide-react";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsersPage,
});

function AdminUsersPage() {
  return (
    <Reveal>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <p className="eyebrow text-accent">Access Control</p>
          <h1 className="mt-3 font-display text-4xl text-foreground">Users</h1>
          <p className="mt-2.5 max-w-xl text-sm text-muted-foreground">
            Monitor registered platform administrators, staff, and customer accounts.
          </p>
        </div>

        {/* Placeholder / Empty State */}
        <div className="rounded-3xl border border-border/50 bg-secondary/10 p-16 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="rounded-full bg-secondary/80 p-4.5 text-muted-foreground/50">
              <Users2 className="size-8" />
            </div>
            <div>
              <p className="font-display text-lg font-medium text-foreground">
                No users available.
              </p>
              <p className="mt-1 text-sm text-muted-foreground max-w-xs mx-auto">
                Users registered on the portal will appear here once active.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
