import { useQuery } from "@tanstack/react-query";

import { getProjects } from "../api/projects.api";

export function useProjects(organizationId: string) {
  return useQuery({
    queryKey: ["organization-projects", organizationId],
    queryFn: () => getProjects(organizationId),
    enabled: Boolean(organizationId),
  });
}
