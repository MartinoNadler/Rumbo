"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { requireRole } from "@/lib/nav-guard";
import { assignPlan, type PlanEntry } from "@/lib/workouts/create";

export type SavePlanState = { error?: string; message?: string } | undefined;

export async function savePlanAction(
  groupId: string,
  studentIds: string[],
  _prevState: SavePlanState,
  formData: FormData
): Promise<SavePlanState> {
  const user = await requireUser();
  requireRole(user.role, "PROFESSOR");

  const studentId = formData.get("studentId") as string;
  const targetIds = studentId === "ALL" ? studentIds : [studentId];
  if (targetIds.length === 0) {
    return { error: "El grupo todavía no tiene alumnos." };
  }

  const startDateRaw = formData.get("startDate") as string;
  const planLength = parseInt((formData.get("planLength") as string) ?? "7", 10);
  if (!startDateRaw || !planLength) {
    return { error: "Elegí una fecha de inicio y la duración del plan." };
  }
  const startDate = new Date(startDateRaw);

  const entries: PlanEntry[] = [];
  for (let i = 0; i < planLength; i++) {
    const type = (formData.get(`type_${i}`) as string)?.trim();
    if (!type) continue;

    const distanceKm = formData.get(`distanceKm_${i}`) as string;
    const durationMin = formData.get(`durationMin_${i}`) as string;
    const date = new Date(startDate);
    date.setUTCDate(date.getUTCDate() + i);

    entries.push({
      date,
      type,
      intensity: (formData.get(`intensity_${i}`) as string) || null,
      targetDistanceMeters: distanceKm ? parseFloat(distanceKm) * 1000 : null,
      targetDurationSec: durationMin ? Math.round(parseFloat(durationMin) * 60) : null,
    });
  }

  if (entries.length === 0) {
    return { error: "Completá al menos un día del plan." };
  }

  await assignPlan(user, groupId, targetIds, entries);
  revalidatePath(`/grupos/${groupId}`);
  return { message: `Plan guardado: ${entries.length} entrenamiento(s) asignado(s).` };
}
