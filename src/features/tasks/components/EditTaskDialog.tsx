import { useEffect } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { getApiErrorMessage } from "@/lib/api-error";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { updateTaskSchema, type UpdateTaskFormData } from "../schemas/task.schema";

import { useUpdateTask } from "../hooks/useUpdateTask";

import type { Task } from "../types/task.types";

interface EditTaskDialogProps {
  organizationId: string;
  projectId: string;
  columnId: string;
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditTaskDialog({
  organizationId,
  projectId,
  columnId,
  task,
  open,
  onOpenChange,
}: EditTaskDialogProps) {
  const updateTaskMutation = useUpdateTask(organizationId, projectId, columnId);

  const form = useForm<UpdateTaskFormData>({
    resolver: zodResolver(updateTaskSchema),
    defaultValues: {
      title: task.title,
      description: task.description ?? "",
      priority: task.priority,
      type: task.type,
      dueDate: task.dueDate ? task.dueDate.slice(0, 16) : "",
    },
  });

  /*
   * Reset the form whenever a different task is selected.
   *
   * This is important because the dialog component can remain
   * mounted while the selected task changes.
   */
  useEffect(() => {
    form.reset({
      title: task.title,
      description: task.description ?? "",
      priority: task.priority,
      type: task.type,
      dueDate: task.dueDate ? task.dueDate.slice(0, 16) : "",
    });
  }, [task, form]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (updateTaskMutation.isPending) {
      return;
    }

    if (!nextOpen) {
      form.reset({
        title: task.title,
        description: task.description ?? "",
        priority: task.priority,
        type: task.type,
        dueDate: task.dueDate ? task.dueDate.slice(0, 16) : "",
      });

      updateTaskMutation.reset();
    }

    onOpenChange(nextOpen);
  };

  const onSubmit = (data: UpdateTaskFormData) => {
    updateTaskMutation.mutate(
      {
        taskId: task.id,
        data: {
          ...data,
          dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>

          <DialogDescription>
            Update the details of <strong>{task.title}</strong>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="edit-task-title">Title</label>

            <input
              id="edit-task-title"
              type="text"
              {...form.register("title")}
              disabled={updateTaskMutation.isPending}
              className="w-full rounded-md border bg-background px-3 py-2"
            />

            {form.formState.errors.title && (
              <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="edit-task-description">Description</label>

            <textarea
              id="edit-task-description"
              rows={4}
              {...form.register("description")}
              disabled={updateTaskMutation.isPending}
              className="w-full resize-none rounded-md border bg-background px-3 py-2"
            />

            {form.formState.errors.description && (
              <p className="text-sm text-destructive">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          {/* Priority + Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="edit-task-priority">Priority</label>

              <select
                id="edit-task-priority"
                {...form.register("priority")}
                disabled={updateTaskMutation.isPending}
                className="w-full rounded-md border bg-background px-3 py-2"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>

              {form.formState.errors.priority && (
                <p className="text-sm text-destructive">{form.formState.errors.priority.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-task-type">Type</label>

              <select
                id="edit-task-type"
                {...form.register("type")}
                disabled={updateTaskMutation.isPending}
                className="w-full rounded-md border bg-background px-3 py-2"
              >
                <option value="TASK">Task</option>
                <option value="BUG">Bug</option>
                <option value="FEATURE">Feature</option>
              </select>

              {form.formState.errors.type && (
                <p className="text-sm text-destructive">{form.formState.errors.type.message}</p>
              )}
            </div>
          </div>

          {/* Due date */}
          <div className="space-y-2">
            <label htmlFor="edit-task-due-date">Due date</label>

            <input
              id="edit-task-due-date"
              type="datetime-local"
              {...form.register("dueDate")}
              disabled={updateTaskMutation.isPending}
              className="w-full rounded-md border bg-background px-3 py-2"
            />

            {form.formState.errors.dueDate && (
              <p className="text-sm text-destructive">{form.formState.errors.dueDate.message}</p>
            )}
          </div>

          {/* API error */}
          {updateTaskMutation.isError && (
            <p className="text-sm text-destructive">
              {getApiErrorMessage(updateTaskMutation.error, "Failed to update task.")}
            </p>
          )}

          <DialogFooter>
            <button
              type="button"
              onClick={() => handleOpenChange(false)}
              disabled={updateTaskMutation.isPending}
              className="rounded-md border px-4 py-2 text-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={updateTaskMutation.isPending}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
            >
              {updateTaskMutation.isPending ? "Saving..." : "Save Changes"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
