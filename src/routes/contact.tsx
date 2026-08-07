import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, Loader2, Mail, MapPin, Phone, Clock } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { COMPANY } from "@/data/site";

const title = "Contact Galaxy Bio Labs";
const description =
  "Reach the Galaxy Bio Labs team for product enquiries, distribution partnerships and technical support.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState("sending");
    window.setTimeout(() => setState("done"), 900);
  };

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Let's talk about your field, pond or shelf"
        copy="Send a note and the right person from our team will reply, usually within one working day."
      />

      <section className="gbl-container grid gap-16 py-20 lg:grid-cols-[1fr_1.1fr] lg:gap-24 md:py-28">
        <div>
          <dl className="space-y-8">
            {[
              { icon: MapPin, label: "Visit", value: COMPANY.address },
              { icon: Phone, label: "Call", value: COMPANY.phone },
              { icon: Mail, label: "Write", value: COMPANY.email },
              { icon: Clock, label: "Hours", value: COMPANY.hours },
            ].map((row, i) => (
              <Reveal key={row.label} delay={i * 0.07}>
                <div className="flex items-start gap-5 border-t border-border pt-6">
                  <row.icon className="mt-1 size-4 shrink-0 text-primary" />
                  <div>
                    <dt className="text-[0.62rem] uppercase tracking-[0.22em] text-muted-foreground">
                      {row.label}
                    </dt>
                    <dd className="mt-2 font-display text-xl">{row.value}</dd>
                  </div>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>

        <Reveal delay={0.12}>
          <div className="rounded-[2rem] bg-secondary p-8 md:p-10">
            {state === "done" ? (
              <div className="py-20 text-center">
                <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-background text-primary">
                  <Check className="size-6" />
                </span>
                <h2 className="mt-5 font-display text-2xl">Message sent</h2>
                <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">
                  Thank you — we will be in touch shortly. (Demo mode until the backend is connected.)
                </p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-5">
                <h2 className="font-display text-2xl">Send a message</h2>
                <div className="grid gap-5 sm:grid-cols-2">
                  {[
                    { name: "name", label: "Full name", type: "text" },
                    { name: "phone", label: "Phone", type: "tel" },
                    { name: "email", label: "Email", type: "email" },
                    { name: "location", label: "Location", type: "text" },
                  ].map((f) => (
                    <label key={f.name} className="block">
                      <span className="mb-1.5 block text-[0.66rem] uppercase tracking-[0.18em] text-muted-foreground">
                        {f.label}
                      </span>
                      <input
                        name={f.name}
                        type={f.type}
                        required
                        maxLength={120}
                        className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                      />
                    </label>
                  ))}
                </div>
                <label className="block">
                  <span className="mb-1.5 block text-[0.66rem] uppercase tracking-[0.18em] text-muted-foreground">
                    Message
                  </span>
                  <textarea
                    name="message"
                    rows={4}
                    maxLength={1000}
                    className="w-full resize-none rounded-xl border border-input bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                  />
                </label>
                <button
                  type="submit"
                  disabled={state === "sending"}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-70"
                >
                  {state === "sending" && <Loader2 className="size-4 animate-spin" />}
                  Send message
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </section>
    </>
  );
}
