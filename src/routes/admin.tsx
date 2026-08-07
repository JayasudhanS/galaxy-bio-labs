import { useState } from "react";
import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  MessageSquareText,
  Users,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { RequireRole } from "@/components/auth/RequireRole";
import { useAuth } from "@/hooks/use-auth";

const title = "Admin — Galaxy Bio Labs";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title }, { name: "robots", content: "noindex" }],
  }),
  component: AdminPage,
});

function AdminPage() {
  return (
    <RequireRole role="admin">
      <AdminLayout />
    </RequireRole>
  );
}

const SIDEBAR_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/add-product", label: "Add Product", icon: PlusCircle },
  { to: "/admin/quote-requests", label: "Quote Requests", icon: MessageSquareText },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/settings", label: "Settings", icon: SettingsIcon },
];

function AdminLayout() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/login" });
  };

  const sidebarContent = (isMobile: boolean) => (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      {/* Sidebar Header */}
      <div className={`flex items-center justify-between border-b border-sidebar-border px-6 py-5 ${collapsed && !isMobile ? "justify-center" : ""}`}>
        {(!collapsed || isMobile) ? (
          <div>
            <p className="eyebrow text-accent">Galaxy Bio Labs</p>
            <p className="mt-0.5 font-display text-lg text-sidebar-foreground/90">Admin Portal</p>
          </div>
        ) : (
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/20 text-accent font-display font-semibold text-lg">
            G
          </div>
        )}
        {isMobile && (
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-full p-1.5 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            aria-label="Close menu"
          >
            <X className="size-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5 px-4 py-6">
        {SIDEBAR_ITEMS.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeOptions={item.exact ? { exact: true } : {}}
            onClick={() => isMobile && setMobileOpen(false)}
            activeProps={{
              className: "bg-primary text-primary-foreground!",
            }}
            className={`flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium text-sidebar-foreground/75 transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-foreground ${
              collapsed && !isMobile ? "justify-center px-2" : ""
            }`}
            title={collapsed && !isMobile ? item.label : undefined}
          >
            <item.icon className="size-4.5 shrink-0" />
            {(!collapsed || isMobile) && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div className="border-t border-sidebar-border p-4">
        <button
          onClick={handleSignOut}
          className={`flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-left text-sm font-medium text-sidebar-foreground/60 transition-colors hover:bg-destructive/15 hover:text-destructive-foreground ${
            collapsed && !isMobile ? "justify-center px-2" : ""
          }`}
          title={collapsed && !isMobile ? "Logout" : undefined}
        >
          <LogOut className="size-4.5 shrink-0" />
          {(!collapsed || isMobile) && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar (Collapsible) */}
      <aside
        className={`hidden border-r border-border/50 bg-sidebar transition-all duration-300 ease-in-out lg:block ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="sticky top-0 flex h-screen flex-col justify-between">
          <div className="flex-1 overflow-y-auto">
            {sidebarContent(false)}
          </div>
          
          {/* Collapse Toggle Button */}
          <div className="flex justify-end p-4 border-t border-sidebar-border/30 bg-sidebar/50">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="flex size-8 items-center justify-center rounded-lg border border-sidebar-border/35 text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer Navigation (using AnimatePresence) */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-100 lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="absolute bottom-0 left-0 top-0 w-72 shadow-2xl"
            >
              {sidebarContent(true)}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="flex h-16 items-center justify-between border-b border-border/50 bg-background px-6 lg:hidden">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-1.5 text-foreground/80 hover:bg-secondary"
              aria-label="Open navigation menu"
            >
              <Menu className="size-6" />
            </button>
            <span className="font-display text-lg font-medium text-foreground">GBL Admin</span>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="size-3.5" />
            Logout
          </button>
        </header>

        {/* Content Wrapper */}
        <main className="flex-1 overflow-y-auto px-6 py-8 lg:px-10 lg:py-12">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
