import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createTask } from "../api/tasks.api";
import type { CreateTaskFormData } from "../schemas/task.schema";

export function useCreateTask(organizationId: string, projectId: string, columnId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskFormData) => createTask(organizationId, projectId, columnId, data),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["board-tasks", organizationId, projectId, columnId],
      });
    },
  });
}
