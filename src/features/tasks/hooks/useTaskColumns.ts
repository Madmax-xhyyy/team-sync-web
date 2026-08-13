import { useQuery } from "@tanstack/react-query";

import { getTaskColumns } from "../api/task-columns.api";

export function useTaskColumns(organizationId: string, projectId: string) {
  return useQuery({
    queryKey: ["project-task-columns", organizationId, projectId],
    queryFn: () => getTaskColumns(organizationId, projectId),
    enabled: Boolean(organizationId) && Boolean(projectId),
  });
}
