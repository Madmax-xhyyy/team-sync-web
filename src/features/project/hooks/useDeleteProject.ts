import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteProject } from "../api/projects.api";

export function useDeleteProject(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => deleteProject(organizationId, projectId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organization-projects", organizationId],
      });
    },
  });
}
