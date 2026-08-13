import { useMutation, useQueryClient } from "@tanstack/react-query";

import { assignTask } from "../api/tasks.api";

interface AssignTaskVariables {
  taskId: string;
  userId: string;
}

export function useAssignTask(organizationId: string, projectId: string, columnId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, userId }: AssignTaskVariables) =>
      assignTask(organizationId, projectId, columnId, taskId, userId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", organizationId, projectId, columnId],
      });
    },
  });
}
