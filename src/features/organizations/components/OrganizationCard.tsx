import { Link } from "react-router-dom";

import type { Organization } from "../types/organization.types";

interface OrganizationCardProps {
  organization: Organization;
}

export function OrganizationCard({ organization }: OrganizationCardProps) {
  return (
    <Link
      to={`/organizations/${organization.id}`}
      className="block rounded-xl border bg-card p-5 transition-colors hover:bg-muted/50"
    >
      <h2 className="font-semibold">{organization.name}</h2>

      {organization.description && (
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
          {organization.description}
        </p>
      )}
    </Link>
  );
}
