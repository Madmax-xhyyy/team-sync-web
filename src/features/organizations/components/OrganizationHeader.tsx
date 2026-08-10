import type { Organization } from "../types/organization.types";

interface Props {
  organization: Organization;
}

export function OrganizationHeader({ organization }: Props) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-semibold">{organization.name}</h1>

      <p className="mt-2 max-w-2xl text-muted-foreground">
        {organization.description || "No description yet."}
      </p>
    </div>
  );
}
