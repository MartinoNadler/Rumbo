import { requireUser } from "@/lib/auth";
import { AppShell } from "@/components/nav/app-shell";
import { NAV_ITEMS } from "@/components/nav/nav-items";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  return (
    <AppShell navItems={NAV_ITEMS[user.role]} userName={user.name}>
      {children}
    </AppShell>
  );
}
