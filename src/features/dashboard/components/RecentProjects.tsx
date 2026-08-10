import { Link } from "react-router-dom";

const projects = [
  {
    id: "1",
    name: "TeamSync Web",
    status: "In Progress",
    tasks: 24,
  },
  {
    id: "2",
    name: "Mobile Application",
    status: "Planning",
    tasks: 12,
  },
  {
    id: "3",
    name: "Marketing Website",
    status: "Completed",
    tasks: 31,
  },
];

export function RecentProjects() {
  return (
    <div className="rounded-xl border bg-card">
      <div className="flex items-center justify-between border-b p-5">
        <div>
          <h2 className="font-semibold">Recent Projects</h2>

          <p className="text-sm text-muted-foreground">Your most recently updated projects.</p>
        </div>

        <Link to="/projects" className="text-sm font-medium hover:underline">
          View all
        </Link>
      </div>

      <div className="divide-y">
        {projects.map((project) => (
          <Link
            key={project.id}
            to={`/projects/${project.id}`}
            className="flex items-center justify-between p-5 transition-colors hover:bg-muted/50"
          >
            <div>
              <p className="font-medium">{project.name}</p>

              <p className="mt-1 text-sm text-muted-foreground">{project.tasks} tasks</p>
            </div>

            <span className="text-sm text-muted-foreground">{project.status}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
