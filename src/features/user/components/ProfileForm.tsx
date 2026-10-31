import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, LoaderCircle, Save } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getApiErrorMessage } from "@/lib/api-error";

import { useUpdateProfile } from "../hooks/useUpdateProfile";
import { updateProfileSchema, type UpdateProfileFormData } from "../schemas/user.schema";
import type { UserProfile } from "../types/user.types";

interface ProfileFormProps {
  user: UserProfile;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const updateMutation = useUpdateProfile();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { firstName: user.firstName, lastName: user.lastName },
  });

  const onSubmit = (data: UpdateProfileFormData) => {
    if (updateMutation.isPending || !isDirty) return;

    updateMutation.mutate(data, {
      onSuccess: (response) => {
        reset({ firstName: response.data.firstName, lastName: response.data.lastName });
      },
    });
  };

  const discardChanges = () => {
    reset({ firstName: user.firstName, lastName: user.lastName });
    updateMutation.reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onChange={() => {
        if (!updateMutation.isPending) updateMutation.reset();
      }}
      noValidate
      aria-busy={updateMutation.isPending}
      className="rounded-xl border bg-card"
    >
      <div className="border-b px-6 py-5">
        <h2 className="font-semibold">Personal information</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Keep your name up to date so your teammates can recognize you.
        </p>
      </div>

      <fieldset disabled={updateMutation.isPending} className="space-y-6 p-6">
        <legend className="sr-only">Profile details</legend>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="profile-first-name" className="text-sm font-medium">
              First name
            </label>
            <Input
              id="profile-first-name"
              autoComplete="given-name"
              maxLength={50}
              required
              aria-invalid={!!errors.firstName}
              aria-describedby={errors.firstName ? "profile-first-name-error" : undefined}
              {...register("firstName")}
              className="h-10"
            />
            {errors.firstName && (
              <p id="profile-first-name-error" className="text-sm text-destructive">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="profile-last-name" className="text-sm font-medium">
              Last name
            </label>
            <Input
              id="profile-last-name"
              autoComplete="family-name"
              maxLength={50}
              required
              aria-invalid={!!errors.lastName}
              aria-describedby={errors.lastName ? "profile-last-name-error" : undefined}
              {...register("lastName")}
              className="h-10"
            />
            {errors.lastName && (
              <p id="profile-last-name-error" className="text-sm text-destructive">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="profile-email" className="text-sm font-medium">
            Email address
          </label>
          <Input
            id="profile-email"
            type="email"
            value={user.email}
            readOnly
            aria-describedby="profile-email-hint"
            className="h-10 bg-muted/50 text-muted-foreground"
          />
          <p id="profile-email-hint" className="text-xs text-muted-foreground">
            Your email is used to sign in and cannot be changed here.
          </p>
        </div>
      </fieldset>

      <div className="px-6" aria-live="polite" aria-atomic="true">
        {updateMutation.isSuccess && (
          <p role="status" className="mb-5 flex items-center gap-2 text-sm">
            <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />
            Your profile has been updated.
          </p>
        )}
        {updateMutation.isError && (
          <p
            role="alert"
            className="mb-5 rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive"
          >
            {getApiErrorMessage(
              updateMutation.error,
              updateMutation.error instanceof Error
                ? updateMutation.error.message
                : "Unable to update your profile. Please try again.",
            )}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t px-6 py-4">
        <p className="text-xs text-muted-foreground">
          {isDirty ? "You have unsaved changes." : "Your profile is up to date."}
        </p>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={!isDirty || updateMutation.isPending}
            onClick={discardChanges}
          >
            Discard changes
          </Button>
          <Button type="submit" disabled={!isDirty || updateMutation.isPending}>
            {updateMutation.isPending ? (
              <LoaderCircle className="animate-spin" aria-hidden="true" />
            ) : (
              <Save aria-hidden="true" />
            )}
            {updateMutation.isPending ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </div>
    </form>
  );
}
