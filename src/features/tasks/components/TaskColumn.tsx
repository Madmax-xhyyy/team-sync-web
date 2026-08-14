import { useDroppable } from "@dnd-kit/react";
import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import type { Task } from "../types/task.types";

import { CreateTaskDialog } from "./CreateTaskDialog";
import { TaskCard } from "./TaskCard";

interface TaskColumnProps {
  organizationId: string;
  projectId: string;

  column: {
    id: string;
    name: string;
  };

  tasks: Task[];

  isLoading: boolean;

  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  onAssignTask: (task: Task) => void;
}

export function TaskColumn({
  organizationId,
  projectId,
  column,
  tasks,
  isLoading,
  onEditTask,
  onDeleteTask,
  onAssignTask,
}: TaskColumnProps) {
  const [createTaskOpen, setCreateTaskOpen] = useState(false);

  const { ref: columnRef, isDropTarget } = useDroppable({
    id: `column:${column.id}`,
  });

  return (
    <>
      <div
        className={[
          "min-h-64 rounded-xl border bg-muted/30 transition-colors",
          isDropTarget ? "border-primary bg-primary/10" : "",
        ].join(" ")}
      >
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

        {/* Sortable task area */}
        <div ref={columnRef} className="min-h-32 space-y-3 p-4">
          {isLoading && (
            <>
              <div className="h-20 animate-pulse rounded-lg bg-muted" />
              <div className="h-20 animate-pulse rounded-lg bg-muted" />
            </>
          )}

          {!isLoading && tasks.length === 0 && (
            <div className="rounded-lg border border-dashed p-6 text-center">
              <p className="text-sm text-muted-foreground">No tasks yet.</p>

              <p className="mt-1 text-xs text-muted-foreground">
                Drop a task here to move it to this column.
              </p>
            </div>
          )}

          {!isLoading &&
            tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                columnId={column.id}
                onEdit={() => onEditTask(task)}
                onDelete={() => onDeleteTask(task)}
                onAssign={() => onAssignTask(task)}
              />
            ))}
        </div>
      </div>

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
