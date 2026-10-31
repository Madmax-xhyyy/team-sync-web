import { useSidebar } from "@/components/ui/sidebar-context";
import { useId, useState } from "react";
import { ChevronRight, FolderKanban } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

import { navigationItems, secondaryNavigationItems } from "./navigation.config";
import { useSidebarProjects } from "./useSidebarProjects";
import { OrganizationSwitcher } from "./OrganizationSwitcher";

export function AppSidebar() {
  const { pathname } = useLocation();
  const { organizationId = "" } = useParams();
  const organizationUrl = `/organizations/${organizationId}`;
  const { setOpenMobile } = useSidebar();
  const [projectsOpen, setProjectsOpen] = useState(true);
  const projectsId = useId();
  const { projects, isLoading, isError, retry } = useSidebarProjects(organizationId);
  const closeMobile = () => setOpenMobile(false);
  const isActive = (url: string) => pathname === url || pathname.startsWith(`${url}/`);

  return (
    <Sidebar>
      <SidebarHeader className="h-16 justify-center border-b border-sidebar-border px-4">
        <OrganizationSwitcher />
      </SidebarHeader>

      <SidebarContent>
        <nav aria-label="Main navigation">
          <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const url = `${organizationUrl}${item.url}`;
                  const active = pathname === url;

                  return (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton
                        render={<Link to={url} />}
                        isActive={active}
                        aria-current={active ? "page" : undefined}
                        onClick={closeMobile}
                        className="h-10"
                      >
                        <Icon aria-hidden="true" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}

                <SidebarMenuItem>
                  <SidebarMenuButton
                    type="button"
                    aria-expanded={projectsOpen}
                    aria-controls={projectsId}
                    onClick={() => setProjectsOpen((open) => !open)}
                    className="h-10"
                  >
                    <FolderKanban aria-hidden="true" />
                    <span className="flex-1">Projects</span>
                    {!isLoading && !isError && (
                      <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs text-muted-foreground tabular-nums">
                        {projects.length}
                      </span>
                    )}
                    <ChevronRight
                      aria-hidden="true"
                      className={`text-muted-foreground transition-transform motion-reduce:transition-none ${projectsOpen ? "rotate-90" : ""}`}
                    />
                  </SidebarMenuButton>

                  <div id={projectsId} hidden={!projectsOpen}>
                    <SidebarMenuSub>
                      {projects.map((project) => {
                        const url = `/organizations/${project.organizationId}/projects/${project.id}`;

                        return (
                          <SidebarMenuSubItem key={`${project.organizationId}/${project.id}`}>
                            <SidebarMenuSubButton
                              render={<Link to={url} />}
                              isActive={isActive(url)}
                              aria-current={isActive(url) ? "page" : undefined}
                              title={project.name}
                              onClick={closeMobile}
                              className="h-auto min-h-9 py-2"
                            >
                              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                                <span className="truncate">{project.name}</span>
                              </span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}

                      {isLoading && (
                        <SidebarMenuSubItem>
                          <p role="status" className="px-2 py-3 text-xs text-muted-foreground">
                            Loading projects…
                          </p>
                        </SidebarMenuSubItem>
                      )}

                      {isError && (
                        <SidebarMenuSubItem className="px-2 py-3 text-xs">
                          <p role="status" className="text-muted-foreground">
                            {projects.length
                              ? "Some projects couldn’t load."
                              : "Couldn’t load projects."}
                          </p>
                          <button
                            type="button"
                            onClick={retry}
                            className="mt-2 rounded-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring"
                          >
                            Try again
                          </button>
                        </SidebarMenuSubItem>
                      )}

                      {!isLoading && !isError && projects.length === 0 && (
                        <SidebarMenuSubItem className="px-2 py-3">
                          <p className="text-xs text-muted-foreground">No projects yet.</p>
                          <Link
                            to={organizationUrl}
                            onClick={closeMobile}
                            className="mt-2 inline-block rounded-sm text-xs font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring"
                          >
                            View organization
                          </Link>
                        </SidebarMenuSubItem>
                      )}
                    </SidebarMenuSub>
                  </div>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </nav>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <nav aria-label="Account navigation">
          <SidebarMenu>
            {secondaryNavigationItems.map((item) => {
              const Icon = item.icon;

              return (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    render={<Link to={item.url} />}
                    isActive={isActive(item.url)}
                    aria-current={isActive(item.url) ? "page" : undefined}
                    onClick={closeMobile}
                    className="h-10"
                  >
                    <Icon aria-hidden="true" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </nav>
      </SidebarFooter>
    </Sidebar>
  );
}
