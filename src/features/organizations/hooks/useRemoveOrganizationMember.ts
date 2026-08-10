import { useMutation, useQueryClient } from "@tanstack/react-query";

import { removeOrganizationMember } from "@/features/organizations/api/members.api";

export function useRemoveOrganizationMember(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberId: string) => removeOrganizationMember(organizationId, memberId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["organization-members", organizationId],
      });
    },
  });
}
