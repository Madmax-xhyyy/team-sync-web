import { Link, useParams, useSearchParams } from "react-router-dom";

import { Tabs } from "@base-ui/react/tabs";
import { ArrowLeft, ListTodo, Kanban, List, FolderKanban } from "lucide-react";

import { useProject } from "@/features/project/hooks/useProject";

import { TaskBoard } from "@/features/tasks/components/TaskBoard";

export function ProjectDetailsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedView = searchParams.get("view");
  const view = requestedView === "board" || requestedView === "list" ? requestedView : "backlog";
  const views = [
    { value: "backlog", label: "Backlog", icon: ListTodo },
    { value: "board", label: "Board", icon: Kanban },
    { value: "list", label: "List", icon: List },
  ] as const;
  const { organizationId = "", projectId = "" } = useParams();

  const { data: project, isLoading, isError } = useProject(organizationId, projectId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-5 w-32 animate-pulse rounded bg-muted" />

        <div className="rounded-xl border p-6">
          <div className="h-7 w-64 animate-pulse rounded bg-muted" />

          <div className="mt-3 h-4 w-full max-w-96 animate-pulse rounded bg-muted" />
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

      <section className="rounded-xl border bg-card p-6 sm:p-8">
        <div className="mb-3 flex items-center gap-2 text-xs font-medium tracking-widest text-primary uppercase">
          <FolderKanban className="size-4" aria-hidden="true" />
          Project workspace
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">{project.name}</h1>

        {project.description && (
          <p className="mt-2 text-sm text-muted-foreground">{project.description}</p>
        )}
      </section>

      <Tabs.Root
        value={view}
        onValueChange={(value) => {
          const next = new URLSearchParams(searchParams);
          next.set("view", String(value));
          setSearchParams(next);
        }}
      >
        <Tabs.List aria-label="Project views" className="mb-6 flex gap-2 overflow-x-auto border-b">
          {views.map(({ value, label, icon: Icon }) => (
            <Tabs.Tab
              key={value}
              value={value}
              className="flex items-center gap-2 border-b-2 border-transparent px-4 py-3 text-sm font-medium text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring data-active:border-primary data-active:text-primary"
            >
              <Icon className="size-4" aria-hidden="true" />
              {label}
            </Tabs.Tab>
          ))}
        </Tabs.List>
        {views.map(({ value }) => (
          <Tabs.Panel key={value} value={value} className="min-w-0 outline-none">
            <TaskBoard key={projectId} view={value} />
          </Tabs.Panel>
        ))}
      </Tabs.Root>
    </div>
  );
}
