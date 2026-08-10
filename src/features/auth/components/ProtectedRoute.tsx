import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuthStore } from "@/stores/auth.store";

export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const isInitializing = useAuthStore((state) => state.isInitializing);

  const location = useLocation();

  console.log("ProtectedRoute:", {
    isAuthenticated,
    isInitializing,
  });

  if (isInitializing) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
