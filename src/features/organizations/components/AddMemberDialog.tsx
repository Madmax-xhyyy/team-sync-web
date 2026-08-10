import { useState } from "react";
import { useParams } from "react-router-dom";

import { getApiErrorMessage } from "@/lib/api-error";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { addMemberSchema, type AddMemberFormData } from "../schemas/member.schema";
import { addOrganizationMember } from "../api/members.api";

export function AddMemberDialog() {
  const [open, setOpen] = useState(false);

  const { organizationId = "" } = useParams();

  const queryClient = useQueryClient();

  const form = useForm<AddMemberFormData>({
    resolver: zodResolver(addMemberSchema),
    defaultValues: {
      email: "",
      role: "MEMBER",
    },
  });

  const addMemberMutation = useMutation({
    mutationFn: (data: AddMemberFormData) => addOrganizationMember(organizationId, data),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["organization-members", organizationId],
      });

      form.reset();
      setOpen(false);
    },
  });

  const onSubmit = (data: AddMemberFormData) => {
    addMemberMutation.mutate(data);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (addMemberMutation.isPending) {
      return;
    }

    setOpen(nextOpen);

    if (!nextOpen) {
      form.reset();
      addMemberMutation.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
        Add Member
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>

          <DialogDescription>Add a user to this organization.</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="member-email">Email</label>

            <input
              id="member-email"
              type="email"
              autoComplete="email"
              placeholder="example@gmail.com"
              {...form.register("email")}
              className="w-full rounded-md border px-3 py-2"
              disabled={addMemberMutation.isPending}
            />

            {form.formState.errors.email && (
              <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="member-role">Role</label>

            <select
              id="member-role"
              {...form.register("role")}
              className="w-full rounded-md border bg-background px-3 py-2"
              disabled={addMemberMutation.isPending}
            >
              <option value="MEMBER">Member</option>
              <option value="ADMIN">Admin</option>
            </select>

            {form.formState.errors.role && (
              <p className="text-sm text-destructive">{form.formState.errors.role.message}</p>
            )}
          </div>

          {addMemberMutation.isError && (
            <p className="text-sm text-destructive">
              {getApiErrorMessage(addMemberMutation.error, "Failed to add member.")}
            </p>
          )}

          <DialogFooter>
            <button
              type="button"
              onClick={() => handleOpenChange(false)}
              disabled={addMemberMutation.isPending}
              className="rounded-md border px-4 py-2 text-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={addMemberMutation.isPending}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
            >
              {addMemberMutation.isPending ? "Adding..." : "Add Member"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
