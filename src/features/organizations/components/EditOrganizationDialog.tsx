import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { useUpdateOrganization } from "../hooks/useUpdateOrganization";

import {
  updateOrganizationSchema,
  type UpdateOrganizationFormData,
} from "../schemas/organization.schema";
import { getApiErrorMessage } from "@/lib/api-error";

interface EditOrganizationDialogProps {
  organizationId: string;
  name: string;
  description?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditOrganizationDialog({
  organizationId,
  name,
  description = "",
  open,
  onOpenChange,
}: EditOrganizationDialogProps) {
  const updateMutation = useUpdateOrganization(organizationId);

  const form = useForm<UpdateOrganizationFormData>({
    resolver: zodResolver(updateOrganizationSchema),
    defaultValues: {
      name,
      description,
    },
  });

  const onSubmit = (data: UpdateOrganizationFormData) => {
    updateMutation.mutate(data, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (updateMutation.isPending) {
      return;
    }

    onOpenChange(nextOpen);

    if (!nextOpen) {
      form.reset({
        name,
        description,
      });

      updateMutation.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Organization</DialogTitle>

          <DialogDescription>Update your organization information.</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="organization-name">Name</label>

            <input
              id="organization-name"
              type="text"
              {...form.register("name")}
              disabled={updateMutation.isPending}
              className="w-full rounded-md border px-3 py-2"
            />

            {form.formState.errors.name && (
              <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="organization-description">Description</label>

            <textarea
              id="organization-description"
              rows={4}
              {...form.register("description")}
              disabled={updateMutation.isPending}
              className="w-full resize-none rounded-md border px-3 py-2"
            />

            {form.formState.errors.description && (
              <p className="text-sm text-destructive">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          {updateMutation.isError && (
            <p className="text-sm text-destructive">
              {getApiErrorMessage(updateMutation.error, "Failed to update organization.")}
            </p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={updateMutation.isPending}
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
