import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FolderKanban } from "lucide-react";

import { useProjects } from "../hooks/useProjects";
import { CreateProjectDialog } from "./CreateProjectDialog";

export function ProjectList() {
  const { organizationId = "" } = useParams();
  const [createOpen, setCreateOpen] = useState(false);

  const { data, isLoading, isError } = useProjects(organizationId);

  if (isLoading) {
    return (
      <div className="rounded-xl border">
        <div className="p-6">
          <div className="h-5 w-32 animate-pulse rounded bg-muted" />
        </div>

        <div className="divide-y">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center justify-between p-6">
              <div className="space-y-2">
                <div className="h-4 w-40 animate-pulse rounded bg-muted" />
                <div className="h-3 w-64 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border p-6 text-sm text-destructive">Failed to load projects.</div>
    );
  }

  const projects = data?.content ?? [];

  return (
    <section className="rounded-xl border">
      <div className="flex items-center justify-between border-b p-6">
        <div>
          <h2 className="font-semibold">Projects</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Projects belonging to this organization.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Create Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-10 text-center">
          <FolderKanban className="mb-3 h-8 w-8 text-muted-foreground" />

          <h3 className="font-medium">No projects yet</h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Create a project to start organizing your work.
          </p>
        </div>
      ) : (
        <div className="divide-y">
          {projects.map((project) => (
            <Link
              key={project.id}
              to={`/organizations/${organizationId}/projects/${project.id}`}
              className="block p-6 transition-colors hover:bg-muted/50"
            >
              <div>
                <h3 className="font-medium">{project.name}</h3>

                {project.description && (
                  <p className="mt-1 text-sm text-muted-foreground">{project.description}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
      <CreateProjectDialog open={createOpen} onOpenChange={setCreateOpen} />
    </section>
  );
}
