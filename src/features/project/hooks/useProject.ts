import { useQuery } from "@tanstack/react-query";

import { getProject } from "../api/projects.api";

export function useProject(organizationId: string, projectId: string) {
  return useQuery({
    queryKey: ["organization-project", organizationId, projectId],
    queryFn: () => getProject(organizationId, projectId),
    enabled: Boolean(organizationId) && Boolean(projectId),
  });
}
