import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  useNavigate,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import { reportLovableError } from "../lib/lovable-error-reporting";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";
import { QuoteProvider } from "@/components/quote/QuoteProvider";
import { AuthProvider, useAuth } from "@/hooks/use-auth";

const CHROMELESS_PATHS = ["/login", "/register", "/forgot-password", "/admin"];

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function AuthRedirectGuard({ children }: { children: ReactNode }) {
  const { user, role, loading } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  useEffect(() => {
    // Wait until auth AND Firestore profile are both resolved.
    if (loading) return;

    if (user) {
      // role is guaranteed non-null when loading=false and user exists
      // (use-auth now waits for the Firestore read before clearing loading).
      if (role === "admin") {
        if (!pathname.startsWith("/admin")) {
          console.log("[AuthRedirectGuard] Redirecting admin to /admin");
          navigate({ to: "/admin", replace: true });
        }
      } else if (role === "user") {
        if (pathname.startsWith("/admin")) {
          console.log("[AuthRedirectGuard] Redirecting normal user to /");
          navigate({ to: "/", replace: true });
        }
      }
      // role === null here would mean Firestore doc missing entirely;
      // leave the user where they are rather than looping.
    } else {
      if (pathname.startsWith("/admin")) {
        console.log("[AuthRedirectGuard] Redirecting unauthenticated visitor to /login");
        navigate({ to: "/login", replace: true });
      }
    }
  }, [user, role, loading, pathname, navigate]);

  return <>{children}</>;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const chromeless = CHROMELESS_PATHS.includes(pathname) || pathname.startsWith("/admin");

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthRedirectGuard>
          <QuoteProvider>
            <SmoothScroll />
            {!chromeless && <Navbar />}
            <main>
              <Outlet />
            </main>
            {!chromeless && <Footer />}
          </QuoteProvider>
        </AuthRedirectGuard>
      </AuthProvider>
    </QueryClientProvider>
  );
}

