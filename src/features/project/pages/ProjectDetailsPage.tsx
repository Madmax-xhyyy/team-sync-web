import { Link, useParams } from "react-router-dom";

import { ArrowLeft } from "lucide-react";

import { useProject } from "@/features/project/hooks/useProject";

export function ProjectDetailsPage() {
  const { organizationId = "", projectId = "" } = useParams();

  const { data: project, isLoading, isError } = useProject(organizationId, projectId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-5 w-32 animate-pulse rounded bg-muted" />

        <div className="rounded-xl border p-6">
          <div className="h-7 w-64 animate-pulse rounded bg-muted" />

          <div className="mt-3 h-4 w-96 animate-pulse rounded bg-muted" />
        </div>
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="space-y-4">
        <Link
          to={`/organizations/${organizationId}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to organization
        </Link>

        <div className="rounded-xl border p-6 text-sm text-destructive">Project not found.</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <Link
          to={`/organizations/${organizationId}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to organization
        </Link>
      </div>

      <section className="rounded-xl border p-6">
        <h1 className="text-2xl font-bold">{project.name}</h1>

        {project.description && (
          <p className="mt-2 text-sm text-muted-foreground">{project.description}</p>
        )}
      </section>

      <section className="rounded-xl border">
        <div className="border-b p-6">
          <h2 className="font-semibold">Task Board</h2>

          <p className="mt-1 text-sm text-muted-foreground">Manage tasks for this project.</p>
        </div>

        <div className="p-6 text-sm text-muted-foreground">Task board will be added next.</div>
      </section>
    </div>
  );
}
