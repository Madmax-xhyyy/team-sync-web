import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Eye, EyeOff, LoaderCircle, UsersRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { register as registerAccount } from "@/features/auth/api/auth.api";
import { registerSchema, type RegisterFormData } from "@/features/auth/schemas/auth.schemas";
import { getApiErrorMessage } from "@/lib/api-error";

export function RegisterPage() {
  const navigate = useNavigate();
  const [showPasswords, setShowPasswords] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    clearErrors("root");

    try {
      const response = await registerAccount({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      });

      if (!response.success) {
        setError("root.server", {
          message: response.message || "Unable to create your account. Please try again.",
        });
        return;
      }

      navigate("/login", { replace: true, state: { registeredEmail: data.email } });
    } catch (error) {
      setError("root.server", {
        message: getApiErrorMessage(error, "Unable to create your account. Please try again."),
      });
    }
  };

  return (
    <main className="flex min-h-svh items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-10 flex items-center gap-2 text-sm font-semibold">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <UsersRound className="size-4" aria-hidden="true" />
          </span>
          TeamSync
        </div>

        <div className="mb-8 space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
          <p className="text-sm text-muted-foreground">
            Bring your team, projects, and tasks together.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate aria-busy={isSubmitting}>
          <fieldset disabled={isSubmitting} className="space-y-5">
            <legend className="sr-only">Account details</legend>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="first-name" className="text-sm font-medium">
                  First name
                </label>
                <Input
                  id="first-name"
                  autoComplete="given-name"
                  maxLength={50}
                  required
                  aria-invalid={!!errors.firstName}
                  aria-describedby={errors.firstName ? "first-name-error" : undefined}
                  {...register("firstName")}
                  className="h-10"
                />
                {errors.firstName && (
                  <p id="first-name-error" className="text-sm text-destructive">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="last-name" className="text-sm font-medium">
                  Last name
                </label>
                <Input
                  id="last-name"
                  autoComplete="family-name"
                  maxLength={50}
                  required
                  aria-invalid={!!errors.lastName}
                  aria-describedby={errors.lastName ? "last-name-error" : undefined}
                  {...register("lastName")}
                  className="h-10"
                />
                {errors.lastName && (
                  <p id="last-name-error" className="text-sm text-destructive">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                {...register("email")}
                className="h-10"
              />
              {errors.email && (
                <p id="email-error" className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  aria-pressed={showPasswords}
                  aria-controls="password confirm-password"
                  onClick={() => setShowPasswords((visible) => !visible)}
                  className="text-muted-foreground"
                >
                  {showPasswords ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
                  {showPasswords ? "Hide passwords" : "Show passwords"}
                </Button>
              </div>
              <Input
                id="password"
                type={showPasswords ? "text" : "password"}
                autoComplete="new-password"
                required
                aria-invalid={!!errors.password}
                aria-describedby={
                  errors.password ? "password-hint password-error" : "password-hint"
                }
                {...register("password")}
                className="h-10"
              />
              <p id="password-hint" className="text-xs text-muted-foreground">
                Use 8–100 characters.
              </p>
              {errors.password && (
                <p id="password-error" className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="confirm-password" className="text-sm font-medium">
                Confirm password
              </label>
              <Input
                id="confirm-password"
                type={showPasswords ? "text" : "password"}
                autoComplete="new-password"
                required
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
                {...register("confirmPassword")}
                className="h-10"
              />
              {errors.confirmPassword && (
                <p id="confirm-password-error" className="text-sm text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {errors.root?.server && (
              <p
                role="alert"
                className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive"
              >
                {errors.root.server.message}
              </p>
            )}

            <Button type="submit" disabled={isSubmitting} className="h-10 w-full">
              {isSubmitting ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : null}
              {isSubmitting ? "Creating account..." : "Create account"}
              {!isSubmitting && <ArrowRight aria-hidden="true" />}
            </Button>
          </fieldset>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-foreground underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-ring"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
