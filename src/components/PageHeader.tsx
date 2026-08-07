import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";

export function PageHeader({
  eyebrow,
  title,
  copy,
  children,
}: {
  eyebrow: string;
  title: string;
  copy?: string;
  children?: ReactNode;
}) {
  return (
    <header className="relative overflow-hidden bg-secondary pb-16 pt-36 md:pb-24 md:pt-44">
      <div
        aria-hidden
        className="floaty pointer-events-none absolute -right-24 -top-16 size-80 rounded-full opacity-[0.07]"
        style={{ background: "var(--gradient-forest)" }}
      />
      <div className="gbl-container relative">
        <Reveal>
          <p className="eyebrow">{eyebrow}</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="mt-5 max-w-3xl font-display text-4xl leading-[1.05] text-balance-tight md:text-6xl">
            {title}
          </h1>
        </Reveal>
        {copy && (
          <Reveal delay={0.16}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">{copy}</p>
          </Reveal>
        )}
        {children}
      </div>
    </header>
  );
}
