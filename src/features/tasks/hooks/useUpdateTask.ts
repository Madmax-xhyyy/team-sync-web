import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateTask } from "../api/tasks.api";
import type { UpdateTaskFormData } from "../schemas/task.schema";

export function useUpdateTask(organizationId: string, projectId: string, columnId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: UpdateTaskFormData }) =>
      updateTask(organizationId, projectId, columnId, taskId, data),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["tasks", organizationId, projectId, columnId],
      });
    },
  });
}
