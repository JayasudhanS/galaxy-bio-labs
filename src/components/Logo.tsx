import { Link } from "@tanstack/react-router";
import logoMark from "@/assets/logo-mark.png";

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link to="/" className="group flex items-center gap-3" aria-label="Galaxy Bio Labs home">
      <span className="relative inline-flex size-10 items-center justify-center overflow-hidden rounded-full bg-background/90 ring-1 ring-foreground/10 transition-transform duration-500 group-hover:scale-105">
        <img src={logoMark} alt="" width={40} height={40} className="size-8 object-contain" />
      </span>
      <span className="leading-none">
        <span
          className={`block font-display text-[1.05rem] tracking-tight ${
            inverted ? "text-primary-foreground" : "text-foreground"
          }`}
        >
          Galaxy Bio Labs
        </span>
        <span
          className={`mt-1 block text-[0.58rem] uppercase tracking-[0.3em] ${
            inverted ? "text-primary-foreground/60" : "text-muted-foreground"
          }`}
        >
          Bio Science
        </span>
      </span>
    </Link>
  );
}
