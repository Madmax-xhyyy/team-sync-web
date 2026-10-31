import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNow } from "@/hooks/use-now";

import type { OrganizationMember } from "@/features/organizations/types/member.types";

import type { Task } from "../types/task.types";

interface TaskDetailsDialogProps {
  task: Task;
  members: OrganizationMember[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TaskDetailsDialog({ task, members, open, onOpenChange }: TaskDetailsDialogProps) {
  const assignee = task.assigneeId
    ? members.find((member) => member.userId === task.assigneeId)
    : undefined;

  const reporter = members.find((member) => member.userId === task.reporterId);

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatDueDate = (date: string) => {
    return new Date(date).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const now = useNow();
  const isOverdue = task.dueDate !== null && new Date(task.dueDate).getTime() < now;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-xl overflow-hidden p-0">
        <div className="max-h-[85vh] overflow-y-auto">
          {/* Header */}
          <DialogHeader className="border-b px-6 py-5">
            <DialogTitle className="break-words text-lg font-semibold">{task.title}</DialogTitle>

            <DialogDescription>Task details</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 p-6">
            {/* Description */}
            <section className="min-w-0 space-y-2">
              <h3 className="text-sm font-semibold">Description</h3>

              <div className="min-w-0 max-w-full rounded-lg border bg-muted/20 p-3">
                {task.description ? (
                  <p className="whitespace-pre-wrap break-words text-sm leading-6 text-muted-foreground">
                    {task.description}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">No description provided.</p>
                )}
              </div>
            </section>

            {/* Details */}
            <section className="space-y-2">
              <h3 className="text-sm font-semibold">Details</h3>

              <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
                {/* Priority */}
                <div className="min-w-0 rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Priority</p>

                  <p className="mt-1 text-sm font-medium">{task.priority}</p>
                </div>

                {/* Type */}
                <div className="min-w-0 rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Type</p>

                  <p className="mt-1 text-sm font-medium">{task.type}</p>
                </div>

                {/* Assignee */}
                <div className="min-w-0 rounded-lg border p-3 sm:col-span-2">
                  <p className="text-xs text-muted-foreground">Assignee</p>

                  {assignee ? (
                    <div className="mt-2 flex min-w-0 items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        {assignee.firstName.charAt(0)}
                        {assignee.lastName.charAt(0)}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {assignee.firstName} {assignee.lastName}
                        </p>

                        <p className="truncate text-xs text-muted-foreground">{assignee.email}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-1 text-sm text-muted-foreground">Unassigned</p>
                  )}
                </div>

                {/* Due date */}
                {task.dueDate && (
                  <div className="min-w-0 rounded-lg border p-3 sm:col-span-2">
                    <p className="text-xs text-muted-foreground">Due date</p>

                    <p
                      className={[
                        "mt-1 break-words text-sm font-medium",
                        isOverdue ? "text-destructive" : "text-foreground",
                      ].join(" ")}
                    >
                      {formatDueDate(task.dueDate)}

                      {isOverdue && <span className="ml-2 text-xs font-normal">(Overdue)</span>}
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Activity */}
            <section className="space-y-2">
              <h3 className="text-sm font-semibold">Activity</h3>

              <div className="divide-y rounded-lg border">
                {/* Created */}
                <div className="min-w-0 p-3">
                  <p className="text-xs text-muted-foreground">Created</p>

                  <p className="mt-1 break-words text-sm">{formatDateTime(task.createdAt)}</p>

                  {reporter && (
                    <p className="mt-1 break-words text-xs text-muted-foreground">
                      by {reporter.firstName} {reporter.lastName}
                    </p>
                  )}
                </div>

                {/* Updated */}
                <div className="min-w-0 p-3">
                  <p className="text-xs text-muted-foreground">Last updated</p>

                  <p className="mt-1 break-words text-sm">{formatDateTime(task.updatedAt)}</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
