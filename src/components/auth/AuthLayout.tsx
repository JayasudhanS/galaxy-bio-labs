import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/motion/Reveal";
import logoMark from "@/assets/Galaxy_logo.jpeg";
import { heroLab } from "@/data/site";

export function AuthLayout({
  eyebrow,
  panelText,
  children,
}: {
  eyebrow: string;
  panelText: string;
  children: ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <img src={heroLab} alt="" className="absolute inset-0 size-full object-cover" />
        <div aria-hidden className="hero-veil absolute inset-0" />
        <div className="relative flex h-full flex-col justify-end p-14 text-primary-foreground">
          <p className="eyebrow text-accent">{eyebrow}</p>
          <p className="mt-5 max-w-sm font-display text-3xl leading-snug">{panelText}</p>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-24">
        <div className="w-full max-w-sm">
          <Reveal>
            <Link to="/" aria-label="Galaxy Bio Labs home">
              <img src={logoMark} alt="" width={48} height={48} className="size-12" />
            </Link>
          </Reveal>
          {children}
        </div>
      </div>
    </div>
  );
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <span className="mb-1.5 block text-[0.66rem] uppercase tracking-[0.18em] text-muted-foreground">
      {children}
    </span>
  );
}

export const authInputClass =
  "w-full rounded-xl border border-input bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-primary disabled:opacity-60";

export const authButtonClass =
  "flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60";
