import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Plus } from "lucide-react";

import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";

import { Button } from "@/components/ui/button";

import { useOrganizationMembers } from "@/features/organizations/hooks/useOrganizationMembers";

import { useTaskColumns } from "../hooks/useTaskColumns";
import { useBoardTasks } from "../hooks/useBoardTasks";
import { useMoveTask } from "../hooks/useMoveTask";

import type { Task } from "../types/task.types";

import { TaskList } from "./TaskList";
import { getApiErrorMessage } from "@/lib/api-error";

import { TaskColumn } from "./TaskColumn";
import { CreateTaskDialog } from "./CreateTaskDialog";
import { EditTaskDialog } from "./EditTaskDialog";
import { DeleteTaskDialog } from "./DeleteTaskDialog";
import { AssignTaskDialog } from "./AssignTaskDialog";
import { TaskDetailsDialog } from "./TaskDetailsDialog";

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
  edge?: "top" | "bottom" | null;
}

export function TaskBoard({ view = "board" }: { view?: "backlog" | "board" | "list" }) {
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

  const { data: members = [] } = useOrganizationMembers(organizationId);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [deleteTask, setDeleteTask] = useState<Task | null>(null);
  const [assignTask, setAssignTask] = useState<Task | null>(null);

  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [detailsTask, setDetailsTask] = useState<Task | null>(null);

  const moveTaskMutation = useMoveTask(organizationId, projectId);

  /*
   * --------------------------------------------------
   * TODO COLUMN
   * --------------------------------------------------
   *
   * New tasks are always created in Todo.
   *
   * We identify the column by name instead of assuming
   * a specific column ID.
   */
  const todoColumn = useMemo(() => {
    return (
      columns.find((column) => column.name.trim().toLowerCase() === "backlog") ??
      columns.find((column) => column.name.toLowerCase().replace(/\s/g, "") === "todo") ??
      [...columns].sort((a, b) => a.position - b.position)[0]
    );
  }, [columns]);

  /*
   * --------------------------------------------------
   * FIND TASK
   * --------------------------------------------------
   */

  const allTasks = useMemo(() => Object.values(tasksByColumn).flat(), [tasksByColumn]);

  const findTask = useCallback(
    (taskId: string): Task | undefined => {
      return allTasks.find((task) => task.id === taskId);
    },
    [allTasks],
  );

  /*
   * --------------------------------------------------
   * DRAG AND DROP
   * --------------------------------------------------
   */

  useEffect(() => {
    return monitorForElements({
      canMonitor: ({ source }) => {
        const data = source.data as Partial<DragData>;

        return view === "board" && !moveTaskMutation.isPending && data.type === "task";
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
         * --------------------------------------------------
         * DROP ON COLUMN
         * --------------------------------------------------
         */

        if (destinationData.type === "column") {
          targetColumnId = destinationData.columnId;

          const destinationTasks = tasksByColumn[targetColumnId] ?? [];

          position = destinationTasks.length;

          if (sourceColumnId === targetColumnId) {
            position = Math.max(0, destinationTasks.length - 1);
          }
        }

        /*
         * --------------------------------------------------
         * DROP ON TASK
         * --------------------------------------------------
         */
        else {
          targetColumnId = destinationData.columnId;

          if (
            typeof destinationData.index !== "number" ||
            !Number.isInteger(destinationData.index)
          ) {
            return;
          }

          const edge = extractClosestEdge(destination.data);

          position = destinationData.index;

          if (edge === "bottom") {
            position += 1;
          }

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
  }, [findTask, tasksByColumn, moveTaskMutation, view]);

  /*
   * --------------------------------------------------
   * LOADING
   * --------------------------------------------------
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

  /*
   * --------------------------------------------------
   * ERRORS
   * --------------------------------------------------
   */

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
   * --------------------------------------------------
   * BOARD
   * --------------------------------------------------
   */

  return (
    <>
      {/* Board header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">
            {view === "backlog" ? "Backlog" : view === "board" ? "Kanban board" : "Tasks & issues"}
          </h2>

          <p className="text-sm text-muted-foreground">
            {view === "backlog"
              ? `Plan new work in ${todoColumn?.name ?? "your starting column"}.`
              : view === "board"
                ? "Drag tasks between columns to update their status."
                : "Every task and issue in your project, in one place."}
          </p>
        </div>

        <Button type="button" onClick={() => setCreateTaskOpen(true)} disabled={!todoColumn}>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      {/* Board */}
      {moveTaskMutation.isError && (
        <p role="alert" className="mb-4 rounded-lg border p-3 text-sm text-destructive">
          {getApiErrorMessage(moveTaskMutation.error, "Couldn’t move task. Please try again.")}
        </p>
      )}
      {columns.length === 0 && (
        <p className="mb-4 rounded-lg border p-6 text-sm text-muted-foreground">
          This project has no task columns yet. A task column is needed before adding tasks.
        </p>
      )}
      {view !== "board" ? (
        <TaskList
          key={view}
          tasks={view === "backlog" ? (tasksByColumn[todoColumn?.id ?? ""] ?? []) : allTasks}
          columns={columns}
          members={members}
          loading={isTasksLoading}
          moving={moveTaskMutation.isPending}
          onView={setDetailsTask}
          onEdit={setSelectedTask}
          onAssign={setAssignTask}
          onDelete={setDeleteTask}
          onMove={(task, targetColumnId) => {
            if (task.columnId !== targetColumnId)
              moveTaskMutation.mutate({
                task,
                sourceColumnId: task.columnId,
                targetColumnId,
                position: (tasksByColumn[targetColumnId] ?? []).length,
              });
          }}
        />
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4 [&>div]:w-80 [&>div]:shrink-0">
          {columns.map((column) => (
            <TaskColumn
              key={column.id}
              organizationId={organizationId}
              projectId={projectId}
              column={column}
              tasks={tasksByColumn[column.id] ?? []}
              members={members}
              isLoading={isTasksLoading}
              onViewTask={setDetailsTask}
              onEditTask={setSelectedTask}
              onDeleteTask={setDeleteTask}
              onAssignTask={setAssignTask}
            />
          ))}
        </div>
      )}

      {/* Create Task */}
      {todoColumn && (
        <CreateTaskDialog
          organizationId={organizationId}
          projectId={projectId}
          columnId={todoColumn.id}
          columnName={todoColumn.name}
          open={createTaskOpen}
          onOpenChange={setCreateTaskOpen}
        />
      )}

      {/* Edit Task */}
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

      {/* Delete Task */}
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

      {/* Assign Task */}
      {assignTask && (
        <AssignTaskDialog
          key={`${assignTask.id}:${assignTask.assigneeId ?? ""}`}
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

      {detailsTask && (
        <TaskDetailsDialog
          task={detailsTask}
          members={members}
          open={true}
          onOpenChange={(open) => {
            if (!open) {
              setDetailsTask(null);
            }
          }}
        />
      )}
    </>
  );
}
