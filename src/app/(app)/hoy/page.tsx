import Link from "next/link";
import { Plus, Upload } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { requireRole } from "@/lib/nav-guard";
import { getRecentActivities } from "@/lib/activities/list";
import { getPreviousWorkout, getTodaysWorkout } from "@/lib/workouts/list";
import { formatDate, formatDistance, formatDuration, formatPace } from "@/lib/format";
import { buttonVariants, Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { setWorkoutStatusAction } from "./actions";

const STATUS_LABELS = { PENDING: "Pendiente", DONE: "Completado", SKIPPED: "Salteado" } as const;

function formatTarget(distanceMeters: number | null, durationSec: number | null) {
  const parts: string[] = [];
  if (distanceMeters) parts.push(formatDistance(distanceMeters));
  if (durationSec) parts.push(formatDuration(durationSec));
  return parts.length ? parts.join(" · ") : null;
}

export default async function HoyPage() {
  const user = await requireUser();
  requireRole(user.role, "STUDENT");

  const [todaysWorkout, previousWorkout, activities] = await Promise.all([
    getTodaysWorkout(user),
    getPreviousWorkout(user),
    getRecentActivities(user),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Hoy</h1>
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

      <Card>
        <CardHeader>
          <CardTitle>Entrenamiento del día</CardTitle>
          {!todaysWorkout && (
            <CardDescription>Tu profesor todavía no te asignó nada para hoy.</CardDescription>
          )}
        </CardHeader>
        {todaysWorkout && (
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-lg font-medium">{todaysWorkout.type}</p>
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                {STATUS_LABELS[todaysWorkout.status]}
              </span>
            </div>
            {todaysWorkout.goal && (
              <p className="text-sm">
                <span className="text-muted-foreground">Objetivo: </span>
                {todaysWorkout.goal}
              </p>
            )}
            {todaysWorkout.description && (
              <p className="text-sm text-muted-foreground">{todaysWorkout.description}</p>
            )}
            <div className="flex gap-4 text-sm text-muted-foreground">
              {todaysWorkout.intensity && <span>Intensidad: {todaysWorkout.intensity}</span>}
              {formatTarget(todaysWorkout.targetDistanceMeters, todaysWorkout.targetDurationSec) && (
                <span>
                  {formatTarget(todaysWorkout.targetDistanceMeters, todaysWorkout.targetDurationSec)}
                </span>
              )}
            </div>
            {todaysWorkout.status === "PENDING" && (
              <div className="mt-2 flex gap-2">
                <form action={setWorkoutStatusAction.bind(null, todaysWorkout.id, "DONE")}>
                  <Button type="submit" size="sm">
                    Marcar como hecho
                  </Button>
                </form>
                <form action={setWorkoutStatusAction.bind(null, todaysWorkout.id, "SKIPPED")}>
                  <Button type="submit" size="sm" variant="outline">
                    Marcar como salteado
                  </Button>
                </form>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {previousWorkout && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Entrenamiento anterior</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between py-0">
            <div>
              <p className="font-medium">{previousWorkout.type}</p>
              <p className="text-sm text-muted-foreground">{formatDate(previousWorkout.date)}</p>
            </div>
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              {STATUS_LABELS[previousWorkout.status]}
            </span>
          </CardContent>
        </Card>
      )}

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
