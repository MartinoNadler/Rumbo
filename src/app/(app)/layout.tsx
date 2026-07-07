import { requireUser } from "@/lib/auth";
import { AppShell } from "@/components/nav/app-shell";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  return (
    <AppShell role={user.role} userName={user.name}>
      {children}
    </AppShell>
  );
}
