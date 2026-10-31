import { useState } from "react";
import { useParams } from "react-router-dom";
import { AlertCircle, Search, ShieldCheck, Trash2, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api-error";
import { useCurrentUser } from "@/features/user/hooks/useCurrentUser";
import { useOrganizationMembers } from "../hooks/useOrganizationMembers";
import { useUpdateMemberRole } from "../hooks/useUpdateMemberRole";
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

const roles: OrganizationRole[] = ["OWNER", "ADMIN", "MEMBER", "GUEST"];
const roleLabel = (role: OrganizationRole) => role.charAt(0) + role.slice(1).toLowerCase();

export function OrganizationMembers() {
  const { organizationId = "" } = useParams();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [memberToRemove, setMemberToRemove] = useState<OrganizationMember | null>(null);
  const membersQuery = useOrganizationMembers(organizationId);
  const userQuery = useCurrentUser();
  const updateRoleMutation = useUpdateMemberRole(organizationId);
  const members = membersQuery.data ?? [];
  const currentUserId = userQuery.data?.data?.id;
  const currentRole = getCurrentOrganizationMember(members, currentUserId)?.role;
  const keyword = search.trim().toLocaleLowerCase();
  const visibleMembers = members
    .filter(
      (member) =>
        (roleFilter === "all" || member.role === roleFilter) &&
        `${member.firstName} ${member.lastName} ${member.email}`
          .toLocaleLowerCase()
          .includes(keyword),
    )
    .sort((a, b) => a.firstName.localeCompare(b.firstName) || a.lastName.localeCompare(b.lastName));

  if (membersQuery.isLoading || userQuery.isLoading) {
    return (
      <div
        role="status"
        aria-label="Loading team members"
        className="overflow-hidden rounded-xl border bg-card"
      >
        {Array.from({ length: 5 }, (_, index) => (
          <div
            key={index}
            aria-hidden="true"
            className="flex items-center gap-4 border-b p-5 last:border-0"
          >
            <div className="size-10 animate-pulse rounded-full bg-muted motion-reduce:animate-none" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 animate-pulse rounded bg-muted motion-reduce:animate-none" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-muted motion-reduce:animate-none" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (membersQuery.isError || userQuery.isError) {
    return (
      <div role="alert" className="rounded-xl border bg-card p-12 text-center">
        <AlertCircle className="mx-auto mb-4 size-8 text-destructive" aria-hidden="true" />
        <h2 className="font-semibold">Couldn’t load team members</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Try again to view your team and their access.
        </p>
        <Button
          className="mt-5"
          variant="outline"
          onClick={() => {
            void membersQuery.refetch();
            void userQuery.refetch();
          }}
        >
          Try again
        </Button>
      </div>
    );
  }

  return (
    <section aria-label="Team members" className="overflow-hidden rounded-xl border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b p-5 sm:p-6">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            Members{" "}
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {members.length}
            </span>
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            The people and roles in your organization.
          </p>
        </div>
        {canManageMembers(currentRole) && <AddMemberDialog currentRole={currentRole} />}
      </div>
      <div className="flex flex-col gap-3 border-b bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            type="search"
            aria-label="Search team members"
            placeholder="Search by name or email…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-10 w-full rounded-lg border bg-background pr-3 pl-9 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div className="flex items-center gap-3">
          <ShieldCheck className="size-4 text-muted-foreground" aria-hidden="true" />
          <select
            aria-label="Filter by role"
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
            className="h-10 flex-1 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring sm:min-w-36"
          >
            <option value="all">All roles</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {roleLabel(role)}
              </option>
            ))}
          </select>
        </div>
      </div>
      {updateRoleMutation.isError && (
        <div role="alert" className="border-b px-6 py-3 text-sm text-destructive">
          {getApiErrorMessage(updateRoleMutation.error, "Failed to update member role.")}
        </div>
      )}
      <ul className="divide-y">
        {visibleMembers.map((member) => {
          const name = `${member.firstName} ${member.lastName}`;
          const canEdit = canUpdateMemberRole(currentRole, member.role);
          const canRemove = canRemoveMember(currentRole, member.role, currentUserId, member.userId);
          return (
            <li
              key={member.id}
              className="flex flex-col justify-between gap-4 p-5 transition-colors hover:bg-muted/30 sm:flex-row sm:items-center sm:px-6"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary"
                >
                  {member.firstName.charAt(0).toUpperCase()}
                  {member.lastName.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2 text-sm font-medium">
                    <span className="break-words">{name}</span>
                    {member.userId === currentUserId && (
                      <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                        You
                      </span>
                    )}
                  </p>
                  <p className="truncate text-sm text-muted-foreground" title={member.email}>
                    {member.email}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-3 pl-13 sm:pl-0">
                {canEdit ? (
                  <select
                    value={member.role}
                    disabled={updateRoleMutation.isPending}
                    onChange={(event) => {
                      const role = event.target.value as OrganizationRole;
                      if (role !== member.role && canAssignRole(currentRole, member.role, role))
                        updateRoleMutation.mutate({ memberId: member.id, role });
                    }}
                    className="rounded-lg border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-wait disabled:opacity-50"
                    aria-label={`Change role for ${name}`}
                  >
                    <option value="MEMBER">Member</option>
                    {currentRole === "OWNER" && <option value="ADMIN">Admin</option>}
                    <option value="GUEST">Guest</option>
                  </select>
                ) : (
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${member.role === "OWNER" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
                  >
                    {roleLabel(member.role)}
                  </span>
                )}
                {canRemove && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setMemberToRemove(member)}
                    aria-label={`Remove ${name}`}
                    title={`Remove ${name}`}
                  >
                    <Trash2 className="size-4 text-destructive" aria-hidden="true" />
                  </Button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      {visibleMembers.length === 0 && (
        <div className="px-6 py-14 text-center">
          <UsersRound className="mx-auto mb-4 size-8 text-muted-foreground" aria-hidden="true" />
          <h3 className="font-semibold">
            {members.length ? "No matching members" : "No members yet"}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {members.length
              ? "Try another name, email, or role."
              : "Your organization’s members will appear here."}
          </p>
          {(search || roleFilter !== "all") && (
            <Button
              className="mt-4"
              variant="outline"
              onClick={() => {
                setSearch("");
                setRoleFilter("all");
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      )}
      <div role="status" className="border-t px-6 py-3 text-xs text-muted-foreground">
        Showing {visibleMembers.length} of {members.length} members
      </div>
      {memberToRemove && (
        <RemoveMemberDialog
          organizationId={organizationId}
          memberId={memberToRemove.id}
          memberName={`${memberToRemove.firstName} ${memberToRemove.lastName}`}
          open
          onOpenChange={(open) => {
            if (!open) setMemberToRemove(null);
          }}
        />
      )}
    </section>
  );
}
