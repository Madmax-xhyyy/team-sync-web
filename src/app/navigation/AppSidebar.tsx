import { Link, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { navigationItems, secondaryNavigationItems } from "./navigation.config";

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>TeamSync</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const Icon = item.icon;

                const isActive =
                  location.pathname === item.url || location.pathname.startsWith(`${item.url}/`);

                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton isActive={isActive}>
                      <Link to={item.url} className="flex w-full items-center gap-2">
                        <Icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryNavigationItems.map((item) => {
                const Icon = item.icon;

                const isActive =
                  location.pathname === item.url || location.pathname.startsWith(`${item.url}/`);

                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton isActive={isActive}>
                      <Link to={item.url} className="flex w-full items-center gap-2">
                        <Icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="p-2 text-xs text-muted-foreground">TeamSync</div>
      </SidebarFooter>
    </Sidebar>
  );
}
