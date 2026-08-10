import { api } from "@/lib/api";

import type { OrganizationMember, OrganizationRole } from "../types/member.types";

export async function getOrganizationMembers(
  organizationId: string,
): Promise<OrganizationMember[]> {
  const response = await api.get(`/organizations/${organizationId}/members`);

  return response.data.data ?? [];
}

export async function addOrganizationMember(
  organizationId: string,
  data: {
    email: string;
    role: OrganizationRole;
  },
): Promise<OrganizationMember> {
  const response = await api.post(`/organizations/${organizationId}/members`, data);

  return response.data.data;
}

export async function updateOrganizationMemberRole(
  organizationId: string,
  memberId: string,
  role: OrganizationRole,
): Promise<OrganizationMember> {
  const response = await api.patch(`/organizations/${organizationId}/members/${memberId}/role`, {
    role,
  });

  return response.data.data;
}

export async function removeOrganizationMember(
  organizationId: string,
  memberId: string,
): Promise<void> {
  await api.delete(`/organizations/${organizationId}/members/${memberId}`);
}
