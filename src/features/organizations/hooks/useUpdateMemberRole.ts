import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateOrganizationMemberRole } from "@/features/organizations/api/members.api";

import type { OrganizationRole } from "@/features/organizations/types/member.types";

export function useUpdateMemberRole(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ memberId, role }: { memberId: string; role: OrganizationRole }) =>
      updateOrganizationMemberRole(organizationId, memberId, role),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organization-members", organizationId],
      });
    },
  });
}
