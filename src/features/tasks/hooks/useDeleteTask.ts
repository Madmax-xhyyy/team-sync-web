import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteTask } from "../api/tasks.api";

export function useDeleteTask(organizationId: string, projectId: string, columnId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => deleteTask(organizationId, projectId, columnId, taskId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", organizationId, projectId, columnId],
      });
    },
  });
}
