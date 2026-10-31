import { useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createOrganizationSchema,
  type CreateOrganizationFormValues,
} from "../schemas/organization.schema";

import { createOrganization } from "../api/organizations.api";

export function CreateOrganizationDialog() {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const form = useForm<CreateOrganizationFormValues>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: createOrganization,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["organizations", "my"],
      });

      form.reset();
      setOpen(false);
    },
  });

  const onSubmit = (values: CreateOrganizationFormValues) => {
    createMutation.mutate(values);
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        Create Organization
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay p-4">
          <div className="w-full max-w-md rounded-xl bg-background p-6 shadow-lg">
            <div className="mb-6">
              <h2 className="text-lg font-semibold">Create Organization</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Create a workspace for your team.
              </p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="organization-name" className="text-sm font-medium">
                  Name
                </label>

                <input
                  id="organization-name"
                  {...form.register("name")}
                  placeholder="Acme Inc."
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2"
                />

                {form.formState.errors.name && (
                  <p className="mt-1 text-sm text-destructive">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="organization-description" className="text-sm font-medium">
                  Description
                </label>

                <textarea
                  id="organization-description"
                  {...form.register("description")}
                  placeholder="What is this organization for?"
                  rows={4}
                  className="mt-1 w-full resize-none rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2"
                />

                {form.formState.errors.description && (
                  <p className="mt-1 text-sm text-destructive">
                    {form.formState.errors.description.message}
                  </p>
                )}
              </div>

              {createMutation.isError && (
                <p className="text-sm text-destructive">Failed to create organization.</p>
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
                  disabled={createMutation.isPending}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
                >
                  {createMutation.isPending ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
