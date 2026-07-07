"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Role } from "@prisma/client";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { logout } from "@/lib/auth-actions";
import { NAV_ITEMS, type NavItem } from "@/components/nav/nav-items";

export function AppShell({
  role,
  userName,
  children,
}: {
  role: Role;
  userName: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const navItems = NAV_ITEMS[role];

  return (
    <div className="flex min-h-dvh flex-col md:flex-row">
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-surface md:flex">
        <div className="px-6 py-5 text-lg font-semibold tracking-tight">
          Running MVP
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3">
          {navItems.map((item) => (
            <NavLink key={item.href} item={item} active={pathname.startsWith(item.href)} />
          ))}
        </nav>
        <div className="flex items-center justify-between border-t border-border px-4 py-4">
          <span className="truncate text-sm text-muted-foreground">{userName}</span>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <form action={logout}>
              <button
                type="submit"
                aria-label="Cerrar sesión"
                className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
              >
                <LogOut className="size-4" />
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="flex items-center justify-between border-b border-border bg-surface px-4 py-3 md:hidden">
        <span className="text-base font-semibold tracking-tight">Running MVP</span>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <form action={logout}>
            <button
              type="submit"
              aria-label="Cerrar sesión"
              className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
            >
              <LogOut className="size-4" />
            </button>
          </form>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <div className="mx-auto max-w-3xl px-4 py-6">{children}</div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-10 flex border-t border-border bg-surface md:hidden">
        {navItems.map((item) => (
          <BottomNavLink key={item.href} item={item} active={pathname.startsWith(item.href)} />
        ))}
      </nav>
    </div>
  );
}

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-foreground text-background"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <Icon className="size-4" />
      {item.label}
    </Link>
  );
}

function BottomNavLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={cn(
        "flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium",
        active ? "text-foreground" : "text-muted-foreground"
      )}
    >
      <Icon className="size-5" />
      {item.label}
    </Link>
  );
}
