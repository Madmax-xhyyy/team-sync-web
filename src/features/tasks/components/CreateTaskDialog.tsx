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

import { createTaskSchema, type CreateTaskFormData } from "../schemas/task.schema";

import { useCreateTask } from "../hooks/useCreateTask";

interface CreateTaskDialogProps {
  organizationId: string;
  projectId: string;
  columnId: string;
  columnName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTaskDialog({
  organizationId,
  projectId,
  columnId,
  columnName,
  open,
  onOpenChange,
}: CreateTaskDialogProps) {
  const createTaskMutation = useCreateTask(organizationId, projectId, columnId);

  const form = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "MEDIUM",
      type: "TASK",
    },
  });

  const handleOpenChange = (nextOpen: boolean) => {
    if (createTaskMutation.isPending) {
      return;
    }

    if (!nextOpen) {
      form.reset();
      createTaskMutation.reset();
    }

    onOpenChange(nextOpen);
  };

  const onSubmit = (data: CreateTaskFormData) => {
    createTaskMutation.mutate(data, {
      onSuccess: () => {
        form.reset();
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>

          <DialogDescription>
            Add a task to <strong>{columnName}</strong>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="task-title">Title</label>

            <input
              id="task-title"
              type="text"
              placeholder="Implement login"
              disabled={createTaskMutation.isPending}
              {...form.register("title")}
              className="w-full rounded-md border bg-background px-3 py-2"
            />

            {form.formState.errors.title && (
              <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="task-description">Description</label>

            <textarea
              id="task-description"
              rows={4}
              placeholder="Describe the task..."
              disabled={createTaskMutation.isPending}
              {...form.register("description")}
              className="w-full resize-none rounded-md border bg-background px-3 py-2"
            />

            {form.formState.errors.description && (
              <p className="text-sm text-destructive">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="task-priority">Priority</label>

              <select
                id="task-priority"
                disabled={createTaskMutation.isPending}
                {...form.register("priority")}
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
              <label htmlFor="task-type">Type</label>

              <select
                id="task-type"
                disabled={createTaskMutation.isPending}
                {...form.register("type")}
                className="w-full rounded-md border bg-background px-3 py-2"
              >
                <option value="TASK">Task</option>

                <option value="BUG">Bug</option>

                <option value="FEATURE">Feature</option>

                <option value="CHORE">Chore</option>

                <option value="REFACTOR">Refactor</option>
              </select>

              {form.formState.errors.type && (
                <p className="text-sm text-destructive">{form.formState.errors.type.message}</p>
              )}
            </div>
          </div>

          {createTaskMutation.isError && (
            <p className="text-sm text-destructive">
              {getApiErrorMessage(createTaskMutation.error, "Failed to create task.")}
            </p>
          )}

          <DialogFooter>
            <button
              type="button"
              disabled={createTaskMutation.isPending}
              onClick={() => handleOpenChange(false)}
              className="rounded-md border px-4 py-2 text-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={createTaskMutation.isPending}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
            >
              {createTaskMutation.isPending ? "Creating..." : "Create Task"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
