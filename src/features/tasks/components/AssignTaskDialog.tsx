import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { getApiErrorMessage } from "@/lib/api-error";

import { useOrganizationMembers } from "@/features/organizations/hooks/useOrganizationMembers";
import type { OrganizationMember } from "@/features/organizations/types/member.types";

import { useAssignTask } from "../hooks/useAssignTask";
import { useUnassignTask } from "../hooks/useUnassignTask";
import type { Task } from "../types/task.types";

interface AssignTaskDialogProps {
  organizationId: string;
  projectId: string;
  columnId: string;
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AssignTaskDialog({
  organizationId,
  projectId,
  columnId,
  task,
  open,
  onOpenChange,
}: AssignTaskDialogProps) {
  // This is the USER ID that will be sent to the backend.
  const [selectedUserId, setSelectedUserId] = useState(task.assigneeId ?? "");

  const {
    data: members = [],
    isLoading: isMembersLoading,
    isError: isMembersError,
  } = useOrganizationMembers(organizationId);

  const assignMutation = useAssignTask(organizationId, projectId, columnId);

  const unassignMutation = useUnassignTask(organizationId, projectId, columnId);

  const isPending = assignMutation.isPending || unassignMutation.isPending;

  const handleOpenChange = (nextOpen: boolean) => {
    if (isPending) {
      return;
    }

    if (!nextOpen) {
      assignMutation.reset();
      unassignMutation.reset();

      setSelectedUserId(task.assigneeId ?? "");
    }

    onOpenChange(nextOpen);
  };

  const handleSave = () => {
    /**
     * Empty selection means:
     * remove the current assignee.
     */
    if (!selectedUserId) {
      unassignMutation.mutate(task.id, {
        onSuccess: () => {
          onOpenChange(false);
        },
      });

      return;
    }

    /**
     * Backend expects:
     *
     * {
     *   userId: "..."
     * }
     */
    assignMutation.mutate(
      {
        taskId: task.id,
        userId: selectedUserId,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  const error = assignMutation.error ?? unassignMutation.error;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Task</DialogTitle>

          <DialogDescription>
            Choose a member to assign to <strong>{task.title}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <label htmlFor="task-assignee" className="text-sm font-medium">
            Assignee
          </label>

          {isMembersLoading ? (
            <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
          ) : isMembersError ? (
            <p className="text-sm text-destructive">Failed to load organization members.</p>
          ) : (
            <select
              id="task-assignee"
              value={selectedUserId}
              disabled={isPending}
              onChange={(event) => setSelectedUserId(event.target.value)}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            >
              <option value="">Unassigned</option>

              {members.map((member: OrganizationMember) => (
                <option key={member.userId} value={member.userId}>
                  {member.firstName} {member.lastName} ({member.email})
                </option>
              ))}
            </select>
          )}
        </div>

        {selectedUserId ? (
          <p className="text-xs text-muted-foreground">
            This task will be assigned to the selected organization member.
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Selecting "Unassigned" will remove the current assignee.
          </p>
        )}

        {error && (
          <p className="text-sm text-destructive">
            {getApiErrorMessage(error, "Failed to update task assignee.")}
          </p>
        )}

        <DialogFooter>
          <button
            type="button"
            disabled={isPending}
            onClick={() => handleOpenChange(false)}
            className="rounded-md border px-4 py-2 text-sm"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isPending || isMembersLoading || isMembersError}
            onClick={handleSave}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
