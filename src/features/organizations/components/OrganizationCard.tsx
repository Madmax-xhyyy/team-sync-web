import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

import type { Organization } from "../types/organization.types";

interface OrganizationCardProps {
  organization: Organization;
}

export function OrganizationCard({ organization }: OrganizationCardProps) {
  const initials = organization.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
  const created = new Date(organization.createdAt);
  const createdLabel = Number.isNaN(created.getTime())
    ? null
    : created.toLocaleDateString(undefined, { month: "short", year: "numeric" });

  return (
    <Link
      to={`/organizations/${organization.id}`}
      className="group flex h-full flex-col rounded-xl border bg-card p-6 outline-none transition-[border-color,box-shadow] hover:border-primary/40 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className="mb-5 flex items-start justify-between gap-3">
        <span
          aria-hidden="true"
          className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-primary/10 bg-primary/10 text-base font-semibold text-primary"
        >
          {initials || "O"}
        </span>
        <ArrowUpRight
          aria-hidden="true"
          className="size-4 text-muted-foreground transition-colors group-hover:text-primary"
        />
      </div>
      <h2 className="truncate text-base font-semibold" title={organization.name}>
        {organization.name}
      </h2>
      <p className="mt-2 mb-6 line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground">
        {organization.description?.trim() ||
          "A shared workspace for your team’s projects and collaboration."}
      </p>
      <div className="mt-auto flex items-center justify-between gap-3 border-t pt-4 text-xs">
        <span className="text-muted-foreground">
          {createdLabel ? `Created ${createdLabel}` : "Team workspace"}
        </span>
        <span className="font-medium text-primary">
          Open workspace <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  );
}
