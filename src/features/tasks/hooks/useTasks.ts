import { useQuery } from "@tanstack/react-query";

import { getTasks } from "../api/tasks.api";
import type { Task } from "../types/task.types";

export function useTasks(organizationId: string, projectId: string, columnId: string) {
  return useQuery<Task[]>({
    queryKey: ["tasks", organizationId, projectId, columnId],

    queryFn: () => getTasks(organizationId, projectId, columnId),

    enabled: Boolean(organizationId) && Boolean(projectId) && Boolean(columnId),
  });
}
