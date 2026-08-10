import { useState } from "react";
import { useParams } from "react-router-dom";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
        queryKey: ["organization", organizationId, "members"],
      });

      form.reset();
      setOpen(false);
    },
  });

  const onSubmit = (data: AddMemberFormData) => {
    addMemberMutation.mutate(data);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
      >
        Add Member
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-background p-6 shadow-lg">
            <div className="mb-6">
              <h2 className="text-lg font-semibold">Add Member</h2>

              <p className="mt-1 text-sm text-muted-foreground">Add a user to this organization.</p>
            </div>

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
                >
                  <option value="MEMBER">Member</option>

                  <option value="ADMIN">Admin</option>
                </select>

                {form.formState.errors.role && (
                  <p className="text-sm text-destructive">{form.formState.errors.role.message}</p>
                )}
              </div>

              {addMemberMutation.isError && (
                <p className="text-sm text-destructive">Failed to add member.</p>
              )}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    form.reset();
                    setOpen(false);
                  }}
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
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
