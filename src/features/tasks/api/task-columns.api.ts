import { api } from "@/lib/api";

import type { TaskColumn } from "../types/task.types";

export async function getTaskColumns(
  organizationId: string,
  projectId: string,
): Promise<TaskColumn[]> {
  const response = await api.get(`/organizations/${organizationId}/projects/${projectId}/columns`);

  return response.data.data ?? [];
}
