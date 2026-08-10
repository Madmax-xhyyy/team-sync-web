import { Building2, FolderKanban, Users } from "lucide-react";

import { StatCard } from "@/features/dashboard/components/StatCard";

export function OrganizationStats() {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      <StatCard title="Members" value={12} description="Active users" icon={Users} />

      <StatCard
        title="Projects"
        value={8}
        description="Within this organization"
        icon={FolderKanban}
      />

      <StatCard title="Teams" value={3} description="Departments" icon={Building2} />
    </section>
  );
}
