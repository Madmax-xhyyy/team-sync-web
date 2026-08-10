import type { OrganizationMember, OrganizationRole } from "../types/member.types";
export function getCurrentOrganizationMember(
  members: OrganizationMember[],
  currentUserId: string | undefined,
): OrganizationMember | undefined {
  if (!currentUserId) {
    return undefined;
  }
  return members.find((member) => member.userId === currentUserId);
}
export function canManageMembers(currentRole: OrganizationRole | undefined): boolean {
  return currentRole === "OWNER" || currentRole === "ADMIN";
}
export function canUpdateMemberRole(
  currentRole: OrganizationRole | undefined,
  targetRole: OrganizationRole,
): boolean {
  if (targetRole === "OWNER") {
    return false;
  }
  if (currentRole !== "OWNER" && currentRole !== "ADMIN") {
    return false;
  }
  if (currentRole === "ADMIN" && targetRole === "ADMIN") {
    return false;
  }
  return true;
}
export function canAssignRole(
  currentRole: OrganizationRole | undefined,
  targetRole: OrganizationRole,
  newRole: OrganizationRole,
): boolean {
  if (targetRole === "OWNER") {
    return false;
  }
  if (newRole === "OWNER") {
    return false;
  }
  if (currentRole !== "OWNER" && currentRole !== "ADMIN") {
    return false;
  }
  if (currentRole === "ADMIN" && targetRole === "ADMIN") {
    return false;
  }
  if (currentRole === "ADMIN" && newRole === "ADMIN") {
    return false;
  }
  if (currentRole === "OWNER") {
    return newRole === "MEMBER" || newRole === "ADMIN" || newRole === "GUEST";
  }
  if (currentRole === "ADMIN") {
    return newRole === "MEMBER" || newRole === "GUEST";
  }
  return false;
}
export function canRemoveMember(
  currentRole: OrganizationRole | undefined,
  targetRole: OrganizationRole,
  currentUserId: string | undefined,
  targetUserId: string,
): boolean {
  if (targetRole === "OWNER") {
    return false;
  }

  if (currentUserId && currentUserId === targetUserId) {
    return false;
  }

  if (currentRole === "OWNER") {
    return true;
  }

  if (currentRole === "ADMIN") {
    return targetRole !== "ADMIN";
  }

  return false;
}
