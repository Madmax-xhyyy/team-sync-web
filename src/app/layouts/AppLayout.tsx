import { Link, Outlet } from "react-router-dom";

import { AccountMenu } from "@/app/navigation/AccountMenu";
import { ThemeToggle } from "@/components/ThemeToggle";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="flex h-16 items-center justify-between gap-2 px-4 sm:px-6">
          <Link to="/dashboard" className="text-lg font-semibold">
            TeamSync
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <AccountMenu />
          </div>
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

        <main className="min-w-0 flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
