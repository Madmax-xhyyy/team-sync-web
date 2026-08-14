import { useQueries } from "@tanstack/react-query";

import { getTasks } from "../api/tasks.api";
import type { Task, TaskColumn } from "../types/task.types";

export function useBoardTasks(organizationId: string, projectId: string, columns: TaskColumn[]) {
  const queries = useQueries({
    queries: columns.map((column) => ({
      queryKey: ["tasks", organizationId, projectId, column.id],

      queryFn: () => getTasks(organizationId, projectId, column.id),

      enabled: Boolean(organizationId) && Boolean(projectId) && Boolean(column.id),
    })),
  });

  const tasksByColumn: Record<string, Task[]> = {};

  columns.forEach((column, index) => {
    tasksByColumn[column.id] = queries[index]?.data ?? [];
  });

  return {
    tasksByColumn,

    isLoading: queries.some((query) => query.isLoading),

    isError: queries.some((query) => query.isError),
  };
}
