import { LoaderCircle, Mail, ShieldCheck, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api-error";

import { ProfileForm } from "../components/ProfileForm";
import { useCurrentUser } from "../hooks/useCurrentUser";

export function ProfilePage() {
  const { data, isPending, isError, error, refetch, isFetching } = useCurrentUser();
  const user = data?.success ? data.data : undefined;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <p className="mb-2 text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Account
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">My profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your personal information and how you appear in TeamSync.
        </p>
      </div>

      {isPending ? (
        <div role="status" className="flex items-center gap-2 rounded-xl border p-6 text-sm">
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          Loading your profile...
        </div>
      ) : !user ? (
        <div role="alert" className="space-y-4 rounded-xl border p-6">
          <p className="text-sm text-destructive">
            {isError
              ? getApiErrorMessage(error, "Unable to load your profile. Please try again.")
              : data?.message || "Unable to load your profile. Please try again."}
          </p>
          <Button variant="outline" disabled={isFetching} onClick={() => void refetch()}>
            {isFetching ? "Retrying..." : "Try again"}
          </Button>
        </div>
      ) : (
        <>
          <section aria-label="Profile overview" className="rounded-xl border bg-muted/30 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div
                aria-hidden="true"
                className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-semibold text-primary-foreground"
              >
                {`${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase() || (
                  <UserRound className="size-6" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-semibold break-words">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="size-4 shrink-0" aria-hidden="true" />
                  <span className="break-all">{user.email}</span>
                </p>
              </div>
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full border bg-background px-3 py-1 text-xs font-medium">
                <ShieldCheck className="size-3.5" aria-hidden="true" />
                <span className="sr-only">Account role: </span>
                <span className="capitalize">{user.role.replace(/^ROLE_/, "").toLowerCase()}</span>
              </span>
            </div>
          </section>

          <ProfileForm key={user.id} user={user} />
        </>
      )}
    </div>
  );
}
