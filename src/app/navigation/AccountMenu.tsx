import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, Settings, UserRound } from "lucide-react";
import { Link } from "react-router-dom";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/features/auth/api/auth.api";
import { useCurrentUser } from "@/features/user/hooks/useCurrentUser";
import { useAuthStore } from "@/stores/auth.store";

export function AccountMenu() {
  const { data } = useCurrentUser();
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const user = data?.success ? data.data : undefined;
  const initials = user
    ? `${user.firstName.trim().charAt(0)}${user.lastName.trim().charAt(0)}`.toUpperCase()
    : "";

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      queryClient.clear();
      clearAuth();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Account menu"
        disabled={isLoggingOut}
        className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-semibold ring-1 ring-border transition-colors outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring data-popup-open:ring-2 data-popup-open:ring-ring disabled:cursor-wait disabled:opacity-50"
      >
        <span aria-hidden="true">{initials || <UserRound className="size-4" />}</span>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={10} className="w-52 p-1.5">
        <DropdownMenuItem
          render={<Link to="/profile" />}
          className="cursor-pointer gap-2 px-3 py-2"
        >
          <Settings aria-hidden="true" />
          Account settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={isLoggingOut}
          onClick={() => void handleLogout()}
          className="cursor-pointer gap-2 px-3 py-2"
        >
          <LogOut aria-hidden="true" />
          {isLoggingOut ? "Logging out..." : "Log out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
