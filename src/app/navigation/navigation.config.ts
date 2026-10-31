import { LayoutDashboard, UserRound, type LucideIcon } from "lucide-react";

export interface NavigationItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

export const navigationItems: NavigationItem[] = [
  {
    title: "Overview",
    url: "",
    icon: LayoutDashboard,
  },
];

export const secondaryNavigationItems: NavigationItem[] = [
  {
    title: "Profile",
    url: "/profile",
    icon: UserRound,
  },
];
