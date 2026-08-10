import { useQuery } from "@tanstack/react-query";

import { getMyOrganizations } from "../api/organizations.api";
import { CreateOrganizationDialog } from "../components/CreateOrganizationDialog";
import { OrganizationList } from "../components/OrganizationList";

export function OrganizationsPage() {
  const {
    data: organizations = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["organizations", "my"],
    queryFn: getMyOrganizations,
  });

  if (isLoading) {
    return <div>Loading organizations...</div>;
  }

  if (isError) {
    return <div>Failed to load organizations.</div>;
  }

  return (
    <div>
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Organizations</h1>

          <p className="mt-1 text-sm text-muted-foreground">Manage your organizations and teams.</p>
        </div>

        <CreateOrganizationDialog />
      </div>

      <OrganizationList organizations={organizations} />
    </div>
  );
}
