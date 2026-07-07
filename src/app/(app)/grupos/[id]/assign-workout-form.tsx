"use client";

import { useActionState } from "react";
import { assignWorkoutAction } from "./actions";
import { INTENSITIES } from "@/lib/workouts/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Student = { membershipId: string; userId: string; name: string };

export function AssignWorkoutForm({ groupId, students }: { groupId: string; students: Student[] }) {
  const action = assignWorkoutAction.bind(null, groupId, students.map((s) => s.userId));
  const [state, formAction, isPending] = useActionState(action, undefined);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Asignar entrenamiento</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="studentId">Para</Label>
              <select
                id="studentId"
                name="studentId"
                defaultValue="ALL"
                className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
              >
                <option value="ALL">Todo el grupo</option>
                {students.map((s) => (
                  <option key={s.userId} value={s.userId}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="date">Fecha</Label>
              <Input id="date" name="date" type="date" defaultValue={today} required />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="type">Tipo de entrenamiento</Label>
            <Input id="type" name="type" placeholder="Ej: Rodaje suave, Series 8x400m" required />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="goal">Objetivo</Label>
            <Input id="goal" name="goal" placeholder="Ej: Mejorar resistencia aeróbica" />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Descripción</Label>
            <textarea
              id="description"
              name="description"
              rows={2}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
              placeholder="Detalle del entrenamiento"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="intensity">Intensidad</Label>
              <select
                id="intensity"
                name="intensity"
                defaultValue=""
                className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
              >
                <option value="">Sin especificar</option>
                {INTENSITIES.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="targetDistanceKm">Distancia (km)</Label>
              <Input id="targetDistanceKm" name="targetDistanceKm" type="number" step="0.1" min="0" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="targetDurationMin">Duración (min)</Label>
              <Input id="targetDurationMin" name="targetDurationMin" type="number" step="1" min="0" />
            </div>
          </div>

          {state?.error && (
            <p className="text-sm text-red-500" role="alert">
              {state.error}
            </p>
          )}
          {state?.message && (
            <p className="text-sm text-emerald-600" role="status">
              {state.message}
            </p>
          )}

          <Button type="submit" disabled={isPending} className="mt-2">
            {isPending ? "Asignando..." : "Asignar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
