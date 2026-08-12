import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { deleteOrganization } from "../api/organizations.api";

export function useDeleteOrganization() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (organizationId: string) => deleteOrganization(organizationId),

    onSuccess: async (_, organizationId) => {
      queryClient.removeQueries({
        queryKey: ["organization", organizationId],
      });

      queryClient.removeQueries({
        queryKey: ["organization-members", organizationId],
      });

      queryClient.removeQueries({
        queryKey: ["organization-projects", organizationId],
      });

      await queryClient.invalidateQueries({
        queryKey: ["organizations"],
      });

      navigate("/organizations", {
        replace: true,
      });
    },
  });
}
