import { requireUser } from "@/lib/auth";
import { requireRole } from "@/lib/nav-guard";
import { PagePlaceholder } from "@/components/page-placeholder";

export default async function GruposPage() {
  const user = await requireUser();
  requireRole(user.role, "PROFESSOR");

  return (
    <PagePlaceholder
      title="Grupos"
      description="Administrá tus alumnos, creá grupos y asigná entrenamientos."
    />
  );
}
