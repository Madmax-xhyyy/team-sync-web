import { useParams } from "react-router-dom";
import { useState } from "react";
import { Trash2 } from "lucide-react";

import { useOrganizationMembers } from "@/hooks/useOrganizationMembers";
import { useUpdateMemberRole } from "@/hooks/useUpdateMemberRole";

import type { OrganizationRole, OrganizationMember } from "../types/member.types";

import { AddMemberDialog } from "./AddMemberDialog";
import { RemoveMemberDialog } from "./RemoveMemberDialog";
import { useRemoveOrganizationMember } from "@/hooks/useRemoveOrganizationMember";

export function OrganizationMembers() {
  const { organizationId = "" } = useParams();

  const { data: members = [], isLoading, isError } = useOrganizationMembers(organizationId);

  const [memberToRemove, setMemberToRemove] = useState<OrganizationMember | null>(null);

  const updateRoleMutation = useUpdateMemberRole(organizationId);

  const removeMemberMutation = useRemoveOrganizationMember(organizationId);

  if (isLoading) {
    return <div>Loading members...</div>;
  }

  if (isError) {
    return <div>Failed to load members.</div>;
  }

  return (
    <section className="mt-8 rounded-xl border">
      <div className="flex items-center justify-between gap-4 border-b p-6">
        <div>
          <h2 className="font-semibold">Members</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            People who belong to this organization.
          </p>
        </div>

        <AddMemberDialog />
      </div>

      <div className="divide-y">
        {members.length === 0 ? (
          <div className="p-6 text-sm text-muted-foreground">No members found.</div>
        ) : (
          members.map((member) => (
            <div key={member.id} className="flex items-center justify-between gap-4 p-6">
              <div>
                <p className="font-medium">
                  {member.firstName} {member.lastName}
                </p>

                <p className="text-sm text-muted-foreground">{member.email}</p>
              </div>

              <div className="flex items-center gap-3">
                {member.role === "OWNER" ? (
                  <span className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium">OWNER</span>
                ) : (
                  <>
                    <select
                      value={member.role}
                      disabled={updateRoleMutation.isPending}
                      onChange={(event) => {
                        updateRoleMutation.mutate({
                          memberId: member.id,
                          role: event.target.value as OrganizationRole,
                        });
                      }}
                      className="rounded-md border bg-background px-3 py-1.5 text-sm"
                    >
                      <option value="MEMBER">Member</option>
                      <option value="ADMIN">Admin</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => setMemberToRemove(member)}
                      className="rounded-md border p-2 text-destructive hover:bg-destructive/10"
                      aria-label={`Remove ${member.firstName} ${member.lastName}`}
                      title={`Remove ${member.firstName} ${member.lastName}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
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
