import { requireUser } from "@/lib/auth";
import { requireRole } from "@/lib/nav-guard";
import { PagePlaceholder } from "@/components/page-placeholder";

export default async function HoyPage() {
  const user = await requireUser();
  requireRole(user.role, "STUDENT");

  return (
    <PagePlaceholder
      title="Hoy"
      description="Entrenamiento del día, objetivo y acceso rápido para cargar tu actividad."
    />
  );
}
