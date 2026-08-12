import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { UpdateProjectRequest } from "../types/project.types";
import { updateProject } from "../api/projects.api";

export function useUpdateProject(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: UpdateProjectRequest }) =>
      updateProject(organizationId, projectId, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["organization-projects", organizationId],
      });

      queryClient.invalidateQueries({
        queryKey: ["organization-project", organizationId, variables.projectId],
      });
    },
  });
}
