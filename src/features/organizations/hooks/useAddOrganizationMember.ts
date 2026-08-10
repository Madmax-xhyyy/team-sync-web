import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addOrganizationMember } from "@/features/organizations/api/members.api";
import { OrganizationRole } from "../types/member.types";

export function useAddOrganizationMember(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { email: string; role: OrganizationRole }) =>
      addOrganizationMember(organizationId, data),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["organization-members", organizationId],
      });
    },
  });
}
