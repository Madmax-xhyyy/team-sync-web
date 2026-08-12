import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createProject } from "../api/projects.api";
import type { CreateProjectRequest } from "../types/project.types";

export function useCreateProject(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectRequest) => createProject(organizationId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organization-projects", organizationId],
      });
    },
  });
}
