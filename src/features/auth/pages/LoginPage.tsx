import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { login } from "@/features/auth/api/auth.api";
import { loginSchema, type LoginFormData } from "@/features/auth/schemas/auth.schemas";
import { useAuthStore } from "@/stores/auth.store";

export function LoginPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await login(data);

      setAccessToken(response.data.accessToken);
      navigate("/dashboard", { replace: true });

      console.log("Login successful.");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Sign in</h1>

          <p className="text-muted-foreground">Sign in to your TeamSync account.</p>
        </div>

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

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
