import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown, Layers } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar-context";
import { getMyOrganizations } from "@/features/organizations/api/organizations.api";
import { useOrganization } from "@/features/organizations/hooks/useOrganization";

export function OrganizationSwitcher() {
  const { organizationId = "" } = useParams();
  const { setOpenMobile } = useSidebar();
  const { data: organization } = useOrganization(organizationId);
  const {
    data: organizations = [],
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["organizations", "my"],
    queryFn: getMyOrganizations,
  });
  const currentName =
    organization?.name ??
    organizations.find((item) => item.id === organizationId)?.name ??
    "Organization";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Switch organization, current: ${currentName}`}
        className="flex w-full min-w-0 cursor-pointer items-center gap-3 rounded-md p-1 text-left outline-none hover:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-sidebar-ring data-popup-open:bg-sidebar-accent"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Layers className="size-5" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold tracking-tight" title={currentName}>
            {currentName}
          </span>
          <span className="block text-xs text-muted-foreground">Switch organization</span>
        </span>
        <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" sideOffset={8} className="min-w-56 p-1.5">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Switch organization</DropdownMenuLabel>
          {organizations.map((item) => (
            <DropdownMenuItem
              key={item.id}
              render={<Link to={`/organizations/${item.id}`} />}
              aria-current={item.id === organizationId ? "true" : undefined}
              onClick={() => setOpenMobile(false)}
              className="cursor-pointer gap-3 px-2 py-2.5"
            >
              <span className="min-w-0 flex-1 truncate" title={item.name}>
                {item.name}
              </span>
              {item.id === organizationId && (
                <Check className="size-4 text-primary" aria-label="Current organization" />
              )}
            </DropdownMenuItem>
          ))}
          {isPending && <DropdownMenuItem disabled>Loading organizations…</DropdownMenuItem>}
          {isError && (
            <DropdownMenuItem onClick={() => void refetch()} className="cursor-pointer">
              Couldn’t load organizations. Try again
            </DropdownMenuItem>
          )}
          {!isPending && !isError && organizations.length === 0 && (
            <DropdownMenuItem disabled>No organizations available</DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
