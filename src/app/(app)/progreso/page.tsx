import { requireUser } from "@/lib/auth";
import { requireRole } from "@/lib/nav-guard";
import { PagePlaceholder } from "@/components/page-placeholder";

export default async function ProgresoPage() {
  const user = await requireUser();
  requireRole(user.role, "STUDENT");

  return (
    <PagePlaceholder
      title="Progreso"
      description="Calendario anual, evolución semanal y mensual, rachas y estadísticas generales."
    />
  );
}
