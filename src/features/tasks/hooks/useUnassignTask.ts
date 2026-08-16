import { useMutation, useQueryClient } from "@tanstack/react-query";

import { unassignTask } from "../api/tasks.api";

import type { Task } from "../types/task.types";

interface UnassignTaskContext {
  previousTasks?: Task[];
  queryKey: readonly unknown[];
}

export function useUnassignTask(organizationId: string, projectId: string, columnId: string) {
  const queryClient = useQueryClient();

  const queryKey = ["board-tasks", organizationId, projectId, columnId];

  return useMutation({
    mutationFn: (taskId: string) => unassignTask(organizationId, projectId, columnId, taskId),

    /*
     * Optimistic update
     */
    onMutate: async (taskId): Promise<UnassignTaskContext> => {
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
              assigneeId: null,
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
     * Rollback
     */
    onError: (_error, _taskId, context) => {
      if (!context?.previousTasks) {
        return;
      }

      queryClient.setQueryData<Task[]>(context.queryKey, context.previousTasks);
    },

    /*
     * Sync with backend
     */
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey,
      });
    },
  });
}
