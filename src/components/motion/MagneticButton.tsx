import { useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";

interface Props {
  children: ReactNode;
  onClick?: () => void;
  to?: string;
  params?: Record<string, string>;
  variant?: "solid" | "outline" | "light" | "invert";
  className?: string;
  type?: "button" | "submit";
}

const styles = {
  solid:
    "bg-primary text-primary-foreground hover:bg-[color-mix(in_oklab,var(--forest)_82%,var(--leaf))]",
  outline:
    "border border-foreground/25 text-foreground hover:border-primary hover:text-primary",
  light:
    "border border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground hover:text-primary",
  invert: "bg-[var(--mist)] text-[var(--forest-deep)] hover:opacity-90",
};

export function MagneticButton({
  children,
  onClick,
  to,
  params,
  variant = "solid",
  className = "",
  type = "button",
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setOffset({
      x: (e.clientX - (r.left + r.width / 2)) * 0.25,
      y: (e.clientY - (r.top + r.height / 2)) * 0.3,
    });
  };

  const base = `relative inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-[0.8rem] font-semibold uppercase tracking-[0.16em] transition-colors duration-500 ${styles[variant]} ${className}`;

  const inner = (
    <motion.span
      ref={ref}
      className={base}
      onMouseMove={handleMove}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
      animate={offset}
      transition={{ type: "spring", stiffness: 200, damping: 15, mass: 0.4 }}
    >
      {children}
    </motion.span>
  );

  if (to) {
    const AnyLink = Link as unknown as React.ComponentType<Record<string, unknown>>;
    return (
      <AnyLink to={to} {...(params ? { params } : {})} className="inline-block">
        {inner}
      </AnyLink>
    );
  }

  return (
    <button type={type} onClick={onClick} className="inline-block cursor-pointer">
      {inner}
    </button>
  );
}
