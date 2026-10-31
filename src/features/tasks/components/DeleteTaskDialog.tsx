import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { getApiErrorMessage } from "@/lib/api-error";

import { useDeleteTask } from "../hooks/useDeleteTask";
import type { Task } from "../types/task.types";

interface DeleteTaskDialogProps {
  organizationId: string;
  projectId: string;
  columnId: string;
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteTaskDialog({
  organizationId,
  projectId,
  columnId,
  task,
  open,
  onOpenChange,
}: DeleteTaskDialogProps) {
  const deleteTaskMutation = useDeleteTask(organizationId, projectId, columnId);

  const handleDelete = () => {
    deleteTaskMutation.mutate(task.id, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (deleteTaskMutation.isPending) {
      return;
    }

    if (!nextOpen) {
      deleteTaskMutation.reset();
    }

    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Task</DialogTitle>

          <DialogDescription>
            Are you sure you want to delete <strong>{task.title}</strong>? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        {deleteTaskMutation.isError && (
          <p className="text-sm text-destructive">
            {getApiErrorMessage(deleteTaskMutation.error, "Failed to delete task.")}
          </p>
        )}

        <DialogFooter>
          <button
            type="button"
            disabled={deleteTaskMutation.isPending}
            onClick={() => handleOpenChange(false)}
            className="rounded-md border px-4 py-2 text-sm"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={deleteTaskMutation.isPending}
            onClick={handleDelete}
            className="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground disabled:opacity-50"
          >
            {deleteTaskMutation.isPending ? "Deleting..." : "Delete Task"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
