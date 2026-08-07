import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useAuth, type UserRole } from "@/hooks/use-auth";

/**
 * Client-side route guard. Firebase auth state is only known in the
 * browser, so this checks it after mount rather than in `beforeLoad`.
 * While the initial check is in flight it shows a minimal loader instead
 * of flashing protected content.
 */
export function RequireRole({ role, children }: { role: UserRole; children: ReactNode }) {
  const { user, role: currentRole, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      console.log("[RequireRole] No user after loading resolved, redirecting to /login");
      navigate({ to: "/login" });
      return;
    }
    if (currentRole !== role) {
      console.log(
        `[RequireRole] Role mismatch (need "${role}", have "${currentRole}"), redirecting to /`,
      );
      navigate({ to: "/" });
    }
  }, [loading, user, currentRole, role, navigate]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (currentRole == null) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (currentRole !== role) {
    return null;
  }

  return <>{children}</>;
}
