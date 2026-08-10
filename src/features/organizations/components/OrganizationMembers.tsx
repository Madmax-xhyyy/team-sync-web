import { useState } from "react";
import { useParams } from "react-router-dom";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import { getApiErrorMessage } from "@/lib/api-error";

import { useCurrentUser } from "@/features/user/hooks/useCurrentUser";
import { useOrganizationMembers } from "@/features/organizations/hooks/useOrganizationMembers";
import { useUpdateMemberRole } from "@/features/organizations/hooks/useUpdateMemberRole";

import type { OrganizationMember, OrganizationRole } from "../types/member.types";

import {
  canAssignRole,
  canManageMembers,
  canRemoveMember,
  canUpdateMemberRole,
  getCurrentOrganizationMember,
} from "../utils/organization-permissions";

import { AddMemberDialog } from "./AddMemberDialog";
import { RemoveMemberDialog } from "./RemoveMemberDialog";

export function OrganizationMembers() {
  const { organizationId = "" } = useParams();

  const [memberToRemove, setMemberToRemove] = useState<OrganizationMember | null>(null);

  const {
    data: members = [],
    isLoading: isMembersLoading,
    isError: isMembersError,
  } = useOrganizationMembers(organizationId);

  const {
    data: currentUser,
    isLoading: isCurrentUserLoading,
    isError: isCurrentUserError,
  } = useCurrentUser();

  const updateRoleMutation = useUpdateMemberRole(organizationId);

  if (isMembersLoading || isCurrentUserLoading) {
    return <div>Loading members...</div>;
  }

  if (isMembersError || isCurrentUserError) {
    return <div>Failed to load members.</div>;
  }

  const currentUserId = currentUser?.data.id;

  const currentMember = getCurrentOrganizationMember(members, currentUserId);

  const currentRole = currentMember?.role;

  const canManage = canManageMembers(currentRole);

  return (
    <section className="rounded-xl border">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-6">
        <div>
          <h2 className="text-lg font-semibold">Members</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            People who belong to this organization.
          </p>
        </div>

        {canManage && <AddMemberDialog currentRole={currentRole} />}
      </div>

      {/* Role update error */}
      {updateRoleMutation.isError && (
        <div className="border-b px-6 py-3 text-sm text-destructive">
          {getApiErrorMessage(updateRoleMutation.error, "Failed to update member role.")}
        </div>
      )}

      {/* Members */}
      <div className="divide-y">
        {members.length === 0 ? (
          <div className="p-6 text-sm text-muted-foreground">No members found.</div>
        ) : (
          members.map((member) => {
            const canEditRole = canUpdateMemberRole(currentRole, member.role);

            const canRemove = canRemoveMember(
              currentRole,
              member.role,
              currentUserId,
              member.userId,
            );

            return (
              <div key={member.id} className="flex items-center justify-between gap-4 p-6">
                {/* Member information */}
                <div className="min-w-0">
                  <p className="font-medium">
                    {member.firstName} {member.lastName}
                  </p>

                  <p className="truncate text-sm text-muted-foreground">{member.email}</p>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-3">
                  {member.role === "OWNER" ? (
                    <span className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium">
                      OWNER
                    </span>
                  ) : (
                    <>
                      {/* Role selector */}
                      {canEditRole && (
                        <select
                          value={member.role}
                          disabled={updateRoleMutation.isPending}
                          onChange={(event) => {
                            const newRole = event.target.value as OrganizationRole;

                            if (!canAssignRole(currentRole, member.role, newRole)) {
                              return;
                            }

                            if (newRole === member.role) {
                              return;
                            }

                            updateRoleMutation.mutate({
                              memberId: member.id,
                              role: newRole,
                            });
                          }}
                          className="rounded-md border bg-background px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                          aria-label={`Change role for ${member.firstName} ${member.lastName}`}
                        >
                          <option value="MEMBER">Member</option>

                          {currentRole === "OWNER" && <option value="ADMIN">Admin</option>}

                          <option value="GUEST">Guest</option>
                        </select>
                      )}

                      {/* Read-only role */}
                      {!canEditRole && (
                        <span className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium">
                          {member.role}
                        </span>
                      )}

                      {/* Remove */}
                      {canRemove && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => setMemberToRemove(member)}
                          aria-label={`Remove ${member.firstName} ${member.lastName}`}
                          title={`Remove ${member.firstName} ${member.lastName}`}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Remove confirmation */}
      {memberToRemove && (
        <RemoveMemberDialog
          organizationId={organizationId}
          memberId={memberToRemove.id}
          memberName={`${memberToRemove.firstName} ${memberToRemove.lastName}`}
          open={Boolean(memberToRemove)}
          onOpenChange={(open) => {
            if (!open) {
              setMemberToRemove(null);
            }
          }}
        />
      )}
    </section>
  );
}
