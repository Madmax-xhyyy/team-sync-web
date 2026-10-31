import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { UsersRound } from "lucide-react";

import { login } from "@/features/auth/api/auth.api";
import { loginSchema, type LoginFormData } from "@/features/auth/schemas/auth.schemas";
import { useAuthStore } from "@/stores/auth.store";
import { getApiErrorMessage } from "@/lib/api-error";
import { ThemeToggle } from "@/components/ThemeToggle";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const registeredEmail =
    typeof location.state?.registeredEmail === "string" ? location.state.registeredEmail : "";

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: registeredEmail,
      password: "",
    },
  });

  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const onSubmit = async (data: LoginFormData) => {
    clearErrors("root");
    try {
      const response = await login(data);

      setAccessToken(response.data.accessToken);
      navigate("/organizations", { replace: true });
    } catch (error) {
      setError("root.server", {
        message: getApiErrorMessage(error, "Unable to sign in. Please try again."),
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="fixed top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full max-w-md space-y-6">
        <Link
          to="/"
          aria-label="TeamSync home"
          className="mb-10 flex w-fit items-center gap-2 rounded-sm text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <UsersRound className="size-4" aria-hidden="true" />
          </span>
          TeamSync
        </Link>
        <div>
          <h1 className="text-2xl font-semibold">Sign in</h1>

          <p className="text-muted-foreground">Sign in to your TeamSync account.</p>
        </div>

        {registeredEmail && (
          <p role="status" className="rounded-md border bg-muted p-3 text-sm">
            Your account has been created. Sign in to get started.
          </p>
        )}

        <div className="space-y-2">
          <label htmlFor="email">Email</label>

          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register("email")}
            className="w-full rounded-md border px-3 py-2"
          />

          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="password">Password</label>

          <input
            id="password"
            type="password"
            autoComplete="current-password"
            {...register("password")}
            className="w-full rounded-md border px-3 py-2"
          />

          {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
        </div>

        {errors.root?.server && (
          <p role="alert" className="text-sm text-destructive">
            {errors.root.server.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}
