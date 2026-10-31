import { Navigate, RouteObject } from "react-router-dom";
import { AppLayout } from "@/app/layouts/AppLayout";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { RegisterPage } from "@/features/auth/pages/RegisterPage";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";
import { OrganizationsPage } from "@/features/organizations/pages/OrganizationsPage";
import { OrganizationDetailsPage } from "@/features/organizations/pages/OrganizationDetailsPage";
import { ProjectDetailsPage } from "@/features/project/pages/ProjectDetailsPage";
import { ProfilePage } from "@/features/user/pages/ProfilePage";

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
    element: <RegisterPage />,
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
            element: <OrganizationsPage />,
          },
          {
            path: "/organizations/:organizationId",
            element: <OrganizationDetailsPage />,
          },
          {
            path: "organizations/:organizationId/projects/:projectId",
            element: <ProjectDetailsPage />,
          },
          {
            path: "/tasks",
            element: <div>Tasks</div>,
          },
          {
            path: "/profile",
            element: <ProfilePage />,
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
