import { useMutation, useQueryClient } from "@tanstack/react-query";

import { moveTask } from "../api/tasks.api";

interface MoveTaskVariables {
  taskId: string;
  columnId: string;
  targetColumnId: string;
  position: number;
}

export function useMoveTask(organizationId: string, projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, columnId, targetColumnId, position }: MoveTaskVariables) =>
      moveTask(organizationId, projectId, columnId, taskId, {
        targetColumnId,
        position,
      }),

    onSuccess: async () => {
      /*
       * Refresh all task queries belonging
       * to this project.
       */
      await queryClient.invalidateQueries({
        queryKey: ["tasks", organizationId, projectId],
      });
    },
  });
}
