import { useQuery } from "@tanstack/react-query";

import { getOrganizationMembers } from "@/features/organizations/api/members.api";

export function useOrganizationMembers(organizationId: string) {
  return useQuery({
    queryKey: ["organization-members", organizationId],
    queryFn: () => getOrganizationMembers(organizationId),
    enabled: Boolean(organizationId),
  });
}
