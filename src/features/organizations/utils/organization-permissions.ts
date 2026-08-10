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
  // The owner can never be modified.
  if (targetRole === "OWNER") {
    return false;
  }

  // Only OWNER and ADMIN can manage roles.
  if (currentRole !== "OWNER" && currentRole !== "ADMIN") {
    return false;
  }

  // ADMIN cannot modify another ADMIN.
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
  // Nobody can modify the owner.
  if (targetRole === "OWNER") {
    return false;
  }

  // OWNER can assign any role.
  if (currentRole === "OWNER") {
    return true;
  }

  // ADMIN cannot assign ADMIN.
  if (currentRole === "ADMIN" && newRole === "ADMIN") {
    return false;
  }

  // ADMIN can manage MEMBER/GUEST.
  if (currentRole === "ADMIN") {
    return true;
  }

  return false;
}

export function canRemoveMember(
  currentRole: OrganizationRole | undefined,
  targetRole: OrganizationRole,
  currentUserId: string | undefined,
  targetUserId: string,
): boolean {
  // The owner cannot be removed.
  if (targetRole === "OWNER") {
    return false;
  }

  // Users cannot remove themselves.
  if (currentUserId && currentUserId === targetUserId) {
    return false;
  }

  // OWNER can remove anyone except OWNER.
  if (currentRole === "OWNER") {
    return true;
  }

  // ADMIN cannot remove another ADMIN.
  if (currentRole === "ADMIN" && targetRole === "ADMIN") {
    return false;
  }

  // ADMIN can remove MEMBER/GUEST.
  if (currentRole === "ADMIN") {
    return true;
  }

  return false;
}
