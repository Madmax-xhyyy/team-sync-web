import { Navigate, RouteObject } from "react-router-dom";
import { AppLayout } from "@/app/layouts/AppLayout";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },

  {
    path: "/login",
    element: <LoginPage />,
  },

  {
    path: "/register",
    element: <div>Register Page</div>,
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: "/dashboard",
            element: <DashboardPage />,
          },
          {
            path: "/organizations",
            element: <div>Organizations</div>,
          },
          {
            path: "/projects",
            element: <div>Projects</div>,
          },
          {
            path: "/tasks",
            element: <div>Tasks</div>,
          },
        ],
      },
    ],
  },

  {
    path: "*",
    element: <div>404 - Page Not Found</div>,
  },
];
