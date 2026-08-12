import { useState } from "react";
import { useParams } from "react-router-dom";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { getApiErrorMessage } from "@/lib/api-error";

import { createProjectSchema, type CreateProjectFormData } from "../schemas/project.schema";

import { useCreateProject } from "../hooks/useCreateProject";

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateProjectDialog({ open, onOpenChange }: CreateProjectDialogProps) {
  const { organizationId = "" } = useParams();

  const createProjectMutation = useCreateProject(organizationId);

  const form = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const handleOpenChange = (nextOpen: boolean) => {
    if (createProjectMutation.isPending) {
      return;
    }

    onOpenChange(nextOpen);

    if (!nextOpen) {
      form.reset();
      createProjectMutation.reset();
    }
  };

  const onSubmit = (data: CreateProjectFormData) => {
    createProjectMutation.mutate(data, {
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
          <DialogTitle>Create Project</DialogTitle>

          <DialogDescription>Create a new project inside this organization.</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="project-name">Name</label>

            <input
              id="project-name"
              type="text"
              placeholder="Website Redesign"
              autoComplete="off"
              disabled={createProjectMutation.isPending}
              {...form.register("name")}
              className="w-full rounded-md border bg-background px-3 py-2"
            />

            {form.formState.errors.name && (
              <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="project-description">Description</label>

            <textarea
              id="project-description"
              placeholder="Describe what this project is about..."
              rows={4}
              disabled={createProjectMutation.isPending}
              {...form.register("description")}
              className="w-full resize-none rounded-md border bg-background px-3 py-2"
            />

            {form.formState.errors.description && (
              <p className="text-sm text-destructive">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          {createProjectMutation.isError && (
            <p className="text-sm text-destructive">
              {getApiErrorMessage(createProjectMutation.error, "Failed to create project.")}
            </p>
          )}

          <DialogFooter>
            <button
              type="button"
              onClick={() => handleOpenChange(false)}
              disabled={createProjectMutation.isPending}
              className="rounded-md border px-4 py-2 text-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={createProjectMutation.isPending}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
            >
              {createProjectMutation.isPending ? "Creating..." : "Create Project"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
