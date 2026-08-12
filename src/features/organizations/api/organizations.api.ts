import { api } from "@/lib/api";

import type { Organization } from "../types/organization.types";
import type { CreateOrganizationFormValues } from "../schemas/organization.schema";

export async function getOrganizations(): Promise<Organization[]> {
  const response = await api.get("/organizations");

  return response.data.data;
}

export async function createOrganization(
  data: CreateOrganizationFormValues,
): Promise<Organization> {
  const response = await api.post("/organizations", data);

  return response.data.data;
}

export async function getMyOrganizations(): Promise<Organization[]> {
  const response = await api.get("/organizations/my");

  return response.data.data ?? [];
}

export async function getOrganizationById(id: string): Promise<Organization> {
  const response = await api.get(`/organizations/${id}`);

  return response.data.data;
}

export interface UpdateOrganizationRequest {
  name: string;
  description?: string;
}

export async function updateOrganization(organizationId: string, data: UpdateOrganizationRequest) {
  const response = await api.put(`/organizations/${organizationId}`, data);

  return response.data.data;
}

export async function deleteOrganization(organizationId: string): Promise<void> {
  await api.delete(`/organizations/${organizationId}`);
}
