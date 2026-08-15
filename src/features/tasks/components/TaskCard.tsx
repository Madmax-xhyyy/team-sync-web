import { useEffect, useRef, useState } from "react";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import {
  attachClosestEdge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { Pencil, Trash2, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { Task } from "../types/task.types";

interface TaskCardProps {
  task: Task;
  index: number;
  columnId: string;

  isLastTask: boolean;
  isInColumnBottomArea: boolean;

  onEdit: () => void;
  onDelete: () => void;
  onAssign: () => void;
}

export type TaskDragData = {
  [key: string | symbol]: unknown;

  type: "task";
  taskId: string;
  columnId: string;
  index: number;
};

export type TaskDropData = {
  [key: string | symbol]: unknown;

  type: "task";
  taskId: string;
  columnId: string;
  index: number;
};

export function TaskCard({
  task,
  index,
  columnId,
  isLastTask,
  isInColumnBottomArea,
  onEdit,
  onDelete,
  onAssign,
}: TaskCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const [isDragging, setIsDragging] = useState(false);

  const [dropEdge, setDropEdge] = useState<"top" | "bottom" | null>(null);

  useEffect(() => {
    const element = cardRef.current;

    if (!element) {
      return;
    }

    /*
     * ==================================================
     * DRAG SOURCE
     * ==================================================
     */

    const draggableCleanup = draggable({
      element,

      getInitialData: (): TaskDragData => ({
        type: "task",
        taskId: task.id,
        columnId,
        index,
      }),

      onDragStart: () => {
        setIsDragging(true);
      },

      onDrop: () => {
        setIsDragging(false);
        setDropEdge(null);
      },
    });

    /*
     * ==================================================
     * DROP TARGET
     * ==================================================
     */

    const dropTargetCleanup = dropTargetForElements({
      element,

      canDrop: ({ source }) => {
        const data = source.data as Partial<TaskDragData>;

        return data.type === "task" && data.taskId !== task.id;
      },

      getData: ({ input, element }) => {
        const data: TaskDropData = {
          type: "task",
          taskId: task.id,
          columnId,
          index,
        };

        return attachClosestEdge(data, {
          input,
          element,
          allowedEdges: ["top", "bottom"],
        });
      },

      onDragEnter: ({ self }) => {
        const edge = extractClosestEdge(self.data) as "top" | "bottom" | null;

        setDropEdge(edge);
      },

      onDrag: ({ self }) => {
        const edge = extractClosestEdge(self.data) as "top" | "bottom" | null;

        setDropEdge(edge);
      },

      onDragLeave: () => {
        setDropEdge(null);
      },

      onDrop: () => {
        setDropEdge(null);
      },
    });

    return () => {
      draggableCleanup();
      dropTargetCleanup();
    };
  }, [task.id, columnId, index]);

  /*
   * ==================================================
   * BOTTOM INDICATOR
   * ==================================================
   *
   * Normal behavior:
   *
   *   dropEdge === "bottom"
   *
   * Additional behavior:
   *
   *   last task + pointer below the task
   *
   * This is still the SAME TaskCard indicator.
   */

  const shouldShowBottomIndicator = dropEdge === "bottom" || (isLastTask && isInColumnBottomArea);

  return (
    <div ref={cardRef} data-task-card className="relative">
      {/* Top insertion indicator */}

      {dropEdge === "top" && (
        <div className="pointer-events-none absolute -top-2 left-0 right-0 z-20">
          <div className="h-1 rounded-full bg-primary shadow-sm" />
        </div>
      )}

      {/* Task card */}

      <div
        className={[
          "rounded-lg border bg-background p-4 shadow-sm",
          "cursor-grab active:cursor-grabbing",
          "transition-opacity duration-150",

          isDragging ? "scale-[0.98] opacity-40" : "opacity-100",

          dropEdge ? "border-primary/50" : "",
        ].join(" ")}
      >
        {/* Header */}

        <div className="flex items-start justify-between gap-3">
          <h4 className="font-medium">{task.title}</h4>

          <div
            className="flex items-center gap-1"
            onPointerDown={(event) => {
              event.stopPropagation();
            }}
          >
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

      {/* Bottom insertion indicator */}

      {shouldShowBottomIndicator && (
        <div className="pointer-events-none absolute -bottom-2 left-0 right-0 z-20">
          <div className="h-1 rounded-full bg-primary shadow-sm" />
        </div>
      )}
    </div>
  );
}
