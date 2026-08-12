export interface Project {
  id: string;
  organizationId: string;
  name: string;
  description: string | null;
  createdBy: string;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
}

export interface UpdateProjectRequest {
  name: string;
  description?: string;
}
