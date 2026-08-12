import { api } from "@/lib/api";

import type { CreateProjectRequest, Project, UpdateProjectRequest } from "../types/project.types";

export interface ProjectPage {
  content: Project[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export async function getProjects(
  organizationId: string,
  params?: {
    page?: number;
    size?: number;
    keyword?: string;
  },
): Promise<ProjectPage> {
  const response = await api.get(`/organizations/${organizationId}/projects`, {
    params,
  });

  return response.data.data;
}

export async function getProject(organizationId: string, projectId: string): Promise<Project> {
  const response = await api.get(`/organizations/${organizationId}/projects/${projectId}`);

  return response.data.data;
}

export async function createProject(
  organizationId: string,
  data: CreateProjectRequest,
): Promise<Project> {
  const response = await api.post(`/organizations/${organizationId}/projects`, data);

  return response.data.data;
}

export async function updateProject(
  organizationId: string,
  projectId: string,
  data: UpdateProjectRequest,
): Promise<Project> {
  const response = await api.put(`/organizations/${organizationId}/projects/${projectId}`, data);

  return response.data.data;
}

export async function deleteProject(organizationId: string, projectId: string): Promise<void> {
  await api.delete(`/organizations/${organizationId}/projects/${projectId}`);
}
