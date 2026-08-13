import { useParams } from "react-router-dom";

import { useTaskColumns } from "../hooks/useTaskColumns";
import { TaskColumn } from "./TaskColumn";

export function TaskBoard() {
  const { organizationId = "", projectId = "" } = useParams();

  const { data: columns = [], isLoading, isError } = useTaskColumns(organizationId, projectId);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((column) => (
          <div key={column} className="h-64 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border p-6 text-sm text-destructive">
        Failed to load task columns.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {columns.map((column) => (
        <TaskColumn
          key={column.id}
          organizationId={organizationId}
          projectId={projectId}
          column={column}
        />
      ))}
    </div>
  );
}
