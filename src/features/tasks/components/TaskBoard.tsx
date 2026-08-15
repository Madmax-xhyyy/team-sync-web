import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";

import { useTaskColumns } from "../hooks/useTaskColumns";
import { useBoardTasks } from "../hooks/useBoardTasks";
import { useMoveTask } from "../hooks/useMoveTask";

import type { Task } from "../types/task.types";

import { TaskColumn } from "./TaskColumn";
import { EditTaskDialog } from "./EditTaskDialog";
import { DeleteTaskDialog } from "./DeleteTaskDialog";
import { AssignTaskDialog } from "./AssignTaskDialog";

interface DragData {
  type: "task";
  taskId: string;
  columnId: string;
  index: number;
}

interface DropData {
  type: "column" | "task";
  columnId: string;
  taskId?: string;
  index?: number;

  /*
   * Provided by the Pragmatic D&D hitbox.
   *
   * "top"    = insert before target
   * "bottom" = insert after target
   */
  edge?: "top" | "bottom" | null;
}

export function TaskBoard() {
  const { organizationId = "", projectId = "" } = useParams();

  const {
    data: columns = [],
    isLoading: isColumnsLoading,
    isError: isColumnsError,
  } = useTaskColumns(organizationId, projectId);

  const {
    tasksByColumn,
    isLoading: isTasksLoading,
    isError: isTasksError,
  } = useBoardTasks(organizationId, projectId, columns);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [deleteTask, setDeleteTask] = useState<Task | null>(null);
  const [assignTask, setAssignTask] = useState<Task | null>(null);

  const moveTaskMutation = useMoveTask(organizationId, projectId);

  /*
   * Flatten all tasks so we can find a task by ID.
   */
  const allTasks = useMemo(() => Object.values(tasksByColumn).flat(), [tasksByColumn]);

  const findTask = useCallback(
    (taskId: string): Task | undefined => {
      return allTasks.find((task) => task.id === taskId);
    },
    [allTasks],
  );

  useEffect(() => {
    return monitorForElements({
      canMonitor: ({ source }) => {
        const data = source.data as Partial<DragData>;

        return data.type === "task";
      },

      onDrop({ source, location }) {
        const sourceData = source.data as Partial<DragData>;

        if (
          sourceData.type !== "task" ||
          typeof sourceData.taskId !== "string" ||
          typeof sourceData.columnId !== "string" ||
          typeof sourceData.index !== "number"
        ) {
          return;
        }

        const destination = location.current.dropTargets[0];

        if (!destination) {
          return;
        }

        const destinationData = destination.data as Partial<DropData>;

        if (
          typeof destinationData.columnId !== "string" ||
          (destinationData.type !== "column" && destinationData.type !== "task")
        ) {
          return;
        }

        const taskId = sourceData.taskId;
        const sourceColumnId = sourceData.columnId;
        const sourceIndex = sourceData.index;

        const task = findTask(taskId);

        if (!task) {
          return;
        }

        let targetColumnId: string;
        let position: number;

        /*
         * =====================================================
         * DROP ON COLUMN
         * =====================================================
         *
         * This handles:
         *
         * - empty columns
         * - empty space
         * - below the last task
         */
        if (destinationData.type === "column") {
          targetColumnId = destinationData.columnId;

          const destinationTasks = tasksByColumn[targetColumnId] ?? [];

          /*
           * Insert at the end.
           */
          position = destinationTasks.length;

          /*
           * If reordering inside the same column,
           * the dragged task is already included in length.
           */
          if (sourceColumnId === targetColumnId) {
            position = Math.max(0, destinationTasks.length - 1);
          }
        }

        /*
         * =====================================================
         * DROP ON TASK
         * =====================================================
         */
        else {
          targetColumnId = destinationData.columnId;

          if (
            typeof destinationData.index !== "number" ||
            !Number.isInteger(destinationData.index)
          ) {
            return;
          }

          /*
           * IMPORTANT:
           *
           * Do NOT use:
           *
           * destination.data.edge
           *
           * Use extractClosestEdge().
           */
          const edge = extractClosestEdge(destination.data);

          position = destinationData.index;

          /*
           * Dropping on the bottom half means:
           *
           * insert AFTER the target task.
           */
          if (edge === "bottom") {
            position += 1;
          }

          /*
           * If moving within the same column, removing the
           * source task shifts the insertion index.
           */
          if (sourceColumnId === targetColumnId && sourceIndex < position) {
            position -= 1;
          }
        }

        moveTaskMutation.mutate({
          task,
          sourceColumnId,
          targetColumnId,
          position,
        });
      },
    });
  }, [findTask, tasksByColumn, moveTaskMutation]);

  /*
   * ======================================================
   * Loading / Error states
   * ======================================================
   */

  if (isColumnsLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((column) => (
          <div key={column} className="h-64 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    );
  }

  if (isColumnsError) {
    return (
      <div className="rounded-xl border p-6 text-sm text-destructive">
        Failed to load task columns.
      </div>
    );
  }

  if (isTasksError) {
    return (
      <div className="rounded-xl border p-6 text-sm text-destructive">Failed to load tasks.</div>
    );
  }

  /*
   * ======================================================
   * Board
   * ======================================================
   */

  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        {columns.map((column) => (
          <TaskColumn
            key={column.id}
            organizationId={organizationId}
            projectId={projectId}
            column={column}
            tasks={tasksByColumn[column.id] ?? []}
            isLoading={isTasksLoading}
            onEditTask={setSelectedTask}
            onDeleteTask={setDeleteTask}
            onAssignTask={setAssignTask}
          />
        ))}
      </div>

      {selectedTask && (
        <EditTaskDialog
          organizationId={organizationId}
          projectId={projectId}
          columnId={selectedTask.columnId}
          task={selectedTask}
          open={true}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedTask(null);
            }
          }}
        />
      )}

      {deleteTask && (
        <DeleteTaskDialog
          organizationId={organizationId}
          projectId={projectId}
          columnId={deleteTask.columnId}
          task={deleteTask}
          open={true}
          onOpenChange={(open) => {
            if (!open) {
              setDeleteTask(null);
            }
          }}
        />
      )}

      {assignTask && (
        <AssignTaskDialog
          organizationId={organizationId}
          projectId={projectId}
          columnId={assignTask.columnId}
          task={assignTask}
          open={true}
          onOpenChange={(open) => {
            if (!open) {
              setAssignTask(null);
            }
          }}
        />
      )}
    </>
  );
}
