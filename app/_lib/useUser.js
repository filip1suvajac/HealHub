// app/_hooks/useUser.js (or .ts)
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../_lib/apiAuth"; // Your Supabase auth API

export function useUser() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  return {
    isLoading,
    user,
    isAuthenticated: !!user, // Boolean check for authentication
  };
}
