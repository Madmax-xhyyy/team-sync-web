import { LayoutDashboard, UsersRound, type LucideIcon } from "lucide-react";

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

  {
    title: "Team",
    url: "/team",
    icon: UsersRound,
  },
];
