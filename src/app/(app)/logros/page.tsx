import { requireUser } from "@/lib/auth";
import { requireRole } from "@/lib/nav-guard";
import { PagePlaceholder } from "@/components/page-placeholder";

export default async function LogrosPage() {
  const user = await requireUser();
  requireRole(user.role, "STUDENT");

  return (
    <PagePlaceholder
      title="Logros"
      description="Insignias por distancia, rachas y mejores marcas."
    />
  );
}
