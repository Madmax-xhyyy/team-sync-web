import type { OrganizationMember, OrganizationRole } from "../types/member.types";

export function canUpdateMemberRole(
  currentUserRole: OrganizationRole,
  targetMember: OrganizationMember,
): boolean {
  if (targetMember.role === "OWNER") {
    return false;
  }

  if (currentUserRole === "OWNER") {
    return true;
  }

  if (currentUserRole === "ADMIN") {
    if (targetMember.role === "ADMIN") {
      return false;
    }

    return true;
  }

  return false;
}
