import { useSortable } from "@dnd-kit/react/sortable";

import { GripVertical, Pencil, Trash2, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { Task } from "../types/task.types";

interface SortableTaskProps {
  task: Task;
  index: number;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onAssign: (task: Task) => void;
}

export function SortableTask({ task, index, onEdit, onDelete, onAssign }: SortableTaskProps) {
  const { ref, handleRef, isDragging } = useSortable({
    id: task.id,
    index,
    group: task.columnId,
    type: "task",
    accept: "task",
  });

  return (
    <div
      ref={ref}
      className={[
        "rounded-lg border bg-background p-4 shadow-sm",
        isDragging ? "opacity-50 shadow-lg" : "",
      ].join(" ")}
    >
      <div className="flex items-start gap-2">
        {/* Drag handle */}
        <button
          ref={handleRef}
          type="button"
          className="mt-0.5 cursor-grab touch-none text-muted-foreground hover:text-foreground active:cursor-grabbing"
          aria-label={`Drag ${task.title}`}
          title="Drag task"
        >
          <GripVertical className="h-4 w-4" />
        </button>

        {/* Task content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h4 className="font-medium">{task.title}</h4>

            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onAssign(task)}
                title={`Assign ${task.title}`}
              >
                <UserRound className="h-4 w-4" />
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onEdit(task)}
                title={`Edit ${task.title}`}
              >
                <Pencil className="h-4 w-4" />
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onDelete(task)}
                title={`Delete ${task.title}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {task.description && (
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{task.description}</p>
          )}

          <div className="mt-3 flex items-center justify-between">
            <span className="rounded-md bg-muted px-2 py-1 text-xs">{task.priority}</span>

            <span className="text-xs text-muted-foreground">{task.type}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
