import { useQuery } from "convex/react";
import { api } from "../../packages/backend/convex/_generated/api";

export function useCurrentUser() {
  const user = useQuery(api.users.getCurrentUser);
  
  return {
    user,
    isLoading: user === undefined,
    isAdmin: user?.role === "admin",
    isTeacher: user?.role === "teacher",
    isStudent: user?.role === "student",
  };
}

