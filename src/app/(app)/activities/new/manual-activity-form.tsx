"use client";

import { useActionState } from "react";
import { createManualActivity } from "./actions";
import { ACTIVITY_TYPES, FEELINGS } from "@/lib/activities/manual-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

const FEELING_LABELS: Record<(typeof FEELINGS)[number], string> = {
  GREAT: "Genial",
  GOOD: "Bien",
  OK: "Regular",
  BAD: "Mal",
};

export function ManualActivityForm() {
  const [state, formAction, isPending] = useActionState(createManualActivity, undefined);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <Card>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="type">Deporte</Label>
              <select
                id="type"
                name="type"
                defaultValue={ACTIVITY_TYPES[0]}
                className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
              >
                {ACTIVITY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="startDate">Fecha</Label>
              <Input id="startDate" name="startDate" type="date" defaultValue={today} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="distanceKm">Distancia (km)</Label>
              <Input id="distanceKm" name="distanceKm" type="number" step="0.01" min="0" required />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="durationMin">Duración (min)</Label>
              <Input id="durationMin" name="durationMin" type="number" step="0.1" min="0" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="movingMin">Tiempo en movimiento (min)</Label>
              <Input id="movingMin" name="movingMin" type="number" step="0.1" min="0" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="elevationGainMeters">Desnivel positivo (m)</Label>
              <Input id="elevationGainMeters" name="elevationGainMeters" type="number" step="1" min="0" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="avgHeartRate">FC promedio</Label>
              <Input id="avgHeartRate" name="avgHeartRate" type="number" min="0" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="maxHeartRate">FC máxima</Label>
              <Input id="maxHeartRate" name="maxHeartRate" type="number" min="0" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="avgCadence">Cadencia</Label>
              <Input id="avgCadence" name="avgCadence" type="number" min="0" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="calories">Calorías</Label>
              <Input id="calories" name="calories" type="number" min="0" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="feeling">Sensación</Label>
              <select
                id="feeling"
                name="feeling"
                defaultValue=""
                className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
              >
                <option value="">Sin especificar</option>
                {FEELINGS.map((f) => (
                  <option key={f} value={f}>
                    {FEELING_LABELS[f]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="notes">Comentarios</Label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
              placeholder="¿Cómo te sentiste? ¿Algo para recordar de este entrenamiento?"
            />
          </div>

          {state?.error && (
            <p className="text-sm text-red-500" role="alert">
              {state.error}
            </p>
          )}

          <Button type="submit" disabled={isPending} className="mt-2">
            {isPending ? "Guardando..." : "Guardar actividad"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
