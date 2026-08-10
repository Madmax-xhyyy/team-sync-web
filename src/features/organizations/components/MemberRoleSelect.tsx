import type { OrganizationMember, OrganizationRole } from "../types/member.types";
import { useUpdateMemberRole } from "@/features/organizations/hooks/useUpdateMemberRole";

interface MemberRoleSelectProps {
  organizationId: string;
  member: OrganizationMember;
}

export function MemberRoleSelect({ organizationId, member }: MemberRoleSelectProps) {
  const updateRoleMutation = useUpdateMemberRole(organizationId);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const role = event.target.value as OrganizationRole;

    if (role === member.role) {
      return;
    }

    updateRoleMutation.mutate({
      memberId: member.id,
      role,
    });
  };

  return (
    <select
      value={member.role}
      onChange={handleChange}
      disabled={updateRoleMutation.isPending}
      className="rounded-md border bg-background px-2.5 py-1.5 text-sm disabled:opacity-50"
      aria-label={`Change role for ${member.firstName} ${member.lastName}`}
    >
      <option value="MEMBER">Member</option>
      <option value="ADMIN">Admin</option>
      <option value="GUEST">Guest</option>
    </select>
  );
}
