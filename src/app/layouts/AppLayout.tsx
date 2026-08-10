import { Link, Outlet } from "react-router-dom";

import { logout } from "@/features/auth/api/auth.api";
import { useAuthStore } from "@/stores/auth.store";

export function AppLayout() {
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      clearAuth();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="flex h-16 items-center justify-between px-6">
          <Link to="/dashboard" className="text-lg font-semibold">
            TeamSync
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md border px-3 py-2 text-sm"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="flex">
        <aside className="hidden w-64 border-r md:block">
          <nav className="space-y-1 p-4">
            <Link to="/dashboard" className="block rounded-md px-3 py-2 hover:bg-muted">
              Dashboard
            </Link>

            <Link to="/organizations" className="block rounded-md px-3 py-2 hover:bg-muted">
              Organizations
            </Link>

            <Link to="/projects" className="block rounded-md px-3 py-2 hover:bg-muted">
              Projects
            </Link>

            <Link to="/tasks" className="block rounded-md px-3 py-2 hover:bg-muted">
              Tasks
            </Link>
          </nav>
        </aside>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
