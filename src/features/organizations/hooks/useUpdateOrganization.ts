import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateOrganization, type UpdateOrganizationRequest } from "../api/organizations.api";

export function useUpdateOrganization(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateOrganizationRequest) => updateOrganization(organizationId, data),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["organization", organizationId],
      });

      await queryClient.invalidateQueries({
        queryKey: ["my-organizations"],
      });
    },
  });
}
