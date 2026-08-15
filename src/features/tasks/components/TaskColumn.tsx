import { useEffect, useRef, useState } from "react";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { Plus } from "lucide-react";

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
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  /*
   * This state belongs to the column, but the visual
   * indicator is still rendered by TaskCard.
   */
  const [isInColumnBottomArea, setIsInColumnBottomArea] = useState(false);

  const columnRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = columnRef.current;

    if (!element) {
      return;
    }

    return dropTargetForElements({
      element,

      getData: () => ({
        type: "column",
        columnId: column.id,
      }),

      canDrop: ({ source }) => {
        const data = source.data as {
          type?: string;
        };

        return data.type === "task";
      },

      onDragEnter: () => {
        setIsDraggedOver(true);
      },

      onDrag: ({ location }) => {
        if (tasks.length === 0) {
          setIsInColumnBottomArea(false);
          return;
        }

        /*
         * Find all TaskCard elements.
         *
         * TaskCard exposes its outer element using
         * [data-task-card].
         */
        const taskElements = Array.from(element.querySelectorAll<HTMLElement>("[data-task-card]"));

        const lastTask = taskElements[taskElements.length - 1];

        if (!lastTask) {
          setIsInColumnBottomArea(false);
          return;
        }

        const lastTaskRect = lastTask.getBoundingClientRect();

        const pointerY = location.current.input.clientY;

        /*
         * The pointer is considered to be in the
         * bottom area once it is below the last task.
         */
        setIsInColumnBottomArea(pointerY > lastTaskRect.bottom);
      },

      onDragLeave: () => {
        setIsDraggedOver(false);
        setIsInColumnBottomArea(false);
      },

      onDrop: () => {
        setIsDraggedOver(false);
        setIsInColumnBottomArea(false);
      },
    });
  }, [column.id, tasks.length]);

  return (
    <>
      <div
        className={[
          "flex min-h-64 flex-col rounded-xl border bg-muted/30",
          "transition-all duration-150",
          isDraggedOver ? "border-primary bg-primary/10 ring-2 ring-primary/20" : "",
        ].join(" ")}
      >
        {/* Header */}
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

        {/* Drop area */}
        <div
          ref={columnRef}
          className={[
            "relative flex-1 min-h-40 space-y-3 p-4",
            isDraggedOver ? "bg-primary/5" : "",
          ].join(" ")}
        >
          {isLoading && (
            <>
              <div className="h-20 animate-pulse rounded-lg bg-muted" />
              <div className="h-20 animate-pulse rounded-lg bg-muted" />
            </>
          )}

          {!isLoading && tasks.length === 0 && (
            <div
              className={[
                "flex min-h-32 items-center justify-center",
                "rounded-lg border border-dashed",
                isDraggedOver ? "border-primary bg-primary/10" : "",
              ].join(" ")}
            >
              <div className="text-center">
                <p className="text-sm text-muted-foreground">No tasks yet.</p>

                <p className="mt-1 text-xs text-muted-foreground">Drop a task here.</p>
              </div>
            </div>
          )}

          {!isLoading &&
            tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                columnId={column.id}
                isLastTask={index === tasks.length - 1}
                isInColumnBottomArea={index === tasks.length - 1 && isInColumnBottomArea}
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
