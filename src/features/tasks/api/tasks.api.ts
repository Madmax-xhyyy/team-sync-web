import { api } from "@/lib/api";

import type { Task } from "../types/task.types";

import { CreateTaskFormData } from "../schemas/task.schema";

export async function getTasks(
  organizationId: string,
  projectId: string,
  columnId: string,
): Promise<Task[]> {
  const response = await api.get(
    `/organizations/${organizationId}/projects/${projectId}/columns/${columnId}/tasks`,
  );

  return response.data.data ?? [];
}

export async function createTask(
  organizationId: string,
  projectId: string,
  columnId: string,
  data: CreateTaskFormData,
): Promise<Task> {
  const response = await api.post(
    `/organizations/${organizationId}/projects/${projectId}/columns/${columnId}/tasks`,
    data,
  );

  return response.data.data;
}
