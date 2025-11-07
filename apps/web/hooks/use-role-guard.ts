import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useCurrentUser } from "./use-current-user";

type Role = "admin" | "teacher" | "student";

interface UseRoleGuardOptions {
  allowedRoles: Role[];
  redirectTo?: string;
}

/**
 * Hook that guards routes based on user role.
 * Redirects to /dashboard if user doesn't have the required role.
 */
export function useRoleGuard({
  allowedRoles,
  redirectTo = "/dashboard",
}: UseRoleGuardOptions) {
  const { user, isLoading } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // User not loaded yet, wait
        return;
      }

      if (!allowedRoles.includes(user.role as Role)) {
        // User doesn't have the required role, redirect
        router.replace(redirectTo);
      }
    }
  }, [user, isLoading, allowedRoles, redirectTo, router]);

  // Return loading state and whether access is allowed
  if (isLoading || !user) {
    return { isLoading: true, hasAccess: false };
  }

  const hasAccess = allowedRoles.includes(user.role as Role);

  return { isLoading: false, hasAccess };
}
