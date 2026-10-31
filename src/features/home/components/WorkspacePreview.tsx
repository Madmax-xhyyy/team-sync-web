import { Check, Circle, FolderKanban, LayoutGrid } from "lucide-react";

const columns = [
  {
    title: "To do",
    dot: "bg-muted-foreground",
    tasks: [
      { title: "Map out the user journey", category: "Planning", initials: "JL" },
      { title: "Write the launch checklist", category: "Content", initials: "AM" },
    ],
  },
  {
    title: "In progress",
    dot: "bg-warning",
    tasks: [
      { title: "Design the home page", category: "Design", initials: "AM" },
      { title: "Build the project board", category: "Development", initials: "SK" },
    ],
  },
  {
    title: "Done",
    dot: "bg-success",
    tasks: [
      { title: "Bring the team together", category: "Workspace", initials: "JL" },
      { title: "Define our project goals", category: "Planning", initials: "SK" },
    ],
  },
];

export function WorkspacePreview() {
  return (
    <figure className="relative min-w-0">
      <div className="rounded-3xl bg-surface p-3 sm:p-6 lg:-mr-6 lg:p-5 xl:p-7">
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-workspace">
          <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-4 sm:px-5">
            <div className="flex min-w-0 items-center gap-2 text-[11px] text-muted-foreground">
              <FolderKanban className="size-4 shrink-0 text-brand" aria-hidden="true" />
              <span>Workspace</span>
              <span aria-hidden="true">/</span>
              <span className="truncate font-medium text-foreground">Website launch</span>
            </div>
            <span className="shrink-0 rounded-md bg-muted px-2 py-1 text-[9px] font-medium tracking-wide text-muted-foreground uppercase">
              Example
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-6 pb-5 sm:px-5">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                A fresh start, together.
              </h2>
              <p className="mt-1 text-[11px] text-muted-foreground">Website launch · 6 tasks</p>
            </div>
            <div aria-label="Three example teammates" className="flex -space-x-1.5">
              {["AM", "JL", "SK"].map((initials, index) => (
                <span
                  key={initials}
                  className={`flex size-7 items-center justify-center rounded-full border-2 border-card text-[9px] font-semibold ${index === 1 ? "bg-info-muted text-info" : index === 2 ? "bg-warning-muted text-warning" : "bg-success-muted text-success"}`}
                >
                  {initials}
                </span>
              ))}
            </div>
          </div>

          <div className="mx-4 mb-4 flex items-center gap-1.5 border-b border-border pb-3 text-[11px] font-medium text-brand sm:mx-5">
            <LayoutGrid className="size-3" aria-hidden="true" />
            Project board
          </div>

          <div className="grid grid-cols-1 gap-3 px-4 pb-5 min-[420px]:grid-cols-3 sm:px-5">
            {columns.map((column) => (
              <div key={column.title} className="min-w-0 rounded-lg bg-muted p-2.5">
                <div className="mb-3 flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
                  <span className={`size-1.5 shrink-0 rounded-full ${column.dot}`} />
                  <span>{column.title}</span>
                  <span className="ml-auto text-muted-foreground">2</span>
                </div>
                <div className="grid grid-cols-2 gap-2.5 min-[420px]:grid-cols-1">
                  {column.tasks.map((task) => (
                    <div
                      key={task.title}
                      className="flex min-h-28 flex-col rounded-md border border-border bg-card p-2.5"
                    >
                      <p
                        className={`text-[11px] leading-relaxed font-medium ${column.title === "Done" ? "text-muted-foreground" : "text-foreground"}`}
                      >
                        {task.title}
                      </p>
                      <p className="mt-2 text-[9px] text-muted-foreground">{task.category}</p>
                      <div className="mt-auto flex items-center justify-between pt-3">
                        {column.title === "Done" ? (
                          <Check className="size-3 text-success" aria-hidden="true" />
                        ) : (
                          <Circle className="size-3 text-muted-foreground" aria-hidden="true" />
                        )}
                        <span className="flex size-5 items-center justify-center rounded-full bg-secondary text-[8px] font-medium text-secondary-foreground">
                          {task.initials}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <figcaption className="mt-4 text-center text-[11px] tracking-wide text-muted-foreground">
        Your people, your projects, your next step. All in one place.
      </figcaption>
    </figure>
  );
}
