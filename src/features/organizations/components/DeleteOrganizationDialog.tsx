import { getApiErrorMessage } from "@/lib/api-error";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useDeleteOrganization } from "../hooks/useDeleteOrganization";

interface DeleteOrganizationDialogProps {
  organizationId: string;
  organizationName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteOrganizationDialog({
  organizationId,
  organizationName,
  open,
  onOpenChange,
}: DeleteOrganizationDialogProps) {
  const deleteMutation = useDeleteOrganization();

  const handleDelete = () => {
    deleteMutation.mutate(organizationId);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (deleteMutation.isPending) {
      return;
    }

    onOpenChange(nextOpen);

    if (!nextOpen) {
      deleteMutation.reset();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete organization?</AlertDialogTitle>

          <AlertDialogDescription>
            This will permanently delete <span className="font-medium">{organizationName}</span>.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {deleteMutation.isError && (
          <p className="text-sm text-destructive">
            {getApiErrorMessage(deleteMutation.error, "Failed to delete organization.")}
          </p>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>

          <AlertDialogAction
            disabled={deleteMutation.isPending}
            onClick={(event) => {
              event.preventDefault();
              handleDelete();
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete Organization"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
