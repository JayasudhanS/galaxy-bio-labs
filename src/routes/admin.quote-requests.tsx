import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/motion/Reveal";
import { MessageSquareOff } from "lucide-react";

export const Route = createFileRoute("/admin/quote-requests")({
  component: AdminQuoteRequestsPage,
});

function AdminQuoteRequestsPage() {
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

        {/* Placeholder / Empty State */}
        <div className="rounded-3xl border border-border/50 bg-secondary/10 p-16 text-center">
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
      </div>
    </Reveal>
  );
}
