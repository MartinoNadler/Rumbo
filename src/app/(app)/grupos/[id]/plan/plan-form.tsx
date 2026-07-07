"use client";

import { useActionState, useMemo, useState } from "react";
import { savePlanAction } from "./actions";
import { INTENSITIES } from "@/lib/workouts/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

type Student = { userId: string; name: string };

const DAY_LABEL = new Intl.DateTimeFormat("es-AR", {
  weekday: "short",
  day: "2-digit",
  month: "2-digit",
  timeZone: "UTC",
});

function addDays(date: Date, days: number) {
  const copy = new Date(date);
  copy.setUTCDate(copy.getUTCDate() + days);
  return copy;
}

export function PlanForm({ groupId, students }: { groupId: string; students: Student[] }) {
  const action = savePlanAction.bind(
    null,
    groupId,
    students.map((s) => s.userId)
  );
  const [state, formAction, isPending] = useActionState(action, undefined);

  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [planLength, setPlanLength] = useState<7 | 30>(7);

  const days = useMemo(() => {
    const base = new Date(`${startDate}T00:00:00Z`);
    return Array.from({ length: planLength }, (_, i) => addDays(base, i));
  }, [startDate, planLength]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="startDate" value={startDate} />
      <input type="hidden" name="planLength" value={planLength} />

      <Card>
        <CardContent className="flex flex-wrap gap-4">
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
            <Label htmlFor="startDateInput">Empieza</Label>
            <Input
              id="startDateInput"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="planLengthInput">Duración</Label>
            <select
              id="planLengthInput"
              value={planLength}
              onChange={(e) => setPlanLength(Number(e.target.value) as 7 | 30)}
              className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
            >
              <option value={7}>1 semana</option>
              <option value={30}>1 mes</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-2">
        {days.map((date, i) => {
          const key = date.toISOString().slice(0, 10);
          return (
            <Card key={key}>
              <CardContent className="flex flex-wrap items-center gap-3 py-3">
                <span className="w-16 shrink-0 text-sm font-medium capitalize text-muted-foreground">
                  {DAY_LABEL.format(date)}
                </span>
                <Input
                  name={`type_${i}`}
                  placeholder="Tipo de entrenamiento (vacío = descanso)"
                  className="min-w-48 flex-1"
                />
                <select
                  name={`intensity_${i}`}
                  defaultValue=""
                  className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
                >
                  <option value="">Intensidad</option>
                  {INTENSITIES.map((intensity) => (
                    <option key={intensity} value={intensity}>
                      {intensity}
                    </option>
                  ))}
                </select>
                <Input
                  name={`distanceKm_${i}`}
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="km"
                  className="w-20"
                />
                <Input
                  name={`durationMin_${i}`}
                  type="number"
                  step="1"
                  min="0"
                  placeholder="min"
                  className="w-20"
                />
              </CardContent>
            </Card>
          );
        })}
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

      <Button type="submit" disabled={isPending} className="self-start">
        {isPending ? "Guardando..." : "Guardar plan"}
      </Button>
    </form>
  );
}
