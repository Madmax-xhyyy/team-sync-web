import { useQuery } from "@tanstack/react-query";

import { getOrganizationById } from "@/features/organizations/api/organizations.api";

export function useOrganization(organizationId: string) {
  return useQuery({
    queryKey: ["organization", organizationId],
    queryFn: () => getOrganizationById(organizationId),
    enabled: !!organizationId,
  });
}
