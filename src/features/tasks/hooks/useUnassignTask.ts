import { useMutation, useQueryClient } from "@tanstack/react-query";

import { unassignTask } from "../api/tasks.api";

export function useUnassignTask(organizationId: string, projectId: string, columnId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => unassignTask(organizationId, projectId, columnId, taskId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", organizationId, projectId, columnId],
      });
    },
  });
}
