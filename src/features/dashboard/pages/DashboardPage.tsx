import { CheckSquare, FolderKanban, Users, ListTodo } from "lucide-react";

import { DashboardHeader } from "../components/DashboardHeader";
import { RecentProjects } from "../components/RecentProjects";
import { StatCard } from "../components/StatCard";

export function DashboardPage() {
  return (
    <div>
      <DashboardHeader />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Projects" value={8} description="Active projects" icon={FolderKanban} />

        <StatCard title="Tasks" value={42} description="Total assigned tasks" icon={ListTodo} />

        <StatCard title="Completed" value={27} description="Tasks completed" icon={CheckSquare} />

        <StatCard title="Team Members" value={12} description="Active members" icon={Users} />
      </section>

      <section className="mt-6">
        <RecentProjects />
      </section>
    </div>
  );
}
