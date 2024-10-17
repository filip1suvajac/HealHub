import { useRouter } from "next/navigation"; // Use client-side routing
import { useEffect } from "react";
import { useUser } from "../_lib/useUser";

export default function ProtectedRoute({ children }) {
  const { isLoading, isAuthenticated } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/"); // Redirect to login if not authenticated
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return <div>Loading...</div>; // Show loading state while user is being fetched
  }

  return <>{children}</>; // Render the children if authenticated
}
