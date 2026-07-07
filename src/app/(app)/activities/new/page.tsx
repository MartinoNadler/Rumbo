import { requireUser } from "@/lib/auth";
import { requireRole } from "@/lib/nav-guard";
import { ManualActivityForm } from "./manual-activity-form";

export default async function NewActivityPage() {
  const user = await requireUser();
  requireRole(user.role, "STUDENT");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Cargar actividad</h1>
        <p className="text-muted-foreground">Registrá tu entrenamiento manualmente.</p>
      </div>
      <ManualActivityForm />
    </div>
  );
}
