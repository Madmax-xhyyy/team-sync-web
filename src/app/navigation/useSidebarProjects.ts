import { useQuery } from "@tanstack/react-query";

import { getProjects } from "@/features/project/api/projects.api";

async function getAllProjects(organizationId: string) {
  const firstPage = await getProjects(organizationId, { page: 0, size: 100 });
  const projects = [...firstPage.content];

  for (let page = 1; page < firstPage.totalPages; page += 1) {
    const nextPage = await getProjects(organizationId, { page, size: 100 });
    projects.push(...nextPage.content);
  }

  return projects;
}

export function useSidebarProjects(organizationId: string) {
  const query = useQuery({
    // Share the mutation invalidation prefix with the organization project list.
    queryKey: ["organization-projects", organizationId, "sidebar"],
    queryFn: () => getAllProjects(organizationId),
    enabled: Boolean(organizationId),
  });

  return {
    projects: [...(query.data ?? [])].sort((a, b) => a.name.localeCompare(b.name)),
    isLoading: query.isPending,
    isError: query.isError,
    retry: () => void query.refetch(),
  };
}
