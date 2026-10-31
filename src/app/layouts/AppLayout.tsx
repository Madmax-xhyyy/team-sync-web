import { Link, Outlet, useParams } from "react-router-dom";

import { AccountMenu } from "@/app/navigation/AccountMenu";
import { AppSidebar } from "@/app/navigation/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export function AppLayout() {
  const { organizationId } = useParams();
  const header = (
    <header className="border-b bg-background">
      <div className="flex h-16 items-center justify-between gap-2 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          {organizationId && <SidebarTrigger />}
          <Link
            to="/organizations"
            className="rounded-sm text-sm font-semibold focus-visible:outline-2 focus-visible:outline-ring"
          >
            TeamSync
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <AccountMenu />
        </div>
      </div>
    </header>
  );

  if (!organizationId) {
    return (
      <div className="min-h-screen bg-background">
        {header}
        <main className="mx-auto w-full max-w-7xl p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar key={organizationId} />
      <SidebarInset className="min-w-0">
        {header}
        <div className="min-w-0 flex-1 p-4 sm:p-6">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
