import { useMutation, useQueryClient } from "@tanstack/react-query";

import { assignTask } from "../api/tasks.api";

import type { Task } from "../types/task.types";

interface AssignTaskVariables {
  taskId: string;
  userId: string;
}

interface AssignTaskContext {
  previousTasks?: Task[];
  queryKey: readonly unknown[];
}

export function useAssignTask(organizationId: string, projectId: string, columnId: string) {
  const queryClient = useQueryClient();

  const queryKey = ["board-tasks", organizationId, projectId, columnId];

  return useMutation({
    mutationFn: ({ taskId, userId }: AssignTaskVariables) =>
      assignTask(organizationId, projectId, columnId, taskId, userId),

    /*
     * Optimistically update the task card.
     */
    onMutate: async ({ taskId, userId }): Promise<AssignTaskContext> => {
      await queryClient.cancelQueries({
        queryKey,
      });

      const previousTasks = queryClient.getQueryData<Task[]>(queryKey);

      if (!previousTasks) {
        return {
          previousTasks,
          queryKey,
        };
      }

      const updatedTasks = previousTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              assigneeId: userId,
            }
          : task,
      );

      queryClient.setQueryData<Task[]>(queryKey, updatedTasks);

      return {
        previousTasks,
        queryKey,
      };
    },

    /*
     * Roll back if the API request fails.
     */
    onError: (_error, _variables, context) => {
      if (!context?.previousTasks) {
        return;
      }

      queryClient.setQueryData<Task[]>(context.queryKey, context.previousTasks);
    },

    /*
     * Always synchronize with the backend.
     */
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey,
      });
    },
  });
}
