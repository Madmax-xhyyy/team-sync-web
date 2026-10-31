import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, CheckCircle2, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/features/user/hooks/useCurrentUser";
import { getApiErrorMessage } from "@/lib/api-error";
import { useOrganization } from "../hooks/useOrganization";
import { useOrganizationMembers } from "../hooks/useOrganizationMembers";
import { useUpdateOrganization } from "../hooks/useUpdateOrganization";
import { getCurrentOrganizationMember } from "../utils/organization-permissions";
import {
  updateOrganizationSchema,
  type UpdateOrganizationFormData,
} from "../schemas/organization.schema";
import type { Organization } from "../types/organization.types";

function OrganizationDetailsForm({
  organization,
  canEdit,
}: {
  organization: Organization;
  canEdit: boolean;
}) {
  const mutation = useUpdateOrganization(organization.id);
  const form = useForm<UpdateOrganizationFormData>({
    resolver: zodResolver(updateOrganizationSchema),
    defaultValues: { name: organization.name, description: organization.description ?? "" },
  });
  const { errors, isDirty } = form.formState;
  const submit = (values: UpdateOrganizationFormData) => {
    if (!canEdit || mutation.isPending) return;
    mutation.mutate(values, { onSuccess: () => form.reset(values) });
  };

  return (
    <form
      onSubmit={form.handleSubmit(submit)}
      onChange={() => {
        if (mutation.isSuccess || mutation.isError) mutation.reset();
      }}
      className="overflow-hidden rounded-xl border bg-card"
    >
      <div className="flex items-start gap-3 border-b p-5 sm:p-6">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Building2 className="size-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-lg font-semibold">Organization details</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            The name and description your team sees across TeamSync.
          </p>
        </div>
      </div>
      <div className="space-y-6 p-5 sm:p-6">
        {!canEdit && (
          <p
            role="status"
            className="rounded-lg border bg-muted/50 p-3 text-sm text-muted-foreground"
          >
            Only the organization owner can update these details.
          </p>
        )}
        <fieldset
          disabled={!canEdit || mutation.isPending}
          className="max-w-2xl space-y-6 disabled:opacity-70"
        >
          <div className="space-y-2">
            <label htmlFor="settings-organization-name" className="text-sm font-medium">
              Organization name{" "}
              <span className="text-destructive" aria-hidden="true">
                *
              </span>
            </label>
            <input
              id="settings-organization-name"
              required
              maxLength={100}
              {...form.register("name")}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "settings-name-error" : "settings-name-help"}
              className="block h-14 w-full rounded-lg border bg-background px-4 py-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed"
            />
            {errors.name ? (
              <p id="settings-name-error" role="alert" className="text-xs text-destructive">
                {errors.name.message}
              </p>
            ) : (
              <p id="settings-name-help" className="text-xs text-muted-foreground">
                Use a name your teammates will recognize. 2–100 characters.
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="settings-organization-description" className="text-sm font-medium">
              Description <span className="font-normal text-muted-foreground">(optional)</span>
            </label>
            <textarea
              id="settings-organization-description"
              rows={4}
              maxLength={500}
              {...form.register("description")}
              aria-invalid={Boolean(errors.description)}
              aria-describedby={
                errors.description ? "settings-description-error" : "settings-description-help"
              }
              placeholder="What does your organization work on?"
              className="w-full resize-y rounded-lg border bg-background px-3 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed"
            />
            {errors.description ? (
              <p id="settings-description-error" role="alert" className="text-xs text-destructive">
                {errors.description.message}
              </p>
            ) : (
              <p id="settings-description-help" className="text-xs text-muted-foreground">
                A short introduction to your team. Up to 500 characters.
              </p>
            )}
          </div>
        </fieldset>
        {mutation.isError && (
          <p role="alert" className="text-sm text-destructive">
            {getApiErrorMessage(
              mutation.error,
              "Couldn’t save organization details. Please try again.",
            )}
          </p>
        )}
        {mutation.isSuccess && (
          <p role="status" className="flex items-center gap-2 text-sm text-primary">
            <CheckCircle2 className="size-4" aria-hidden="true" />
            Organization details saved.
          </p>
        )}
      </div>
      {canEdit && (
        <div className="flex flex-wrap items-center justify-end gap-3 border-t bg-muted/20 px-5 py-4 sm:px-6">
          <Button
            type="button"
            variant="outline"
            disabled={!isDirty || mutation.isPending}
            onClick={() => {
              form.reset({ name: organization.name, description: organization.description ?? "" });
              mutation.reset();
            }}
          >
            Discard changes
          </Button>
          <Button type="submit" disabled={!isDirty || mutation.isPending}>
            {mutation.isPending ? "Saving…" : "Save changes"}
          </Button>
        </div>
      )}
    </form>
  );
}

export function OrganizationSettingsPage() {
  const { organizationId = "" } = useParams();
  const organizationQuery = useOrganization(organizationId);
  const membersQuery = useOrganizationMembers(organizationId);
  const userQuery = useCurrentUser();
  const isLoading = organizationQuery.isLoading || membersQuery.isLoading || userQuery.isLoading;
  const isError = organizationQuery.isError || membersQuery.isError || userQuery.isError;
  const canEdit =
    getCurrentOrganizationMember(membersQuery.data ?? [], userQuery.data?.data?.id)?.role ===
    "OWNER";

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-4 sm:py-6">
      <div>
        <div className="mb-3 flex items-center gap-2 text-xs font-medium tracking-widest text-primary uppercase">
          <Settings className="size-4" aria-hidden="true" />
          Workspace preferences
        </div>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Settings</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Manage your organization’s details.
        </p>
      </div>
      {isLoading ? (
        <div
          role="status"
          aria-label="Loading organization settings"
          className="space-y-6 rounded-xl border bg-card p-6"
        >
          <div className="h-6 w-48 animate-pulse rounded bg-muted motion-reduce:animate-none" />
          <div className="h-11 animate-pulse rounded-lg bg-muted motion-reduce:animate-none" />
          <div className="h-28 animate-pulse rounded-lg bg-muted motion-reduce:animate-none" />
        </div>
      ) : isError || !organizationQuery.data ? (
        <div role="alert" className="rounded-xl border bg-card p-8 text-center">
          <h2 className="font-semibold">Couldn’t load organization settings</h2>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              void organizationQuery.refetch();
              void membersQuery.refetch();
              void userQuery.refetch();
            }}
          >
            Try again
          </Button>
        </div>
      ) : (
        <OrganizationDetailsForm
          key={organizationId}
          organization={organizationQuery.data}
          canEdit={canEdit}
        />
      )}
    </div>
  );
}
