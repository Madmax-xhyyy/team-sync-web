import { useState } from "react";

import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useCurrentUser } from "@/features/user/hooks/useCurrentUser";
import { useOrganizationMembers } from "@/features/organizations/hooks/useOrganizationMembers";

import { getCurrentOrganizationMember } from "../utils/organization-permissions";

import { EditOrganizationDialog } from "./EditOrganizationDialog";
import { DeleteOrganizationDialog } from "./DeleteOrganizationDialog";

interface OrganizationHeaderProps {
  organization: {
    id: string;
    name: string;
    description?: string;
  };
}

export function OrganizationHeader({ organization }: OrganizationHeaderProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { data: currentUser, isLoading: isCurrentUserLoading } = useCurrentUser();

  const { data: members = [], isLoading: isMembersLoading } = useOrganizationMembers(
    organization.id,
  );

  if (isCurrentUserLoading || isMembersLoading) {
    return (
      <div className="mb-8">
        <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
      </div>
    );
  }

  const currentMember = getCurrentOrganizationMember(members, currentUser?.data.id);

  const isOwner = currentMember?.role === "OWNER";

  return (
    <>
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{organization.name}</h1>

          {organization.description && (
            <p className="mt-2 text-sm text-muted-foreground">{organization.description}</p>
          )}
        </div>

        {isOwner && (
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={() => setEditOpen(true)}>
              Edit Organization
            </Button>

            <Button type="button" variant="destructive" onClick={() => setDeleteOpen(true)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        )}
      </div>

      {isOwner && (
        <>
          <EditOrganizationDialog
            organizationId={organization.id}
            name={organization.name}
            description={organization.description}
            open={editOpen}
            onOpenChange={setEditOpen}
          />

          <DeleteOrganizationDialog
            organizationId={organization.id}
            organizationName={organization.name}
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
          />
        </>
      )}
    </>
  );
}
