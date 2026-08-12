import { useParams } from "react-router-dom";

import { OrganizationHeader } from "../components/OrganizationHeader";
import { OrganizationStats } from "../components/OrganizationStats";
import { useOrganization } from "@/features/organizations/hooks/useOrganization";
import { OrganizationMembers } from "../components/OrganizationMembers";
import { ProjectList } from "@/features/project/components/ProjectLists";

export function OrganizationDetailsPage() {
  const { organizationId = "" } = useParams();

  const { data: organization, isLoading, isError } = useOrganization(organizationId);

  if (isLoading) {
    return <div>Loading organization...</div>;
  }

  if (isError || !organization) {
    return <div>Organization not found.</div>;
  }

  return (
    <div>
      <OrganizationHeader organization={organization} />

      <OrganizationStats />

      <ProjectList />

      <OrganizationMembers />

      <div className="mt-8 rounded-xl border p-6">
        <h2 className="font-semibold">Recent Activity</h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Activity timeline will be added in the next phase.
        </p>
      </div>
    </div>
  );
}
