import { OrganizationMembers } from "../components/OrganizationMembers";
import { UsersRound } from "lucide-react";

export function TeamPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 py-4 sm:py-6">
      <div>
        <div className="mb-3 flex items-center gap-2 text-xs font-medium tracking-widest text-primary uppercase">
          <UsersRound className="size-4" aria-hidden="true" /> People & access
        </div>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Your team</h1>
        <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
          Find your teammates, add new members, and manage who has access to your workspace.
        </p>
      </div>
      <OrganizationMembers />
    </div>
  );
}
