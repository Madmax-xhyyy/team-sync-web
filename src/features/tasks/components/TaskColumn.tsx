import { useState } from "react";

import { Pencil, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useTasks } from "../hooks/useTasks";
import type { Task } from "../types/task.types";

import { CreateTaskDialog } from "./CreateTaskDialog";
import { EditTaskDialog } from "./EditTaskDialog";
import { DeleteTaskDialog } from "./DeleteTaskDialog";

interface TaskColumnProps {
  organizationId: string;
  projectId: string;
  column: {
    id: string;
    name: string;
  };
}

export function TaskColumn({ organizationId, projectId, column }: TaskColumnProps) {
  const [createTaskOpen, setCreateTaskOpen] = useState(false);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const { data: tasks = [], isLoading, isError } = useTasks(organizationId, projectId, column.id);

  // -----------------------------
  // Edit
  // -----------------------------

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
  };

  const handleEditDialogChange = (open: boolean) => {
    if (!open) {
      setSelectedTask(null);
    }
  };

  // -----------------------------
  // Delete
  // -----------------------------

  const handleDeleteTask = (task: Task) => {
    setTaskToDelete(task);
  };

  const handleDeleteDialogChange = (open: boolean) => {
    if (!open) {
      setTaskToDelete(null);
    }
  };

  return (
    <>
      <div className="min-h-64 rounded-xl border bg-muted/30">
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

        {/* Tasks */}
        <div className="space-y-3 p-4">
          {/* Loading */}
          {isLoading && (
            <>
              <div className="h-20 animate-pulse rounded-lg bg-muted" />
              <div className="h-20 animate-pulse rounded-lg bg-muted" />
            </>
          )}

          {/* Error */}
          {isError && <p className="text-sm text-destructive">Failed to load tasks.</p>}

          {/* Empty */}
          {!isLoading && !isError && tasks.length === 0 && (
            <p className="text-sm text-muted-foreground">No tasks yet.</p>
          )}

          {/* Task list */}
          {!isLoading &&
            !isError &&
            tasks.map((task) => (
              <div key={task.id} className="rounded-lg border bg-background p-4 shadow-sm">
                {/* Task header */}
                <div className="flex items-start justify-between gap-3">
                  <h4 className="font-medium">{task.title}</h4>

                  <div className="flex items-center gap-1">
                    {/* Edit */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditTask(task)}
                      aria-label={`Edit ${task.title}`}
                      title={`Edit ${task.title}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    {/* Delete */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteTask(task)}
                      aria-label={`Delete ${task.title}`}
                      title={`Delete ${task.title}`}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Description */}
                {task.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {task.description}
                  </p>
                )}

                {/* Task metadata */}
                <div className="mt-3 flex items-center justify-between">
                  <span className="rounded-md bg-muted px-2 py-1 text-xs">{task.priority}</span>

                  <span className="text-xs text-muted-foreground">{task.type}</span>
                </div>

                {/* Due date */}
                {task.dueDate && (
                  <div className="mt-3 text-xs text-muted-foreground">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* Create task dialog */}
      <CreateTaskDialog
        organizationId={organizationId}
        projectId={projectId}
        columnId={column.id}
        columnName={column.name}
        open={createTaskOpen}
        onOpenChange={setCreateTaskOpen}
      />

      {/* Edit task dialog */}
      {selectedTask && (
        <EditTaskDialog
          organizationId={organizationId}
          projectId={projectId}
          columnId={column.id}
          task={selectedTask}
          open={Boolean(selectedTask)}
          onOpenChange={handleEditDialogChange}
        />
      )}

      {/* Delete task dialog */}
      {taskToDelete && (
        <DeleteTaskDialog
          organizationId={organizationId}
          projectId={projectId}
          columnId={column.id}
          task={taskToDelete}
          open={Boolean(taskToDelete)}
          onOpenChange={handleDeleteDialogChange}
        />
      )}
    </>
  );
}
