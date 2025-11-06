import { userAtom, clerkAuthAtom } from "@/lib/store/auth-atoms";
import { api } from "@workspace/backend/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

/**
 * Hook that synchronizes Convex user data with Jotai atoms.
 * This hook runs once when the component mounts and updates atoms when data changes.
 */
export function useAuthSync(): {
  user: ReturnType<typeof useQuery<typeof api.users.getCurrentUser>>;
} {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const user = useQuery(api.users.getCurrentUser);
  const syncUser = useMutation(api.users.syncCurrentUser);
  const [, setUser] = useAtom(userAtom);
  const [, setClerkAuth] = useAtom(clerkAuthAtom);

  // Update Clerk auth state
  useEffect(() => {
    setClerkAuth({
      isLoaded,
      isSignedIn: isSignedIn ?? false,
    });
  }, [isLoaded, isSignedIn, setClerkAuth]);

  // Sync user to Convex if authenticated but not in database
  useEffect(() => {
    if (isLoaded && isSignedIn && userId && user === null) {
      syncUser().catch((error) => {
        console.error("Error syncing user to Convex:", error);
      });
    }
  }, [isLoaded, isSignedIn, userId, user, syncUser]);

  // Update user data
  useEffect(() => {
    if (user !== undefined) {
      setUser(user);
    }
  }, [user, setUser]);

  return {
    user,
  };
}
