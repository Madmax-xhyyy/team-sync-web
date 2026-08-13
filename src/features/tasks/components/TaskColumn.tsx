import { useState } from "react";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useTasks } from "../hooks/useTasks";
import type { Task } from "../types/task.types";

import { AssignTaskDialog } from "./AssignTaskDialog";
import { CreateTaskDialog } from "./CreateTaskDialog";
import { DeleteTaskDialog } from "./DeleteTaskDialog";
import { EditTaskDialog } from "./EditTaskDialog";
import { TaskCard } from "./TaskCard";

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

  const [assignTaskOpen, setAssignTaskOpen] = useState(false);

  const [deleteTaskOpen, setDeleteTaskOpen] = useState(false);

  const { data: tasks = [], isLoading, isError } = useTasks(organizationId, projectId, column.id);

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
  };

  const handleAssign = (task: Task) => {
    setSelectedTask(task);
    setAssignTaskOpen(true);
  };

  const handleDelete = (task: Task) => {
    setSelectedTask(task);
    setDeleteTaskOpen(true);
  };

  const handleEditDialogChange = (open: boolean) => {
    if (!open) {
      setSelectedTask(null);
    }
  };

  const handleAssignDialogChange = (open: boolean) => {
    setAssignTaskOpen(open);

    if (!open) {
      setSelectedTask(null);
    }
  };

  const handleDeleteDialogChange = (open: boolean) => {
    setDeleteTaskOpen(open);

    if (!open) {
      setSelectedTask(null);
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
          {isLoading && (
            <>
              <div className="h-20 animate-pulse rounded-lg bg-muted" />
              <div className="h-20 animate-pulse rounded-lg bg-muted" />
            </>
          )}

          {isError && <p className="text-sm text-destructive">Failed to load tasks.</p>}

          {!isLoading && !isError && tasks.length === 0 && (
            <p className="text-sm text-muted-foreground">No tasks yet.</p>
          )}

          {!isLoading &&
            !isError &&
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEdit}
                onAssign={handleAssign}
                onDelete={handleDelete}
              />
            ))}
        </div>
      </div>

      {/* Create */}
      <CreateTaskDialog
        organizationId={organizationId}
        projectId={projectId}
        columnId={column.id}
        columnName={column.name}
        open={createTaskOpen}
        onOpenChange={setCreateTaskOpen}
      />

      {/* Edit */}
      {selectedTask && (
        <EditTaskDialog
          organizationId={organizationId}
          projectId={projectId}
          columnId={column.id}
          task={selectedTask}
          open={!assignTaskOpen && !deleteTaskOpen && Boolean(selectedTask)}
          onOpenChange={handleEditDialogChange}
        />
      )}

      {/* Assign */}
      {selectedTask && (
        <AssignTaskDialog
          organizationId={organizationId}
          projectId={projectId}
          columnId={column.id}
          task={selectedTask}
          open={assignTaskOpen}
          onOpenChange={handleAssignDialogChange}
        />
      )}

      {/* Delete */}
      {selectedTask && (
        <DeleteTaskDialog
          organizationId={organizationId}
          projectId={projectId}
          columnId={column.id}
          task={selectedTask}
          open={deleteTaskOpen}
          onOpenChange={handleDeleteDialogChange}
        />
      )}
    </>
  );
}
