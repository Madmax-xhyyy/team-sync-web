import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteTask } from "../api/tasks.api";

import type { Task } from "../types/task.types";

interface DeleteTaskContext {
  previousTasks?: Task[];
  queryKey: readonly unknown[];
}

export function useDeleteTask(organizationId: string, projectId: string, columnId: string) {
  const queryClient = useQueryClient();

  const queryKey = ["board-tasks", organizationId, projectId, columnId];

  return useMutation({
    /*
     * --------------------------------------------------
     * API REQUEST
     * --------------------------------------------------
     */
    mutationFn: (taskId: string) => deleteTask(organizationId, projectId, columnId, taskId),

    /*
     * --------------------------------------------------
     * OPTIMISTIC DELETE
     * --------------------------------------------------
     *
     * Remove the task from the board immediately.
     */
    onMutate: async (taskId): Promise<DeleteTaskContext> => {
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

      const updatedTasks = previousTasks
        .filter((task) => task.id !== taskId)
        .map((task, index) => ({
          ...task,
          position: index,
        }));

      queryClient.setQueryData<Task[]>(queryKey, updatedTasks);

      return {
        previousTasks,
        queryKey,
      };
    },

    /*
     * --------------------------------------------------
     * ROLLBACK
     * --------------------------------------------------
     *
     * If deletion fails, restore the task.
     */
    onError: (_error, _taskId, context) => {
      if (!context?.previousTasks) {
        return;
      }

      queryClient.setQueryData<Task[]>(context.queryKey, context.previousTasks);
    },

    /*
     * --------------------------------------------------
     * RE-SYNC WITH BACKEND
     * --------------------------------------------------
     */
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey,
      });
    },
  });
}
