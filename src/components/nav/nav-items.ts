import type { Role } from "@prisma/client";
import {
  Award,
  BarChart3,
  CalendarCheck,
  MessageSquare,
  Settings,
  TrendingUp,
  Users,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: typeof Award;
};

export const NAV_ITEMS: Record<Role, NavItem[]> = {
  STUDENT: [
    { href: "/hoy", label: "Hoy", icon: CalendarCheck },
    { href: "/feed", label: "Feed", icon: MessageSquare },
    { href: "/stats", label: "Stats", icon: BarChart3 },
    { href: "/progreso", label: "Progreso", icon: TrendingUp },
    { href: "/logros", label: "Logros", icon: Award },
    { href: "/config", label: "Config", icon: Settings },
  ],
  PROFESSOR: [
    { href: "/grupos", label: "Grupos", icon: Users },
    { href: "/feed", label: "Feed", icon: MessageSquare },
    { href: "/stats", label: "Stats", icon: BarChart3 },
    { href: "/config", label: "Config", icon: Settings },
  ],
};

export const DEFAULT_ROUTE: Record<Role, string> = {
  STUDENT: "/hoy",
  PROFESSOR: "/grupos",
};
