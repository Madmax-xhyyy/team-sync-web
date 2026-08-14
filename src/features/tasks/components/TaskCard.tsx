import { useDraggable } from "@dnd-kit/react";
import { Pencil, Trash2, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { Task } from "../types/task.types";

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onAssign: () => void;
}

export function TaskCard({ task, onEdit, onDelete, onAssign }: TaskCardProps) {
  /*
   * Register this task as draggable.
   *
   * TaskBoard expects:
   *
   * task:<taskId>
   */
  const { ref, isDragging } = useDraggable({
    id: `task:${task.id}`,
  });

  return (
    <div
      ref={ref}
      className={[
        "rounded-lg border bg-background p-4 shadow-sm",
        "cursor-grab active:cursor-grabbing",
        "transition-opacity",
        isDragging ? "opacity-50" : "",
      ].join(" ")}
    >
      {/* Task header */}
      <div className="flex items-start justify-between gap-3">
        <h4 className="font-medium">{task.title}</h4>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onAssign}
            aria-label={`Assign ${task.title}`}
            title={`Assign ${task.title}`}
          >
            <UserPlus className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onEdit}
            aria-label={`Edit ${task.title}`}
            title={`Edit ${task.title}`}
          >
            <Pencil className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onDelete}
            aria-label={`Delete ${task.title}`}
            title={`Delete ${task.title}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{task.description}</p>
      )}

      {/* Metadata */}
      <div className="mt-3 flex items-center justify-between">
        <span className="rounded-md bg-muted px-2 py-1 text-xs">{task.priority}</span>

        <span className="text-xs text-muted-foreground">{task.type}</span>
      </div>
    </div>
  );
}
