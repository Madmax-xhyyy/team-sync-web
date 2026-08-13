import { Calendar, MoreHorizontal, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Task } from "../types/task.types";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onAssign: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskCard({ task, onEdit, onAssign, onDelete }: TaskCardProps) {
  const formattedDueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : null;

  return (
    <div className="rounded-lg border bg-background p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <h4 className="font-medium">{task.title}</h4>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              aria-label={`Actions for ${task.title}`}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(task)}>Edit</DropdownMenuItem>

            <DropdownMenuItem onClick={() => onAssign(task)}>
              {task.assigneeId ? "Change assignee" : "Assign"}
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => onDelete(task)}
              className="text-destructive focus:text-destructive"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Description */}
      {task.description && (
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{task.description}</p>
      )}

      {/* Metadata */}
      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="rounded-md bg-muted px-2 py-1 text-xs">{task.priority}</span>

        <span className="text-xs text-muted-foreground">{task.type}</span>
      </div>

      {/* Assignee */}
      {task.assigneeId && (
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <User className="h-3.5 w-3.5" />

          <span>Assigned</span>
        </div>
      )}

      {/* Due date */}
      {formattedDueDate && (
        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />

          <span>{formattedDueDate}</span>
        </div>
      )}
    </div>
  );
}
