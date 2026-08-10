import {
  LayoutDashboard,
  Building2,
  FolderKanban,
  CheckSquare,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavigationItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

export const navigationItems: NavigationItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Organizations",
    url: "/organizations",
    icon: Building2,
  },
  {
    title: "Projects",
    url: "/projects",
    icon: FolderKanban,
  },
  {
    title: "Tasks",
    url: "/tasks",
    icon: CheckSquare,
  },
];

export const secondaryNavigationItems: NavigationItem[] = [
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];
