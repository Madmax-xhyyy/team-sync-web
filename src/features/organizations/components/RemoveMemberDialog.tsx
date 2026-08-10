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

import { useRemoveOrganizationMember } from "@/hooks/useRemoveOrganizationMember";

interface RemoveMemberDialogProps {
  organizationId: string;
  memberId: string;
  memberName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RemoveMemberDialog({
  organizationId,
  memberId,
  memberName,
  open,
  onOpenChange,
}: RemoveMemberDialogProps) {
  const removeMemberMutation = useRemoveOrganizationMember(organizationId);

  const handleRemove = () => {
    removeMemberMutation.mutate(memberId, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove member?</AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to remove <span className="font-medium">{memberName}</span> from
            this organization?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={removeMemberMutation.isPending}>Cancel</AlertDialogCancel>

          <AlertDialogAction
            disabled={removeMemberMutation.isPending}
            onClick={(event) => {
              event.preventDefault();
              handleRemove();
            }}
            variant="destructive"
          >
            {removeMemberMutation.isPending ? "Removing..." : "Remove"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
