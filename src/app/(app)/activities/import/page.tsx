import { requireUser } from "@/lib/auth";
import { requireRole } from "@/lib/nav-guard";
import { ImportActivityForm } from "./import-activity-form";

export default async function ImportActivityPage() {
  const user = await requireUser();
  requireRole(user.role, "STUDENT");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Importar archivo</h1>
        <p className="text-muted-foreground">
          Subí un archivo .gpx exportado de Strava, Garmin u otra app.
        </p>
      </div>
      <ImportActivityForm />
    </div>
  );
}
