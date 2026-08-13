import { useState } from "react";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useTasks } from "../hooks/useTasks";

import { CreateTaskDialog } from "./CreateTaskDialog";

interface TaskColumnProps {
  organizationId: string;
  projectId: string;
  column: {
    id: string;
    name: string;
  };
}

export function TaskColumn({ organizationId, projectId, column }: TaskColumnProps) {
  const [createTaskOpen, setCreateTaskOpen] = useState(false);

  const { data: tasks = [], isLoading, isError } = useTasks(organizationId, projectId, column.id);

  return (
    <>
      <div className="min-h-64 rounded-xl border bg-muted/30">
        {/* Column header */}
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{column.name}</h3>

            <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{tasks.length}</span>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setCreateTaskOpen(true)}
            aria-label={`Add task to ${column.name}`}
            title={`Add task to ${column.name}`}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Tasks */}
        <div className="space-y-3 p-4">
          {isLoading && (
            <>
              <div className="h-20 animate-pulse rounded-lg bg-muted" />
              <div className="h-20 animate-pulse rounded-lg bg-muted" />
            </>
          )}

          {isError && <p className="text-sm text-destructive">Failed to load tasks.</p>}

          {!isLoading && !isError && tasks.length === 0 && (
            <p className="text-sm text-muted-foreground">No tasks yet.</p>
          )}

          {!isLoading &&
            !isError &&
            tasks.map((task) => (
              <div key={task.id} className="rounded-lg border bg-background p-4 shadow-sm">
                <h4 className="font-medium">{task.title}</h4>

                {task.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {task.description}
                  </p>
                )}

                <div className="mt-3 flex items-center justify-between">
                  <span className="rounded-md bg-muted px-2 py-1 text-xs">{task.priority}</span>

                  <span className="text-xs text-muted-foreground">{task.type}</span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Create task dialog */}
      <CreateTaskDialog
        organizationId={organizationId}
        projectId={projectId}
        columnId={column.id}
        columnName={column.name}
        open={createTaskOpen}
        onOpenChange={setCreateTaskOpen}
      />
    </>
  );
}
