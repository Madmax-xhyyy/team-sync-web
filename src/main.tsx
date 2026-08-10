import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { router } from "./app/router";
import { AppProviders } from "./app/providers/AppProviders";
import { bootstrapAuth } from "@/features/auth/services/auth.bootstrap";

import "./index.css";

async function bootstrap() {
  await bootstrapAuth();
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    </StrictMode>,
  );
}

bootstrap();
