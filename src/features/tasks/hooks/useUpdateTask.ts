import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateTask } from "../api/tasks.api";
import type { UpdateTaskFormData } from "../schemas/task.schema";
import type { Task } from "../types/task.types";

interface UpdateTaskVariables {
  taskId: string;
  data: UpdateTaskFormData;
}

interface UpdateTaskContext {
  previousTasks?: Task[];
  queryKey: readonly unknown[];
}

export function useUpdateTask(organizationId: string, projectId: string, columnId: string) {
  const queryClient = useQueryClient();

  const queryKey = ["board-tasks", organizationId, projectId, columnId];

  return useMutation({
    mutationFn: ({ taskId, data }: UpdateTaskVariables) =>
      updateTask(organizationId, projectId, columnId, taskId, data),

    /*
     * Optimistically update the task on the board.
     */
    onMutate: async ({ taskId, data }): Promise<UpdateTaskContext> => {
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

      const updatedTasks = previousTasks.map((task) => {
        if (task.id !== taskId) {
          return task;
        }

        return {
          ...task,
          title: data.title,
          description: data.description ?? "",
          priority: data.priority,
          type: data.type,
          dueDate: data.dueDate ?? null,
        };
      });

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
