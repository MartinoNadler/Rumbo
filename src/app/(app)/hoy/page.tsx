import Link from "next/link";
import { Plus, Upload } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { requireRole } from "@/lib/nav-guard";
import { getRecentActivities } from "@/lib/activities/list";
import { formatDate, formatDistance, formatDuration, formatPace } from "@/lib/format";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default async function HoyPage() {
  const user = await requireUser();
  requireRole(user.role, "STUDENT");

  const activities = await getRecentActivities(user);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Hoy</h1>
          <p className="text-muted-foreground">Todavía no hay entrenamientos planificados.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/activities/import" className={cn(buttonVariants({ variant: "outline" }))}>
            <Upload className="size-4" />
            Importar archivo
          </Link>
          <Link href="/activities/new" className={cn(buttonVariants())}>
            <Plus className="size-4" />
            Cargar actividad
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-muted-foreground">Tus últimas actividades</h2>
        {activities.length === 0 ? (
          <Card>
            <CardContent className="text-center text-sm text-muted-foreground">
              Todavía no cargaste ninguna actividad.
            </CardContent>
          </Card>
        ) : (
          activities.map((activity) => (
            <Card key={activity.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div>
                  <p className="font-medium">{activity.type}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(activity.startDate)}
                  </p>
                </div>
                <div className="text-right text-sm">
                  <p>{formatDistance(activity.distanceMeters)}</p>
                  <p className="text-muted-foreground">
                    {formatDuration(activity.movingTimeSec)} · {formatPace(activity.avgPaceSecPerKm)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
