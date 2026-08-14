import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";

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
    tasksByColumn: serverTasks,
    isLoading: isTasksLoading,
    isError: isTasksError,
  } = useBoardTasks(organizationId, projectId, columns);

  /*
   * Local board state is only used during
   * optimistic drag-and-drop operations.
   *
   * null means we are using the server state.
   */
  const [localTasksByColumn, setLocalTasksByColumn] = useState<Record<string, Task[]> | null>(null);

  const tasksByColumn = localTasksByColumn ?? serverTasks;

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [deleteTask, setDeleteTask] = useState<Task | null>(null);
  const [assignTask, setAssignTask] = useState<Task | null>(null);

  const moveTaskMutation = useMoveTask(organizationId, projectId);

  /*
   * Flatten all tasks.
   */
  const allTasks = useMemo(() => Object.values(tasksByColumn).flat(), [tasksByColumn]);

  /*
   * Find a task by its real ID.
   */
  const findTask = (taskId: string) => {
    return allTasks.find((task) => task.id === taskId);
  };

  /*
   * Find which column contains a task.
   */
  const findColumnForTask = (taskId: string) => {
    for (const [columnId, tasks] of Object.entries(tasksByColumn)) {
      if (tasks.some((task) => task.id === taskId)) {
        return columnId;
      }
    }

    return undefined;
  };

  /*
   * Resolve the target column from dnd-kit.
   *
   * Column target:
   * column:123
   *
   * Task target:
   * task:456
   */
  const resolveTargetColumn = (targetId: string) => {
    if (targetId.startsWith("column:")) {
      return targetId.replace("column:", "");
    }

    if (targetId.startsWith("task:")) {
      const targetTaskId = targetId.replace("task:", "");

      return findColumnForTask(targetTaskId);
    }

    return undefined;
  };

  /*
   * Optimistically move a task locally.
   */
  const moveTaskLocally = (taskId: string, targetColumnId: string, targetTaskId?: string) => {
    setLocalTasksByColumn((current) => {
      const sourceState = current ?? serverTasks;

      const sourceColumnId = findColumnForTask(taskId);

      if (!sourceColumnId) {
        return sourceState;
      }

      const sourceTasks = [...(sourceState[sourceColumnId] ?? [])];

      const sourceIndex = sourceTasks.findIndex((task) => task.id === taskId);

      if (sourceIndex === -1) {
        return sourceState;
      }

      const [movedTask] = sourceTasks.splice(sourceIndex, 1);

      if (!movedTask) {
        return sourceState;
      }

      const updatedTask: Task = {
        ...movedTask,
        columnId: targetColumnId,
      };

      const targetTasks =
        sourceColumnId === targetColumnId ? sourceTasks : [...(sourceState[targetColumnId] ?? [])];

      /*
       * Find insertion index.
       */
      let targetIndex = targetTasks.length;

      if (targetTaskId) {
        const foundIndex = targetTasks.findIndex((task) => task.id === targetTaskId);

        if (foundIndex !== -1) {
          targetIndex = foundIndex;
        }
      }

      targetTasks.splice(targetIndex, 0, updatedTask);

      /*
       * Normalize source positions.
       */
      const normalizedSourceTasks = sourceTasks.map((task, index) => ({
        ...task,
        position: index,
      }));

      /*
       * Normalize target positions.
       */
      const normalizedTargetTasks = targetTasks.map((task, index) => ({
        ...task,
        position: index,
        columnId: targetColumnId,
      }));

      /*
       * Moving within the same column.
       */
      if (sourceColumnId === targetColumnId) {
        return {
          ...sourceState,
          [sourceColumnId]: normalizedTargetTasks,
        };
      }

      /*
       * Moving between columns.
       */
      return {
        ...sourceState,
        [sourceColumnId]: normalizedSourceTasks,
        [targetColumnId]: normalizedTargetTasks,
      };
    });
  };

  /*
   * Handle completed drag operation.
   */
  const handleDragEnd = (event: DragEndEvent) => {
    if (event.canceled) {
      setLocalTasksByColumn(null);
      return;
    }

    const { source, target } = event.operation;

    if (!source || !target) {
      setLocalTasksByColumn(null);
      return;
    }

    /*
     * dnd-kit IDs:
     *
     * source = task:<taskId>
     * target = column:<columnId>
     * OR
     * target = task:<taskId>
     */
    const sourceId = String(source.id);
    const targetId = String(target.id);

    if (!sourceId.startsWith("task:")) {
      return;
    }

    const taskId = sourceId.replace("task:", "");

    const task = findTask(taskId);

    if (!task) {
      return;
    }

    const targetColumnId = resolveTargetColumn(targetId);

    if (!targetColumnId) {
      return;
    }

    const sourceColumnId = task.columnId;

    /*
     * Determine target position.
     */
    const targetTasks = tasksByColumn[targetColumnId] ?? [];

    let position = targetTasks.length;

    /*
     * If dropping on another task,
     * insert at that task's position.
     */
    if (targetId.startsWith("task:")) {
      const targetTaskId = targetId.replace("task:", "");

      const targetIndex = targetTasks.findIndex((item) => item.id === targetTaskId);

      if (targetIndex !== -1) {
        position = targetIndex;
      }
    }

    /*
     * If dropping inside the same column,
     * account for the dragged task being removed.
     */
    if (sourceColumnId === targetColumnId) {
      const sourceIndex = targetTasks.findIndex((item) => item.id === taskId);

      if (sourceIndex !== -1 && sourceIndex < position) {
        position -= 1;
      }
    }

    /*
     * Prevent unnecessary API calls.
     */
    if (sourceColumnId === targetColumnId && targetId === sourceId) {
      return;
    }

    /*
     * Optimistically update UI.
     */
    moveTaskLocally(
      taskId,
      targetColumnId,
      targetId.startsWith("task:") ? targetId.replace("task:", "") : undefined,
    );

    /*
     * Persist movement to backend.
     */
    moveTaskMutation.mutate(
      {
        taskId,
        columnId: sourceColumnId,
        targetColumnId,
        position,
      },
      {
        onSuccess: () => {
          /*
           * useMoveTask invalidates the relevant queries.
           *
           * Once React Query receives the new server state,
           * we return control to serverTasks.
           */
          setLocalTasksByColumn(null);
        },

        onError: () => {
          /*
           * Roll back optimistic state.
           */
          setLocalTasksByColumn(null);
        },
      },
    );
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
