import { useEffect, useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, User2, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { MODULES } from "@/data/site";
import { useQuote } from "@/components/quote/QuoteProvider";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/products", label: "Products", dropdown: true },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [drop, setDrop] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { open } = useQuote();
  const { user, profile, role, signOut } = useAuth();
  const navigate = useNavigate();
  const solid = scrolled || menu || pathname !== "/";
  const isAdmin = role === "admin";

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenu(false);
    setDrop(false);
  }, [pathname]);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className={`fixed inset-x-0 top-0 z-90 transition-all duration-700 ${
        solid ? "glass-panel border-b" : "border-b border-transparent"
      }`}
    >
      <nav className="gbl-container flex h-20 items-center justify-between">
        <div className={solid ? "" : "[&_span]:text-primary-foreground"}>
          <Logo inverted={!solid} />
        </div>

        <div className="hidden items-center gap-9 lg:flex">
          {LINKS.map((link) =>
            link.dropdown ? (
              <div
                key={link.to}
                className="relative"
                onMouseEnter={() => setDrop(true)}
                onMouseLeave={() => setDrop(false)}
              >
                <Link
                  to={link.to}
                  className={`nav-underline flex items-center gap-1 text-[0.78rem] font-medium uppercase tracking-[0.16em] transition-colors ${
                    solid ? "text-foreground/80 hover:text-primary" : "text-primary-foreground/85 hover:text-primary-foreground"
                  }`}
                >
                  {link.label}
                  <ChevronDown className={`size-3.5 transition-transform duration-500 ${drop ? "rotate-180" : ""}`} />
                </Link>
                <AnimatePresence>
                  {drop && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute left-1/2 top-full w-72 -translate-x-1/2 pt-5"
                    >
                      <div className="overflow-hidden rounded-2xl border border-border/70 bg-popover p-2 shadow-[var(--shadow-lift)]">
                        {MODULES.map((m) => (
                          <Link
                            key={m.slug}
                            to="/products/$category"
                            params={{ category: m.slug }}
                            className="group flex items-baseline gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-secondary"
                          >
                            <span className="font-display text-[0.7rem] text-accent">{m.index}</span>
                            <span className="text-sm font-medium text-foreground group-hover:text-primary">
                              {m.name}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                key={link.to}
                to={link.to}
                activeOptions={{ exact: link.to === "/" }}
                className={`nav-underline text-[0.78rem] font-medium uppercase tracking-[0.16em] transition-colors ${
                  solid ? "text-foreground/80 hover:text-primary" : "text-primary-foreground/85 hover:text-primary-foreground"
                }`}
              >
                {link.label}
              </Link>
            ),
          )}
        </div>

        <div className="hidden items-center gap-6 lg:flex">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                className={`nav-underline flex items-center gap-2 text-[0.78rem] font-medium uppercase tracking-[0.16em] outline-none ${
                  solid ? "text-foreground/80 hover:text-primary" : "text-primary-foreground/85 hover:text-primary-foreground"
                }`}
              >
                <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <User2 className="size-3.5" />
                </span>
                {isAdmin ? "Admin" : (profile?.name?.split(" ")[0] ?? "Profile")}
                <ChevronDown className="size-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="truncate">
                  {profile?.name ?? user.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isAdmin ? (
                  <DropdownMenuItem asChild>
                    <Link to="/admin">Admin panel</Link>
                  </DropdownMenuItem>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard">My Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" search={{ tab: "quotes" }}>
                        My Quote Requests
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" search={{ tab: "settings" }}>
                        Settings
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={handleSignOut}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              to="/login"
              className={`nav-underline text-[0.78rem] font-medium uppercase tracking-[0.16em] ${
                solid ? "text-foreground/70 hover:text-primary" : "text-primary-foreground/80"
              }`}
            >
              Login
            </Link>
          )}
          <button
            onClick={() => open()}
            className={`rounded-full px-6 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.16em] transition-all duration-500 ${
              solid
                ? "bg-primary text-primary-foreground hover:opacity-90"
                : "border border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            }`}
          >
            Get quote
          </button>
        </div>

        <button
          onClick={() => setMenu((v) => !v)}
          aria-label="Toggle menu"
          className={`lg:hidden ${solid ? "text-foreground" : "text-primary-foreground"}`}
        >
          {menu ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </nav>

      <AnimatePresence>
        {menu && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-border/60 bg-background lg:hidden"
          >
            <div className="gbl-container flex flex-col gap-1 py-6">
              {LINKS.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * i, duration: 0.5 }}
                >
                  <Link to={l.to} className="block py-3 font-display text-2xl text-foreground">
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <div className="mt-2 grid grid-cols-2 gap-2 border-t border-border/60 pt-5">
                {MODULES.map((m) => (
                  <Link
                    key={m.slug}
                    to="/products/$category"
                    params={{ category: m.slug }}
                    className="rounded-xl bg-secondary px-4 py-3 text-xs font-medium tracking-wide text-secondary-foreground"
                  >
                    {m.name}
                  </Link>
                ))}
              </div>
              <div className="mt-5 flex items-center gap-4">
                <button
                  onClick={() => open()}
                  className="flex-1 rounded-full bg-primary px-6 py-4 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-primary-foreground"
                >
                  Get quote
                </button>
                {user ? (
                  <Link
                    to={isAdmin ? "/admin" : "/dashboard"}
                    className="rounded-full border border-border px-6 py-4 text-[0.72rem] font-semibold uppercase tracking-[0.18em]"
                  >
                    {isAdmin ? "Admin" : "Profile"}
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="rounded-full border border-border px-6 py-4 text-[0.72rem] font-semibold uppercase tracking-[0.18em]"
                  >
                    Login
                  </Link>
                )}
              </div>
              {user && (
                <button
                  onClick={handleSignOut}
                  className="mt-3 w-full rounded-full px-6 py-3 text-center text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
                >
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
