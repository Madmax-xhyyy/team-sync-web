import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";

import { useTaskColumns } from "../hooks/useTaskColumns";
import { useBoardTasks } from "../hooks/useBoardTasks";
import { useMoveTask } from "../hooks/useMoveTask";

import type { Task } from "../types/task.types";

import { TaskColumn } from "./TaskColumn";
import { EditTaskDialog } from "./EditTaskDialog";
import { DeleteTaskDialog } from "./DeleteTaskDialog";
import { AssignTaskDialog } from "./AssignTaskDialog";

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
   * Flatten all tasks so we can find
   * a task by its ID.
   */
  const allTasks = useMemo(() => Object.values(tasksByColumn).flat(), [tasksByColumn]);

  const findTask = (taskId: string) => {
    return allTasks.find((task) => task.id === taskId);
  };

  /*
   * Handle completed drag operation.
   *
   * useSortable provides:
   *
   * initialIndex  -> original position
   * index         -> final position
   * initialGroup  -> original column
   * group         -> final column
   */
  const handleDragEnd = (event: DragEndEvent) => {
    if (event.canceled) {
      return;
    }

    const { source, target } = event.operation;

    if (!source || !target) {
      return;
    }

    /*
     * Make sure the dragged item is a sortable task.
     */
    if (!isSortable(source)) {
      return;
    }

    const taskId = String(source.id);

    /*
     * Original column.
     */
    const sourceColumnId = String(source.initialGroup);

    /*
     * Destination comes from the actual
     * droppable target.
     */
    const targetId = String(target.id);

    /*
     * Our TaskColumn uses:
     *
     * column:<columnId>
     */
    if (!targetId.startsWith("column:")) {
      return;
    }

    const targetColumnId = targetId.replace("column:", "");

    /*
     * Position reported by dnd-kit.
     */
    const position = source.index;

    /*
     * Find the task.
     */
    const task = findTask(taskId);

    if (!task) {
      return;
    }

    /*
     * Make sure the position is valid.
     */
    if (position == null || position < 0) {
      return;
    }

    /*
     * If nothing changed, don't send a request.
     */
    if (sourceColumnId === targetColumnId && source.initialIndex === position) {
      return;
    }

    console.log("MOVING TASK:", {
      taskId,
      sourceColumnId,
      targetColumnId,
      position,
    });

    moveTaskMutation.mutate({
      taskId,
      columnId: sourceColumnId,
      targetColumnId,
      position,
    });
  };

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

  return (
    <>
      <DragDropProvider onDragEnd={handleDragEnd}>
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
      </DragDropProvider>

      {/* Edit task */}
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

      {/* Delete task */}
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

      {/* Assign task */}
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
